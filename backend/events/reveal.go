package events

import "planningpoker/room"

func RevealVotes(r *room.Room) {
	r.RevealVotes()

	// Notifica todos os jogadores
	r.Broadcast(OutgoingMessage{
		Type:    "votesRevealed",
		Payload: r.ToResponse(),
	})
}
