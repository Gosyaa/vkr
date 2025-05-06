package api

import (
	"example/web-service-gin/user"

	"github.com/gin-gonic/gin"
)

func CreateUser(c *gin.Context) {
	login := c.Query("login")
	password := c.Query("password")
	firstName := c.Query("first_name")
	lastName := c.Query("last_name")
	fatherName := c.Query("father_name")
	phone := c.Query("phone")
	email := c.Query("email")

	if login == "" || password == "" {
		c.JSON(400, gin.H{"error": "empty params"})
		return
	}

	token, err := user.HandleRegister(login, password, firstName, lastName, fatherName, phone, email)
	if err != nil {
		if err.Error() == "user exists" {
			c.JSON(400, gin.H{"error": err.Error()})
		} else {
			c.JSON(500, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(200, gin.H{"token": token})
}

func CheckUser(c *gin.Context) {
	login := c.PostForm("login")
	password := c.PostForm("password")

	token, err := user.HandleLogin(login, password)
	if err != nil {
		if err.Error() == "incorrect password" {
			c.JSON(400, gin.H{"error": err.Error()})
		} else {
			c.JSON(500, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(200, gin.H{"token": token})
}

func UserByToken(c *gin.Context) {
	token := c.Query("token")
	userID, err := user.CheckToken(token)
	if err != nil {
		if err.Error() == "token expired" || err.Error() == "incorrect token" {
			c.JSON(401, gin.H{"error": err.Error()})
		} else {
			c.JSON(500, gin.H{"error": err.Error()})
		}
		return
	}

	userData, err := user.GetUser(userID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, userData)
}
