package repository

type CategoryRaw struct {
	Id     int64  `json:"id" db:"id"`
	Title  string `json:"title" db:"title"`
	Image  string `json:"image" db:"image"`
	Weight int    `json:"weight" db:"weight"`
}

func GetCategories() ([]CategoryRaw, error) {
	initDB()
	var categories []CategoryRaw
	err := connection.Select(&categories, "SELECT * FROM categories")
	if err != nil {
		return categories, err
	}
	return categories, nil
}
