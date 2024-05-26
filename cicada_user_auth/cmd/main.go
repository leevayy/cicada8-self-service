package main

import (
	"cicada_user_auth/internal/config"
	"cicada_user_auth/internal/http-server/handlers/GetSignatureStatus"
	"cicada_user_auth/internal/http-server/handlers/sendAuthMail"
	"cicada_user_auth/internal/http-server/handlers/sendMRP"
	"github.com/go-chi/chi/v5"
	"log"
	"net/http"
)

func main() {
	cfg, err := config.MustLoad()
	if err != nil {
		panic(err)
	}
	router := chi.NewRouter()
	router.Route("/api", func(r chi.Router) {
		r.Post("/sendMRP", sendMRP.New())
		r.Post("/sendAuthMail", sendAuthMail.New(cfg.APIKey, cfg.Message))
		r.Get("/getSignatureStatus/{signID}", GetSignatureStatus.New(cfg.APIKey))
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
