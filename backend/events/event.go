package events

import (
	"encoding/json"
	"planningpoker/ent"
	"planningpoker/room"

	"github.com/charmbracelet/log"

	"github.com/gorilla/websocket"
)

type Event struct {
	Db      *ent.Client
	Manager *room.Manager
	Conn    *websocket.Conn
	Room    *room.Room
	Player  *room.Player
}

type IncomingMessage struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

type OutgoingMessage struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

func (e *Event) ListenerEvents() {
	for {
		_, data, err := e.Conn.ReadMessage()
		if err != nil {
			if e.Room != nil && e.Player != nil {
				LeaveRoom(e.Player.ID, e.Room, e.Conn)
			}
			break
		}

		var msg IncomingMessage
		if err := json.Unmarshal(data, &msg); err != nil {
			log.Error("Failed to parse message: %v", err)
			continue
		}

		switch msg.Type {
		case "createRoom":
			var payload CreateRoomPayload
			if err := json.Unmarshal(msg.Payload, &payload); err != nil {
				log.Error("Failed to parse createRoom payload: %v", err)
				continue
			}
			CreateRoom(e.Conn, payload, e.Db, e.Manager)

		case "joinRoom":
			var payload JoinRoomPayload
			if err := json.Unmarshal(msg.Payload, &payload); err != nil {
				log.Error("Failed to parse joinRoom payload: %v", err)
				continue
			}
			JoinRoom(e.Conn, payload, e.Manager)
			if r, ok := e.Manager.GetRoom(payload.RoomID); ok {
				e.Room = r
				if p, ok := r.GetPlayer(payload.UserID); ok {
					e.Player = p
				}
			}

		case "vote":
			if e.Room == nil || e.Player == nil {
				e.Conn.WriteJSON(OutgoingMessage{
					Type:    "error",
					Payload: "Not in a room",
				})
				continue
			}
			var payload VotePayload
			if err := json.Unmarshal(msg.Payload, &payload); err != nil {
				log.Error("Failed to parse vote payload: %v", err)
				continue
			}
			Vote(e.Player.ID, payload, e.Room)

		case "revealVotes":
			if e.Room == nil {
				e.Conn.WriteJSON(OutgoingMessage{
					Type:    "error",
					Payload: "Not in a room",
				})
				continue
			}
			if e.Player == nil || e.Player.ID != e.Room.OwnerID {
				e.Conn.WriteJSON(OutgoingMessage{
					Type:    "error",
					Payload: "Only the room owner can reveal votes",
				})
				continue
			}
			RevealVotes(e.Room)

		case "resetVotes":
			if e.Room == nil {
				e.Conn.WriteJSON(OutgoingMessage{
					Type:    "error",
					Payload: "Not in a room",
				})
				continue
			}
			if e.Player == nil || e.Player.ID != e.Room.OwnerID {
				e.Conn.WriteJSON(OutgoingMessage{
					Type:    "error",
					Payload: "Only the room owner can reset votes",
				})
				continue
			}
			ResetVotes(e.Room)

		case "leaveRoom":
			if e.Room != nil && e.Player != nil {
				LeaveRoom(e.Player.ID, e.Room, e.Conn)
				e.Room = nil
				e.Player = nil
			}

		default:
			log.Error("Unknown type: %s", msg.Type)
		}
	}
}
