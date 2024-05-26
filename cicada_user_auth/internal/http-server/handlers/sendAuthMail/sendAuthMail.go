package sendAuthMail

import (
	"cicada_user_auth/internal/lib/api"
	"cicada_user_auth/internal/signatureAPI/SendSignatureRequest"
	"github.com/go-chi/render"
	"io"
	"mime/multipart"
	"net/http"
)

type Request struct {
	form *multipart.Form
}
type Response struct {
	SigId string `json:"signature_request_id"`
}

func New(APIKey, msg string) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var resp Response
		err := r.ParseMultipartForm(100)
		if err != nil {
			render.JSON(w, r, api.Error("Failed to parse form"))
			return
		}
		mform := r.MultipartForm
		if len(mform.Value["email"]) == 0 {
			render.Status(r, http.StatusNoContent)
			render.JSON(w, r, api.Error("empty email"))
		}
		email := mform.Value["email"][0]
		if len(mform.Value["name"]) == 0 {
			render.Status(r, http.StatusNoContent)
			render.JSON(w, r, api.Error("empty name"))
		}
		name := mform.Value["name"][0]
		if len(mform.File["document"]) == 0 {
			render.Status(r, http.StatusNoContent)
			render.JSON(w, r, api.Error("empty document"))
		}
		file := mform.File["document"][0]
		oFile, err := file.Open()
		if err != nil {
			render.Status(r, http.StatusInternalServerError)
			render.JSON(w, r, api.Error("Failed to open file"))
		}
		defer oFile.Close()
		bytesFile, err := io.ReadAll(oFile)
		buf, ct, err := SendSignatureRequest.New(bytesFile, name, email, msg)
		if err != nil {
			render.Status(r, http.StatusInternalServerError)
			render.JSON(w, r, api.Error("Failed to create signature"))
		}
		signID, err := SendSignatureRequest.Sign(APIKey, buf, ct)
		if err != nil {
			render.Status(r, http.StatusInternalServerError)
			render.JSON(w, r, api.Error("Failed to create signature"))
		}
		resp.SigId = signID
		render.JSON(w, r, resp)
	}
}
