package events

import (
	"planningpoker/room"

	"github.com/gorilla/websocket"
)

type JoinRoomPayload struct {
	RoomID      string `json:"roomId"`
	UserID      string `json:"userId"`
	Name        string `json:"name"`
	IsSpectator bool   `json:"isSpectator"`
}

func JoinRoom(conn *websocket.Conn, payload JoinRoomPayload, manager *room.Manager) {
	r, ok := manager.GetRoom(payload.RoomID)
	if !ok {
		conn.WriteJSON(OutgoingMessage{
			Type:    "error",
			Payload: "Room not found",
		})
		return
	}

	// Verifica se o jogador já existe
	if _, exists := r.GetPlayer(payload.UserID); exists {
		conn.WriteJSON(OutgoingMessage{
			Type:    "error",
			Payload: "Player already in room",
		})
		return
	}

	player := &room.Player{
		ID:          payload.UserID,
		Name:        payload.Name,
		IsSpectator: payload.IsSpectator,
		Conn:        conn,
	}

	r.AddPlayer(player)

	// Notifica o jogador que entrou
	conn.WriteJSON(OutgoingMessage{
		Type:    "roomJoined",
		Payload: r.ToResponse(),
	})

	// Notifica todos os outros jogadores
	r.Broadcast(OutgoingMessage{
		Type:    "roomUpdated",
		Payload: r.ToResponse(),
	})
}
