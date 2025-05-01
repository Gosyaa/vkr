package repository

import (
	"errors"
	"fmt"
	"time"
)

type TokenRaw struct {
	Id          int64     `json:"id" db:"id"`
	Token       string    `json:"token" db:"token"`
	UserId      int64     `json:"user_id" db:"user_id"`
	WarningDate time.Time `json:"warning_date" db:"warning_date"`
	ExpireDate  time.Time `json:"expire_date" db:"expire_date"`
}

func GetTokenInfo(token string) (TokenRaw, error) {
	initDB()

	var tokens []TokenRaw
	err := connection.Select(&tokens, fmt.Sprintf("SELECT * FROM user_tokens WHERE token = '%s'", token))
	if err != nil {
		return TokenRaw{}, err
	}
	if len(tokens) == 0 {
		return TokenRaw{}, errors.New("not found")
	}

	return tokens[0], nil
}

func AddNewTokenToUser(userID int64, token string) error {
	initDB()

	_, err := connection.Exec(
		"INSERT INTO user_tokens (token, user_id, warning_date, expire_date) VALUES ($1, $2, $3, $4)",
		token, userID, time.Now().Add(24*time.Hour), time.Now().Add(2*24*time.Hour))
	if err != nil {
		return err
	}

	return nil
}
