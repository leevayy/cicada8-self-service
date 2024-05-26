package GetSignatureStatus

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type Request struct {
	Signature string `json:"signature"`
}
type SignatureResponse struct {
	Status bool `json:"is_complete"`
}
type Response struct {
	Signature SignatureResponse `json:"signature_request"`
}

func GetSignatureStatus(signature, APIKey string) (status bool, err error) {
	req, err := http.NewRequest("GET", fmt.Sprintf("https://api.hellosign.com/v3/signature_request/%s", signature), nil)
	if err != nil {
		return false, err
	}
	req.SetBasicAuth(APIKey, "")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	var response Response
	err = json.Unmarshal(body, &response)
	if err != nil {
		return false, err
	}
	return response.Signature.Status, nil
}
