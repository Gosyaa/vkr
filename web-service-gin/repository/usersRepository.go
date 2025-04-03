package repository

import (
	"errors"
	"fmt"
)

type UserRaw struct {
	Id           int64  `json:"id" db:"id"`
	Login        string `json:"login" db:"string"`
	PasswordHash string `json:"password_hash" db:"password_hash"`
	FirstName    string `json:"first_name" db:"first_name"`
	LastName     string `json:"last_name" db:"last_name"`
	FatherName   string `json:"father_name" db:"father_name"`
	Phone        string `json:"phone" db:"phone"`
	Email        string `json:"email" db:"email"`
	IsAdmin      bool   `json:"is_admin" db:"is_admin"`
}

func GetUserById(userId int64) (UserRaw, error) {
	initDB()

	var users []UserRaw
	err := connection.Select(&users, fmt.Sprintf("SELECT * FROM users WHERE id = %d", userId))
	if err != nil {
		return UserRaw{}, err
	}
	if len(users) == 0 {
		return UserRaw{}, errors.New("not found")
	}

	return users[0], err
}
