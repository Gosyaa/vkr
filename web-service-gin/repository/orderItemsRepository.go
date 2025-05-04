package repository

import "fmt"

type OrderItemsRaw struct {
	Id       int64 `json:"id" db:"id"`
	OrderId  int64 `json:"order_id" db:"order_id"`
	ItemId   int64 `json:"item_id" db:"item_id"`
	Quantity int64 `json:"quantity" db:"quantity"`
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

func InsertOrderItem(orderItem OrderItemsRaw) error {
	initDB()

	_, err := connection.Exec("INSERT INTO order_items (order_id, item_id, quantity) VALUES ($1, $2, $3)",
		orderItem.OrderId, orderItem.ItemId, orderItem.Quantity)
	if err != nil {
		return err
	}

	return nil
}
