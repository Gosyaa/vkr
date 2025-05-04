package repository

import (
	"errors"
	"fmt"
	"time"
)

type OrderRaw struct {
	Id         int64     `json:"id" db:"id"`
	Status     string    `json:"status" db:"status"`
	PriceTotal int       `json:"price_total" db:"price_total"`
	UserId     int64     `json:"user_id" db:"user_id"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
	AlteredAt  time.Time `json:"altered_at" db:"altered_at"`
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

func InsertOrder(order OrderRaw) (int64, error) {
	initDB()

	var orderId int64
	err := connection.QueryRowx(`INSERT INTO orders (status, price_total, user_id, created_at, altered_at) VALUES
	($1, $2, $3, $4, $5) RETURNING id`, order.Status, order.PriceTotal, order.UserId, time.Now(), order.AlteredAt).Scan(&orderId)
	if err != nil {
		return 0, err
	}

	return orderId, nil
}
