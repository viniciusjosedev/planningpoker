package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// Room holds the schema definition for the User entity.
type Room struct {
	ent.Schema
}

// Fields of the Room.
func (Room) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			NotEmpty(),
		field.String("hash").
			NotEmpty().Unique(),
	}
}

// Edges of the Room.
func (Room) Edges() []ent.Edge {
	return nil
}
