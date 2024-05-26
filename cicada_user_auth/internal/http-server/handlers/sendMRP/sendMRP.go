package sendMRP

import (
	"cicada_user_auth/internal/XMLp"
	"cicada_user_auth/internal/lib/api"
	"github.com/go-chi/render"
	"io"
	"mime/multipart"
	"net/http"
)

type Request struct {
	form *multipart.Form
}
type Response struct {
	data XMLp.XMLData
}

func New() func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseMultipartForm(100)
		if err != nil {
			render.JSON(w, r, api.Error("Failed to parse form"))
			return
		}
		mform := r.MultipartForm
		if len(mform.File["document"]) == 0 {
			render.Status(r, http.StatusBadRequest)
			render.JSON(w, r, api.Error("Failed to parse form"))
		}
		for _, f := range mform.File["document"] {
			file, err := f.Open()
			if err != nil {
				render.Status(r, http.StatusInternalServerError)
				render.JSON(w, r, api.Error("sdads"))
				return
			}
			filebytes, err := io.ReadAll(file)
			if err != nil {
				render.JSON(w, r, api.Error("Failed to read file"))
				return
			}
			data, err := XMLp.MarshallXML(filebytes)
			if err != nil {
				render.JSON(w, r, api.Error("Failed to marshall xml"))
				return
			}
			render.JSON(w, r, data)
			return
		}
	}
}
