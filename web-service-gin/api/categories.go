package api

import (
	"example/web-service-gin/shop"

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
