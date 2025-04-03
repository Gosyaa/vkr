package repository

import (
	"errors"
	"fmt"
)

type ItemRaw struct {
	Id          int64  `json:"id" db:"id"`
	CategoryId  int64  `json:"categoryId" db:"categoryId"`
	Title       string `json:"title" db:"title"`
	Description string `json:"description" db:"description"`
	Image       string `json:"image" db:"image"`
	Price       int64  `json:"price" db:"price"`
	Available   int64  `json:"available" db:"available"`
}

func GetItemsByCategoryId(categoryId int64) ([]ItemRaw, error) {
	initDB()

	var items []ItemRaw
	err := connection.Select(&items, fmt.Sprintf(`SELECT * FROM items WHERE "categoryId" = %d`, categoryId))
	if err != nil {
		return items, err
	}
	return items, nil
}

func GetItemById(itemId int64) (ItemRaw, error) {
	initDB()

	var items []ItemRaw
	err := connection.Select(&items, fmt.Sprintf(`SELECT * FROM items WHERE "id" = %d`, itemId))
	if err != nil {
		return ItemRaw{}, err
	}
	if len(items) == 0 {
		return ItemRaw{}, errors.New("not found")
	}

	return items[0], nil
}
