package sendMRP

import "cicada_user_auth/internal/XMLp"

type Request struct {
	MRP []byte
}
type Response struct {
	data XMLp.XMLData
}
