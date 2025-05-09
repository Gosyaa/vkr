package api

import (
	"encoding/json"
	"example/web-service-gin/shop"
	"example/web-service-gin/user"
	"strconv"

	"github.com/gin-gonic/gin"
)

func Items(c *gin.Context) {
	categoryIdRaw := c.Query("categoryId")
	categoryID, err := strconv.ParseInt(categoryIdRaw, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad categoryId param"})
		return
	}

	items, err := shop.GetItems(categoryID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, items)
}

func Item(c *gin.Context) {
	itemIdRaw := c.Query("itemId")
	itemID, err := strconv.ParseInt(itemIdRaw, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad itemId param"})
		return
	}

	item, err := shop.GetItem(itemID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, item)
}

func AdminItems(c *gin.Context) {
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

	items, err := shop.GetItemsForAdmin()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, items)
}

func CreateItem(c *gin.Context) {
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

	categoryIdRaw := c.PostForm("categoryId")
	categoryID, err := strconv.ParseInt(categoryIdRaw, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad categoryId param"})
		return
	}

	priceRaw := c.PostForm("price")
	price, err := strconv.ParseInt(priceRaw, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad price param"})
		return
	}

	availableRaw := c.PostForm("available")
	available, err := strconv.ParseInt(availableRaw, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad available param"})
		return
	}

	title := c.PostForm("title")
	description := c.PostForm("description")
	image := c.PostForm("image")

	propertiesRaw := c.PostForm("properties")
	var properties []shop.ItemProperty
	err = json.Unmarshal([]byte(propertiesRaw), &properties)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad properties param"})
		return
	}

	imagesRaw := c.PostForm("extraImages")
	var extraImages []string
	err = json.Unmarshal([]byte(imagesRaw), &extraImages)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad extra images param"})
		return
	}

	item := shop.Item{
		CategoryId:  categoryID,
		Title:       title,
		Description: description,
		Image:       image,
		Price:       price,
		Available:   available,
		Properties:  properties,
		ExtraImages: extraImages,
	}

	err = shop.InsertItem(item)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"status": "item created"})
}

func UpsertItem(c *gin.Context) {
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

	itemIdRaw := c.PostForm("itemId")
	itemID, err := strconv.ParseInt(itemIdRaw, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad itemId param"})
		return
	}

	categoryIdRaw := c.PostForm("categoryId")
	categoryID, err := strconv.ParseInt(categoryIdRaw, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad categoryId param"})
		return
	}

	priceRaw := c.PostForm("price")
	price, err := strconv.ParseInt(priceRaw, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad price param"})
		return
	}

	availableRaw := c.PostForm("available")
	available, err := strconv.ParseInt(availableRaw, 10, 64)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad available param"})
		return
	}

	title := c.PostForm("title")
	description := c.PostForm("description")
	image := c.PostForm("image")

	propertiesRaw := c.PostForm("properties")
	var properties []shop.ItemProperty
	err = json.Unmarshal([]byte(propertiesRaw), &properties)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad properties param"})
		return
	}

	imagesRaw := c.PostForm("extraImages")
	var extraImages []string
	err = json.Unmarshal([]byte(imagesRaw), &extraImages)
	if err != nil {
		c.JSON(400, gin.H{"error": "Bad extra images param"})
		return
	}

	item := shop.Item{
		Id:          itemID,
		CategoryId:  categoryID,
		Title:       title,
		Description: description,
		Image:       image,
		Price:       price,
		Available:   available,
		Properties:  properties,
		ExtraImages: extraImages,
	}

	err = shop.UpsertItem(item)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"status": "item updated"})
}
