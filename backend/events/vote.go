package events

import "planningpoker/room"

type VotePayload struct {
	Value int `json:"value"`
}

func Vote(playerID string, payload VotePayload, r *room.Room) {
	r.SetVote(playerID, payload.Value)

	r.Broadcast(OutgoingMessage{
		Type:    "roomUpdated",
		Payload: r.ToResponse(),
	})
}
