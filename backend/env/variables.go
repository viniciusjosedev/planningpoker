package env

import (
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	err := godotenv.Load(".env")

	if err != nil {
		panic("Erro ao carregar .env: " + err.Error())
	}
}

func GetEnv(name string) string {
	return os.Getenv(name)
}
