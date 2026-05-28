package main

import (
	"planningpoker/env"
	"planningpoker/room"
	"planningpoker/server"
)

func main() {
	env.LoadEnv()

	manager := room.NewManager()

	server := server.Server{
		Manager: manager,
	}

	server.StartServer()
}
