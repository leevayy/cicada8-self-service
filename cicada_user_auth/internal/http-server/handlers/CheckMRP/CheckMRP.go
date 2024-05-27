package CheckMRP

import (
	"cicada_user_auth/internal/lib/api"
	"cicada_user_auth/testStorage"
	"github.com/go-chi/render"
	"mime/multipart"
	"net/http"
	"strings"
)

type Request struct {
	form *multipart.Form
}
type Response struct {
	Result bool `json:"result"`
}

func New(storage *testStorage.Storage) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseMultipartForm(100)
		if err != nil {
			render.JSON(w, r, api.Error("Failed to parse form"))
			return
		}
		mform := r.MultipartForm
		FCs := mform.Value["FCs"][0]
		INN := mform.Value["INN"][0]
		SNILS := mform.Value["SNILS"][0]
		res := Check(storage, FCs, INN, SNILS)
		render.JSON(w, r, Response{
			Result: res,
		})
	}
}

func Check(storage *testStorage.Storage, FCs, INN, SNILS string) bool {
	if FCs == "" || INN == "" || SNILS == "" {
		return false
	}
	st := storage.GetMRP(0)
	if strings.ToLower(FCs) != strings.ToLower(st["ФИО"]) {
		return false
	}
	if INN != st["ИНН"] {
		return false
	}
	if SNILS != st["СНИЛС"] {
		return false
	}
	return true
}
