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
