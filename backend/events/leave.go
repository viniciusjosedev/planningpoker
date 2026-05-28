package events

import (
	"planningpoker/room"

	"github.com/gorilla/websocket"
)

func LeaveRoom(playerID string, r *room.Room, conn *websocket.Conn) {
	if !r.RemovePlayerIfConn(playerID, conn) {
		return
	}

	if len(r.Players) > 0 {
		r.Broadcast(OutgoingMessage{
			Type:    "playerLeft",
			Payload: r.ToResponse(),
		})
	}
}
