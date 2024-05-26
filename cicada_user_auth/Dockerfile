FROM golang:latest

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o main ./cmd/main.go

ENV PATH_TO_CONF=./config/config.yaml

EXPOSE 8083

CMD ["./main"]
