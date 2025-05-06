package api

import (
	"encoding/json"
	"example/web-service-gin/order"
	"example/web-service-gin/shop"
	"example/web-service-gin/user"

	"github.com/gin-gonic/gin"
)

type ItemsQuery struct {
	Id       int64 `json:"id" binding:"required"`
	Quantity int64 `json:"quantity" binding:"required"`
}

type ItemsForm struct {
	Items []ItemsQuery `form:"items" binding:"required,dive"`
}

type Order struct {
	OrderID    int64       `json:"id"`
	Status     string      `json:"status"`
	Items      []OrderItem `json:"items"`
	PriceTotal int         `json:"priceTotal"`
	Image      string      `json:"image"`
}

type OrderItem struct {
	ItemID   int64 `json:"itemId"`
	Quantity int64 `json:"quantity"`
}

func UserOrders(c *gin.Context) {
	userToken := c.Query("accessToken")

	userID, err := user.CheckToken(userToken)
	if err != nil {
		if err.Error() == "token expired" || err.Error() == "incorrect token" {
			c.JSON(401, gin.H{"error": err.Error()})
		} else {
			c.JSON(500, gin.H{"error": err.Error()})
		}
		return
	}

	ordersRaw, err := order.GetUserOrders(userID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	var orders []Order
	for _, orderRaw := range ordersRaw {
		var orderItems []OrderItem
		image := ""
		for _, orderItemRaw := range orderRaw.Items {
			if image == "" {
				item, err := shop.GetItem(orderItemRaw.ItemID)
				if err == nil {
					image = item.Image
				}
			}
			orderItems = append(orderItems, OrderItem{
				ItemID:   orderItemRaw.ItemID,
				Quantity: orderItemRaw.Quantity,
			})
		}
		orders = append(orders, Order{
			OrderID:    orderRaw.OrderId,
			Status:     orderRaw.Status,
			Items:      orderItems,
			PriceTotal: orderRaw.PriceTotal,
			Image:      image,
		})
	}

	c.JSON(200, orders)
}

func CreateOrder(c *gin.Context) {
	userToken := c.Query("accessToken")

	itemsRaw := c.PostForm("items")
	if itemsRaw == "" {
		c.JSON(400, gin.H{"error": "items param missing"})
		return
	}
	var items []ItemsQuery
	err := json.Unmarshal([]byte(itemsRaw), &items)
	if err != nil || len(items) == 0 {
		c.JSON(400, gin.H{"error": "items param incorrect"})
		return
	}

	userID, err := user.CheckToken(userToken)
	if err != nil {
		if err.Error() == "token expired" || err.Error() == "incorrect token" {
			c.JSON(401, gin.H{"error": err.Error()})
		} else {
			c.JSON(500, gin.H{"error": err.Error()})
		}
		return
	}

	var priceTotal int64
	var orderItems []order.OrderElement
	for _, item := range items {
		price, err := shop.CheckAvailability(item.Id, item.Quantity)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		if price < 0 {
			c.JSON(400, gin.H{"error": "some items unavailable"})
			return
		}
		priceTotal += price
		orderItems = append(orderItems, order.OrderElement{
			ItemID:   item.Id,
			Quantity: item.Quantity,
		})
		err = shop.HandleOrder(item.Id, item.Quantity)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
	}

	err = order.AddOrder(orderItems, userID, priceTotal)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"status": "order created"})
}
