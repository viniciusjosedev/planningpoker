package events

import "planningpoker/room"

func ResetVotes(r *room.Room) {
	r.ResetVotes()

	r.Broadcast(OutgoingMessage{
		Type:    "votesReset",
		Payload: r.ToResponse(),
	})
}
