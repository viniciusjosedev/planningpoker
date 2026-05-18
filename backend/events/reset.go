package events

import "planningpoker/room"

func ResetVotes(r *room.Room) {
	r.ResetVotes()

	// Notifica todos os jogadores
	r.Broadcast(OutgoingMessage{
		Type:    "votesReset",
		Payload: r.ToResponse(),
	})
}
