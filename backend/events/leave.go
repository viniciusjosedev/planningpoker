package events

import "planningpoker/room"

func LeaveRoom(playerID string, r *room.Room) {
	r.RemovePlayer(playerID)

	if len(r.Players) > 0 {
		r.Broadcast(OutgoingMessage{
			Type:    "playerLeft",
			Payload: r.ToResponse(),
		})
	}
}
