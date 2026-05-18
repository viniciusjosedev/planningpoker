package main

import (
	"planningpoker/database"
	"planningpoker/env"
	"planningpoker/room"
	"planningpoker/server"
)

func main() {
	env.LoadEnv()

	db := database.StartDatabase()
	manager := room.NewManager()

	server := server.Server{
		Db:      db,
		Manager: manager,
	}

	server.StartServer()
}
