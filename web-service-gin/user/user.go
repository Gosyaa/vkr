package user

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"example/web-service-gin/repository"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id         int64  `json:"id"`
	Login      string `json:"login"`
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	FatherName string `json:"father_name"`
	Phone      string `json:"phone"`
	Email      string `json:"email"`
	IsAdmin    bool   `json:"is_admin"`
}

func CheckToken(token string) (int64, error) {
	var userID int64

	tokenData, err := repository.GetTokenInfo(token)
	if err != nil && err.Error() == "not found" {
		return userID, errors.New("incorrect token")
	}
	if err != nil {
		return userID, err
	}
	if time.Now().After(tokenData.ExpireDate) {
		return userID, errors.New("token expired")
	}
	userID = tokenData.UserId

	return userID, nil
}

func HandleLogin(login string, password string) (string, error) {
	user, err := repository.GetUserByLogin(login)
	if err != nil {
		return "", err
	}

	isPasswordCorrect := checkPassword(password, user.PasswordHash)
	if !isPasswordCorrect {
		return "", errors.New("incorrect password")
	}

	newToken, err := generateTokenForUser()
	if err != nil {
		return "", err
	}

	err = repository.AddNewTokenToUser(user.Id, newToken)
	if err != nil {
		return "", err
	}

	return newToken, nil
}

func HandleRegister(
	login string,
	password string,
	firstName string,
	lastName string,
	fatherName string,
	phone string,
	email string) (string, error) {
	_, err := repository.GetUserByLogin(login)
	if err != nil && err.Error() != "not found" {
		return "", err
	}
	if err == nil {
		return "", errors.New("user exists")
	}

	passwordHash, err := generateHash(password)
	if err != nil {
		return "", err
	}

	err = repository.InsertNewUser(repository.UserRaw{
		Login:        login,
		PasswordHash: passwordHash,
		FirstName:    firstName,
		LastName:     lastName,
		FatherName:   fatherName,
		Phone:        phone,
		Email:        email,
		IsAdmin:      false,
	})
	if err != nil {
		return "", err
	}

	return HandleLogin(login, password)
}

func GetUser(userID int64) (User, error) {
	userRaw, err := repository.GetUserById(userID)
	if err != nil {
		return User{}, err
	}

	user := User{
		Id:         userRaw.Id,
		Login:      userRaw.Login,
		FirstName:  userRaw.FirstName,
		LastName:   userRaw.LastName,
		FatherName: userRaw.FatherName,
		Phone:      userRaw.Phone,
		Email:      userRaw.Email,
		IsAdmin:    userRaw.IsAdmin,
	}

	return user, nil
}

func checkPassword(password string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func generateHash(password string) (string, error) {
	hashBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashBytes), nil
}

func generateTokenForUser() (string, error) {
	bytes := make([]byte, 32)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}

	return hex.EncodeToString(bytes), nil
}
