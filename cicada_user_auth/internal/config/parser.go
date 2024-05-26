package config

import (
	"errors"
	"github.com/ilyakaznacheev/cleanenv"
	"os"
	"time"
)

type Config struct {
	APIKey  string        `yaml:"API_KEY"`
	Address string        `yaml:"address" env-default:"localhost:8080"`
	Timeout time.Duration `yaml:"timeout" env-default:"4s"`
	Message string        `yaml:"message"`
}

func MustLoad() (*Config, error) {
	path := os.Getenv("PATH_TO_CONF")
	if path == "" {
		return nil, errors.New("PATH_TO_CONF environment variable not set")
	}
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return nil, errors.New("PATH_TO_CONF does not exist")
	}
	var config Config
	if err := cleanenv.ReadConfig(path, &config); err != nil {
		return nil, errors.New("error reading PATH_TO_CONF")
	}
	return &config, nil
}
