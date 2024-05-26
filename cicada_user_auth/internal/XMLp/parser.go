package XMLp

import (
	"encoding/xml"
	"fmt"
	"time"
)

type XMLData struct {
	Company `json:"company"`
	Cdata   time.Time. `json:"ctime"`
}
type Company struct {
	Address string `xml:"АдрРег" json:"address"`
	Number  string `xml:"КонтактТлф" json:"number"`
	INN     int64  `xml:"ИННЮЛ" json:"inn"`
	OGRN    string `xml:"ОГРНТип" json:"ogrn"`
}

func MarshallXML(byteValue []byte) (*XMLData, error) {
	var data XMLData
	err := xml.Unmarshal(byteValue, &data)
	if err != nil {
		return nil, err
	}
	data.Cdata = time.Now()
	fmt.Println(data)
	return &data, nil
}
