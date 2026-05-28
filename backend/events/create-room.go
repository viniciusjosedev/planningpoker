package events

import (
	"planningpoker/room"

	"github.com/gorilla/websocket"

	gonanoid "github.com/matoous/go-nanoid/v2"
)

type CreateRoomPayload struct {
	Name        string `json:"name"`
	UserID      string `json:"userId"`
	IsSpectator bool   `json:"isSpectator"`
}

func CreateRoom(conn *websocket.Conn, payload CreateRoomPayload, manager *room.Manager) {
	hash, err := gonanoid.New()
	if err != nil {
		conn.WriteJSON(OutgoingMessage{
			Type:    "error",
			Payload: "Failed to generate room hash",
		})
		return
	}

	manager.AddRoom(hash, payload.Name, payload.UserID)

	conn.WriteJSON(OutgoingMessage{
		Type:    "createdRoom",
		Payload: map[string]string{"hash": hash},
	})
}
