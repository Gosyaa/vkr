package repository

import "fmt"

type OrderItemsRaw struct {
	Id      int64 `json:"id" db:"id"`
	OrderId int64 `json:"order_id" db:"order_id"`
	ItemId  int64 `json:"item_id" db:"item_id"`
}

func GetOrderItemsByOrderId(orderId int64) ([]OrderItemsRaw, error) {
	initDB()

	var orderItems []OrderItemsRaw
	err := connection.Select(&orderItems, fmt.Sprintf("SELECT * FROM order_items WHERE order_id = %d", orderId))
	if err != nil {
		return orderItems, err
	}
	return orderItems, nil
}
