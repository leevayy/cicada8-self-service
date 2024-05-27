package testStorage

import "cicada_user_auth/internal/XMLp"

type Storage struct {
	MRPs []map[string]string
}

func NewStorage() *Storage {
	return &Storage{}
}
func (s *Storage) AddMRP(signer *XMLp.Signer) {
	s.MRPs = append(s.MRPs, map[string]string{
		"ФИО":   signer.FCs,
		"ИННФЛ": signer.INN,
		"СНИЛС": signer.SNILS,
	})
}

func (s *Storage) GetMRP(ID int) map[string]string {
	return s.MRPs[ID]
}
