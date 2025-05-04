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

func InsertItem(item ItemRaw) error {
	initDB()

	_, err := connection.Exec(`INSERT INTO items 
		(id, "categoryId", title, description, image, price, available)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		item.Id, item.CategoryId, item.Title, item.Description, item.Image, item.Price, item.Available)
	if err != nil {
		return err
	}

	return nil
}

func UpdateItemQuantity(itemID int64, available int64) error {
	initDB()

	_, err := connection.Exec(`UPDATE items SET available = $1 WHERE id = $2`, available, itemID)
	if err != nil {
		return err
	}

	return nil
}
