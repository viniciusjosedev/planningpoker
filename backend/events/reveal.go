package events

import "planningpoker/room"

func RevealVotes(r *room.Room) {
	r.RevealVotes()

	r.Broadcast(OutgoingMessage{
		Type:    "votesRevealed",
		Payload: r.ToResponse(),
	})
}
