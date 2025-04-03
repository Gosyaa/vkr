package api

import (
	"example/web-service-gin/shop"
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
