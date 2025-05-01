package repository

import (
	"errors"
	"fmt"
)

type UserRaw struct {
	Id           int64  `json:"id" db:"id"`
	Login        string `json:"login" db:"login"`
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
	err := connection.Select(&users, fmt.Sprintf("SELECT * FROM users WHERE id = '%d'", userId))
	if err != nil {
		return UserRaw{}, err
	}
	if len(users) == 0 {
		return UserRaw{}, errors.New("not found")
	}

	return users[0], err
}

func GetUserByLogin(login string) (UserRaw, error) {
	initDB()

	var users []UserRaw
	err := connection.Select(&users, fmt.Sprintf(`SELECT * FROM users WHERE "login" = '%s'`, login))
	if err != nil {
		return UserRaw{}, err
	}
	if len(users) == 0 {
		return UserRaw{}, errors.New("not found")
	}

	return users[0], err
}

func InsertNewUser(userData UserRaw) error {
	initDB()

	_, err := connection.Exec(`INSERT INTO users
	 (login, password_hash, first_name, last_name, father_name, phone, email, is_admin)
	  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		userData.Login, userData.PasswordHash, userData.FirstName, userData.LastName, userData.FatherName, userData.Phone, userData.Email, userData.IsAdmin)
	if err != nil {
		return err
	}

	return nil
}
