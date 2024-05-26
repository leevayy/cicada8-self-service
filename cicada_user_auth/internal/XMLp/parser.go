package XMLp

import (
	"encoding/xml"
	"fmt"
	"time"
)

type XMLData struct {
	Company `json:"company"`
	Signer  `json:"signer,omitempty"`
	Cdata   time.Time `json:"ctime"`
}
type Company struct {
	Name           string `xml:"НаимОрг" json:"name"`
	Address        string `xml:"АдрРег" json:"address"`
	Number         string `xml:"КонтактТлф" json:"number"`
	INN            int64  `xml:"ИННЮЛ" json:"inn"`
	OGRN           int64  `xml:"ОГРНТип" json:"ogrn"`
	Representative string `xml:"ФИОТип" json:"representative"`
}
type Signer struct {
	FCs   string `xml:"ФИО"`
	INN   string `xml:"ИННФЛ"`
	SNILS string `xml:"СНИЛС"`
}

func MarshallXML(byteValue []byte) (XMLData, error) {
	var data XMLData
	err := xml.Unmarshal(byteValue, &data)
	if err != nil {
		return XMLData{}, err
	}
	data.Cdata = time.Now()
	fmt.Println(data)
	return data, nil
}
