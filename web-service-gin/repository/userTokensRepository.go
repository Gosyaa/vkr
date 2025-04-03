package repository

import (
	"errors"
	"fmt"
)

type TokenRaw struct {
	Id          int64  `json:"id" db:"id"`
	Token       string `json:"token" db:"token"`
	UserId      int64  `json:"user_id" db:"user_id"`
	WarningDate int64  `json:"warning_date" db:"warning_date"`
	ExpireDate  int64  `json:"expire_date" db:"expire_date"`
}

func GetTokenInfo(token string) (TokenRaw, error) {
	initDB()

	var tokens []TokenRaw
	err := connection.Select(&tokens, fmt.Sprintf("SELECT * FROM user_tokens WHERE token = %q", token))
	if err != nil {
		return TokenRaw{}, err
	}
	if len(tokens) == 0 {
		return TokenRaw{}, errors.New("not found")
	}

	return tokens[0], nil
}
