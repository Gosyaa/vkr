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

func UpdateCategory(category CategoryRaw) error {
	initDB()

	_, err := connection.Exec(`UPDATE categories SET
		title  = $1,
		image  = $2,
		weight = $3
	WHERE id = $4`, category.Title, category.Image, category.Weight, category.Id)
	if err != nil {
		return err
	}

	return nil
}

func InsertCategory(category CategoryRaw) error {
	initDB()

	_, err := connection.Exec(`INSERT INTO categories (title, image, weight) VALUES ($1, $2, $3)`, category.Title, category.Image, category.Weight)
	if err != nil {
		return err
	}

	return nil
}
