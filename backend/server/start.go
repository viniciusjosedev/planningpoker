package server

import (
	"net/http"
	"planningpoker/env"
	"planningpoker/events"
	"planningpoker/room"

	"github.com/charmbracelet/log"
	"github.com/gorilla/websocket"
)

type Server struct {
	Manager *room.Manager
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func (s *Server) handleWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Errorf("WebSocket upgrade error: %v", err)
		return
	}
	defer conn.Close()

	event := events.Event{
		Manager: s.Manager,
		Conn:    conn,
	}

	event.ListenerEvents()
}

func (s *Server) StartServer() {
	port := env.GetEnv("PORT")
	if port == "" {
		port = ":8080"
	}

	log.Infof("Starting server on %s", port)

	http.HandleFunc("/ws", s.handleWS)

	err := http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
