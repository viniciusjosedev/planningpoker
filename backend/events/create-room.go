package events

import (
	"context"
	"fmt"
	"planningpoker/ent"
	"planningpoker/room"

	"github.com/gorilla/websocket"

	gonanoid "github.com/matoous/go-nanoid/v2"
)

type CreateRoomPayload struct {
	Name        string `json:"name"`
	IsSpectator bool   `json:"isSpectator"`
}

func CreateRoom(conn *websocket.Conn, payload CreateRoomPayload, db *ent.Client, manager *room.Manager) {
	hash, err := gonanoid.New()
	if err != nil {
		conn.WriteJSON(OutgoingMessage{
			Type:    "error",
			Payload: "Failed to generate room hash",
		})
		return
	}

	_, err = db.Room.Create().
		SetName(payload.Name).
		SetHash(hash).
		Save(context.Background())

	if err != nil {
		conn.WriteJSON(OutgoingMessage{
			Type:    "error",
			Payload: fmt.Sprintf("Failed to create room: %v", err),
		})
		return
	}

	manager.AddRoom(hash, payload.Name)

	conn.WriteJSON(OutgoingMessage{
		Type:    "createdRoom",
		Payload: map[string]string{"hash": hash},
	})
}
