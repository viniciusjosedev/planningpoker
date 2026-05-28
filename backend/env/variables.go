package env

import (
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	_ = godotenv.Load(".env")
}

func GetEnv(name string) string {
	return os.Getenv(name)
}
