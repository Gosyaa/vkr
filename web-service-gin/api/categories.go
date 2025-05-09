package api

import (
	"example/web-service-gin/shop"
	"example/web-service-gin/user"
	"strconv"

	"github.com/gin-gonic/gin"
)

func Categories(c *gin.Context) {
	categories, err := shop.GetCategories()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, categories)
}

func CreateCategory(c *gin.Context) {
	userToken := c.Query("accessToken")
	isAdmin, err := user.CheckAdmin(userToken)
	if err != nil {
		if err.Error() == "token expired" || err.Error() == "incorrect token" {
			c.JSON(401, gin.H{"error": err.Error()})
		} else {
			c.JSON(500, gin.H{"error": err.Error()})
		}
		return
	}
	if !isAdmin {
		c.JSON(401, gin.H{"error": "not an admin"})
		return
	}

	title := c.PostForm("title")
	image := c.PostForm("image")
	weightRaw := c.PostForm("weight")
	weight, err := strconv.ParseInt(weightRaw, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad weight param"})
		return
	}

	err = shop.InsertCategory(shop.Category{
		Title:  title,
		Image:  image,
		Weight: int(weight),
	})

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"status": "category created"})
}

func UpsertCategory(c *gin.Context) {
	userToken := c.Query("accessToken")
	isAdmin, err := user.CheckAdmin(userToken)
	if err != nil {
		if err.Error() == "token expired" || err.Error() == "incorrect token" {
			c.JSON(401, gin.H{"error": err.Error()})
		} else {
			c.JSON(500, gin.H{"error": err.Error()})
		}
		return
	}
	if !isAdmin {
		c.JSON(401, gin.H{"error": "not an admin"})
		return
	}

	categoryIDRaw := c.PostForm("id")
	categoryID, err := strconv.ParseInt(categoryIDRaw, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad weight param"})
		return
	}
	title := c.PostForm("title")
	image := c.PostForm("image")
	weightRaw := c.PostForm("weight")
	weight, err := strconv.ParseInt(weightRaw, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad weight param"})
		return
	}

	err = shop.UpsertCategory(shop.Category{
		ID:     categoryID,
		Title:  title,
		Image:  image,
		Weight: int(weight),
	})
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"status": "category updated"})
}
