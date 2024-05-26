package GetSignatureStatus

import (
	"cicada_user_auth/internal/signatureAPI/GetSignatureStatus"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"net/http"
)

type Response struct {
	Status bool   `json:"status"`
	Error  string `json:"error,omitempty"`
}

func New(APIKey string) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		signID := chi.URLParam(r, "signID")
		if signID == "" {
			render.Status(r, http.StatusBadRequest)
			return
		}
		status, err := GetSignatureStatus.GetSignatureStatus(signID, APIKey)
		if err != nil {
			render.Status(r, http.StatusInternalServerError)
			render.JSON(w, r, Response{
				Status: status,
				Error:  err.Error(),
			})
		}
		render.JSON(w, r, Response{
			Status: status,
		})
	}
}
