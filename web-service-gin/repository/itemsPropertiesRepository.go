package repository

import (
	"fmt"
)

type ItemPropertyRaw struct {
	PropertyName  string `json:"propertyName" db:"propertyName"`
	PropertyValue string `json:"propertyValue" db:"propertyValue"`
}

func GetPropertiesByItemId(itemId int64) ([]ItemPropertyRaw, error) {
	initDB()
	var properties []ItemPropertyRaw
	err := connection.Select(&properties, fmt.Sprintf(`SELECT "propertyName", "propertyValue" FROM item_properties WHERE "itemId" = %d`, itemId))
	if err != nil {
		return properties, err
	}
	return properties, nil
}
