package repository

import (
	"errors"
	"fmt"
)

type OrderRaw struct {
	Id         int64  `json:"id" db:"id"`
	Status     string `json:"status" db:"id"`
	PriceTotal int    `json:"price_total" db:"price_total"`
	UserId     int64  `json:"user_id" db:"user_id"`
	CreatedAt  int64  `json:"created_at" db:"created_at"`
	AlteredAt  int64  `json:"altered_at" db:"altered_at"`
}

func GetOrdersByUserId(userId int64) ([]OrderRaw, error) {
	initDB()

	var orders []OrderRaw
	err := connection.Select(&orders, fmt.Sprintf("SELECT * FROM orders WHERE user_id = %d", userId))
	if err != nil {
		return orders, err
	}
	return orders, nil
}

func GetOrderById(orderId int64) (OrderRaw, error) {
	initDB()

	var orders []OrderRaw
	err := connection.Select(&orders, fmt.Sprintf("SELECT * FROM orders WHERE id = %d", orderId))
	if err != nil {
		return OrderRaw{}, err
	}
	if len(orders) == 0 {
		return OrderRaw{}, errors.New("not found")
	}

	return orders[0], err
}
