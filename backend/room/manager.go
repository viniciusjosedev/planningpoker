package room

import (
	"sync"

	"github.com/gorilla/websocket"
)

type Player struct {
	ID          string
	Name        string
	IsSpectator bool
	Vote        *int
	Conn        *websocket.Conn
}

type Room struct {
	Hash     string
	Name     string
	OwnerID  string
	Players  map[string]*Player
	Revealed bool
	mu       sync.RWMutex
}

type Manager struct {
	rooms map[string]*Room
	mu    sync.RWMutex
}

func NewManager() *Manager {
	return &Manager{
		rooms: make(map[string]*Room),
	}
}

func (m *Manager) AddRoom(hash, name, ownerID string) *Room {
	m.mu.Lock()
	defer m.mu.Unlock()

	room := &Room{
		Hash:    hash,
		Name:    name,
		OwnerID: ownerID,
		Players: make(map[string]*Player),
	}
	m.rooms[hash] = room
	return room
}

func (m *Manager) GetRoom(hash string) (*Room, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	room, ok := m.rooms[hash]
	return room, ok
}

func (m *Manager) RemoveRoom(hash string) {
	m.mu.Lock()
	defer m.mu.Unlock()

	delete(m.rooms, hash)
}

func (r *Room) AddPlayer(player *Player) {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.Players[player.ID] = player
}

func (r *Room) GetPlayer(id string) (*Player, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	player, ok := r.Players[id]
	return player, ok
}

func (r *Room) RemovePlayer(id string) {
	r.mu.Lock()
	defer r.mu.Unlock()

	delete(r.Players, id)
}

func (r *Room) RemovePlayerIfConn(id string, conn *websocket.Conn) bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	player, ok := r.Players[id]
	if !ok {
		return false
	}
	if player.Conn != conn {
		return false
	}
	delete(r.Players, id)
	return true
}

func (r *Room) SetVote(playerID string, vote int) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if player, ok := r.Players[playerID]; ok {
		player.Vote = &vote
	}
}

func (r *Room) RevealVotes() {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.Revealed = true
}

func (r *Room) ResetVotes() {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.Revealed = false
	for _, player := range r.Players {
		player.Vote = nil
	}
}

func (r *Room) GetPlayersList() []Player {
	r.mu.RLock()
	defer r.mu.RUnlock()

	players := make([]Player, 0, len(r.Players))
	for _, p := range r.Players {
		players = append(players, *p)
	}
	return players
}

func (r *Room) CalculateAverage() *float64 {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var sum int
	var count int
	for _, player := range r.Players {
		if !player.IsSpectator && player.Vote != nil {
			sum += *player.Vote
			count++
		}
	}

	if count == 0 {
		return nil
	}

	avg := float64(sum) / float64(count)
	return &avg
}

func (r *Room) Broadcast(msg interface{}) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, player := range r.Players {
		player.Conn.WriteJSON(msg)
	}
}

func (r *Room) ToResponse() map[string]interface{} {
	r.mu.RLock()
	defer r.mu.RUnlock()

	players := make([]map[string]interface{}, 0, len(r.Players))
	for _, p := range r.Players {
		playerData := map[string]interface{}{
			"id":          p.ID,
			"name":        p.Name,
			"isSpectator": p.IsSpectator,
		}
		if p.Vote != nil {
			playerData["vote"] = *p.Vote
		} else {
			playerData["vote"] = nil
		}
		players = append(players, playerData)
	}

	avg := r.CalculateAverage()
	var avgPtr *float64
	if avg != nil {
		avgPtr = avg
	}

	return map[string]interface{}{
		"id":       r.Hash,
		"name":     r.Name,
		"ownerId":  r.OwnerID,
		"players":  players,
		"revealed": r.Revealed,
		"average":  avgPtr,
	}
}
