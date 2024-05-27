package main

import (
	"cicada_user_auth/internal/config"
	"cicada_user_auth/internal/http-server/handlers/CheckMRP"
	"cicada_user_auth/internal/http-server/handlers/GetSignatureStatus"
	"cicada_user_auth/internal/http-server/handlers/sendAuthMail"
	"cicada_user_auth/internal/http-server/handlers/sendMRP"
	"cicada_user_auth/testStorage"
	"github.com/go-chi/chi/v5"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	cfg, err := config.MustLoad()
	storage := testStorage.NewStorage()
	if err != nil {
		panic(err)
	}
	router := chi.NewRouter()

	// Define middleware first
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)

	corsOptions := cors.Options{
		AllowedOrigins:   []string{"http://localhost:4173"}, // Replace with your frontend origin
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by browsers
	}
	router.Use(cors.Handler(corsOptions))

	router.Route("/api", func(r chi.Router) {
		r.Post("/sendMRP", sendMRP.New(storage))
		r.Post("/sendAuthMail", sendAuthMail.New(cfg.APIKey, cfg.Message))
		r.Get("/getSignatureStatus/{signID}", GetSignatureStatus.New(cfg.APIKey))
		r.Post("/checkMRP", CheckMRP.New(storage))
	})

	srv := http.Server{
		Addr:         cfg.Address,
		Handler:      router,
		ReadTimeout:  cfg.Timeout,
		WriteTimeout: cfg.Timeout,
	}
	println("Listening on " + srv.Addr)
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("listen: %s\n", err)
	}
	println("Server shutdown")

}
