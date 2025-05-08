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

func InsertProperty(itemId int64, property ItemPropertyRaw) error {
	initDB()

	_, err := connection.Exec(`INSERT INTO item_properties ("itemId", "propertyName", "propertyValue") VALUES ($1, $2, $3)`, itemId, property.PropertyName, property.PropertyValue)
	if err != nil {
		return err
	}

	return nil
}

func ClearPropeties(itemId int64) error {
	initDB()

	_, err := connection.Exec(`DELETE FROM item_properties WHERE "itemId" = $1`, itemId)
	if err != nil {
		return err
	}

	return nil
}
