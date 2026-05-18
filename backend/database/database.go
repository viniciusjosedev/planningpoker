package database

import (
	"context"
	"fmt"
	"planningpoker/ent"
	"planningpoker/env"

	"github.com/charmbracelet/log"

	_ "github.com/lib/pq"
)

func StartDatabase() *ent.Client {
	log.Info("Starting database...")

	fmt.Println(env.GetEnv("DATABASE_NAME"))

	client, err := ent.Open(
		"postgres",
		fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable",
			env.GetEnv("DATABASE_HOST"), env.GetEnv("DATABASE_PORT"), env.GetEnv("DATABASE_USER"), env.GetEnv("DATABASE_NAME"), env.GetEnv("DATABASE_PASSWORD"),
		),
	)

	if err != nil {
		log.Fatalf("failed opening connection to postgres: %v", err)
	}

	if err := client.Schema.Create(context.Background()); err != nil {
		log.Fatalf("failed creating schema resources: %v", err)
	}

	return client
}
