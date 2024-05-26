package signatureAPI

import (
	"bytes"
	"io"
	"mime/multipart"
	"net/http"
)

type Request struct {
	Files    [][]byte  `json:"file_urls"`
	Sig      []Signers `json:"signers"`
	Message  string    `json:"message"`
	TestMode bool      `json:"test_mode"`
}
type Signers struct {
	Name  string `json:"name"`
	Email string `json:"email_address"`
}

func New(fileBytes []byte, name, email, message string) (bytes.Buffer, string, error) {

	// Создание буфера и multipart writer
	var requestBody bytes.Buffer
	writer := multipart.NewWriter(&requestBody)

	// Добавление файла в multipart запрос
	filePart, err := writer.CreateFormFile("files", "filename.txt")
	if err != nil {
		return requestBody, "", err
	}

	_, err = filePart.Write(fileBytes)
	if err != nil {
		return requestBody, "", err
	}
	fields := map[string]string{
		"subject":                   "Авторизационное письмо о котором мы говорили:)",
		"message":                   message,
		"signers[0][email_address]": email,
		"signers[0][name]":          name,
		"test_mode":                 "1",
	}

	for key, val := range fields {
		err = writer.WriteField(key, val)
		if err != nil {
			return requestBody, "", err
		}
	}

	// Завершение multipart writer
	err = writer.Close()
	return requestBody, writer.FormDataContentType(), nil
}

func Sign(APIkey string, buffer bytes.Buffer, ct string) error {
	println(buffer.String())
	req, err := http.NewRequest("POST", "https://api.hellosign.com/v3/signature_request/send", &buffer)
	if err != nil {
		return err
	}
	req.SetBasicAuth(APIkey, "")
	req.Header.Set("Content-Type", ct)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	println(string(body))
	return nil
}
