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

func GetAllItems() ([]ItemRaw, error) {
	initDB()

	var items []ItemRaw
	err := connection.Select(&items, `SELECT * FROM items`)
	if err != nil {
		return items, err
	}
	return items, nil
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

func InsertItem(item ItemRaw) (int64, error) {
	initDB()

	var insertedID int64
	err := connection.QueryRow(`
		INSERT INTO items 
			("categoryId", title, description, image, price, available)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id`,
		item.CategoryId, item.Title, item.Description, item.Image, item.Price, item.Available,
	).Scan(&insertedID)

	if err != nil {
		return 0, err
	}

	return insertedID, nil
}

func UpdateItemQuantity(itemID int64, available int64) error {
	initDB()

	_, err := connection.Exec(`UPDATE items SET available = $1 WHERE id = $2`, available, itemID)
	if err != nil {
		return err
	}

	return nil
}

func UpdateItem(itemID int64, item ItemRaw) error {
	initDB()

	_, err := connection.Exec(`UPDATE items SET
		"categoryId" = $1,
		title        = $2,
		description  = $3,
		image        = $4,
		price        = $5,
		available    = $6
	WHERE id = $7`, item.CategoryId, item.Title, item.Description, item.Image, item.Price, item.Available, itemID)
	if err != nil {
		return err
	}

	return nil
}
