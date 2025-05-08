package repository

import (
	"fmt"
)

type ItemExtraImageRaw struct {
	Image string `json:"image" db:"image"`
}

func GetExtraImagesByItemId(itemId int64) ([]ItemExtraImageRaw, error) {
	initDB()

	var extraImages []ItemExtraImageRaw
	err := connection.Select(&extraImages, fmt.Sprintf(`SELECT image FROM items_extra_images WHERE "itemId" = %d`, itemId))
	if err != nil {
		return extraImages, nil
	}
	return extraImages, nil
}

func InsertExtraImage(itemId int64, image string) error {
	initDB()

	_, err := connection.Exec(`INSERT INTO items_extra_images ("itemId", image) VALUES ($1, $2)`, itemId, image)
	if err != nil {
		return err
	}

	return nil
}

func ClearExtraImages(itemId int64) error {
	initDB()

	_, err := connection.Exec(`DELETE FROM items_extra_images WHERE "itemId" = $1`, itemId)
	if err != nil {
		return err
	}

	return nil
}
