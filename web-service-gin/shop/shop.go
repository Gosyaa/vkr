package shop

import (
	"example/web-service-gin/common"
	"example/web-service-gin/repository"
)

type Category struct {
	ID     int64  `json:"id"`
	Title  string `json:"title"`
	Image  string `json:"image"`
	Weight int    `json:"weight"`
}

func createCategoryFromRaw(category repository.CategoryRaw) Category {
	imageUrl := common.GetFileURL(category.Image)
	return Category{
		ID:     category.Id,
		Title:  category.Title,
		Image:  imageUrl,
		Weight: category.Weight,
	}
}

type ItemProperty struct {
	PropertyName  string `json:"propertyName"`
	PropertyValue string `json:"propertyValue"`
}

func transformItemPropertyFromRaw(property repository.ItemPropertyRaw) ItemProperty {
	return ItemProperty{
		PropertyName:  property.PropertyName,
		PropertyValue: property.PropertyValue,
	}
}

type Item struct {
	Id          int64          `json:"id"`
	CategoryId  int64          `json:"categoryId"`
	Title       string         `json:"title"`
	Description string         `json:"description"`
	Image       string         `json:"image"`
	Price       int64          `json:"price"`
	Available   int64          `json:"available"`
	Properties  []ItemProperty `json:"properties"`
	ExtraImages []string       `json:"extraImages"`
}

func constructItem(itemRaw repository.ItemRaw, itemPropertiesRaw []repository.ItemPropertyRaw, itemExtraImagesRaw []repository.ItemExtraImageRaw) Item {
	var properties []ItemProperty
	for _, propertyRaw := range itemPropertiesRaw {
		properties = append(properties, transformItemPropertyFromRaw(propertyRaw))
	}
	var extraImages []string
	for _, exextraImageRaw := range itemExtraImagesRaw {
		extraImages = append(extraImages, common.GetFileURL(exextraImageRaw.Image))
	}
	return Item{
		Id:          itemRaw.Id,
		CategoryId:  itemRaw.CategoryId,
		Title:       itemRaw.Title,
		Description: itemRaw.Description,
		Image:       common.GetFileURL(itemRaw.Image),
		Price:       itemRaw.Price,
		Available:   itemRaw.Available,
		Properties:  properties,
		ExtraImages: extraImages,
	}
}

func GetCategories() ([]Category, error) {
	var categories []Category
	categoriesRaw, err := repository.GetCategories()
	if err != nil {
		return categories, err
	}

	for i := 0; i < len(categoriesRaw); i++ {
		categories = append(categories, createCategoryFromRaw(categoriesRaw[i]))
	}
	return categories, nil
}

func GetItems(categoryID int64) ([]Item, error) {
	var items []Item

	itemsRaw, err := repository.GetItemsByCategoryId(categoryID)
	if err != nil {
		return items, err
	}

	for i := 0; i < len(itemsRaw); i++ {
		properties, err := repository.GetPropertiesByItemId(itemsRaw[i].Id)
		if err != nil {
			continue
		}
		extraImages, err := repository.GetExtraImagesByItemId(itemsRaw[i].Id)
		if err != nil {
			continue
		}

		items = append(items, constructItem(itemsRaw[i], properties, extraImages))
	}
	return items, nil
}

func GetItem(itemID int64) (Item, error) {
	item, err := repository.GetItemById(itemID)
	if err != nil {
		return Item{}, err
	}
	properties, err := repository.GetPropertiesByItemId(itemID)
	if err != nil {
		return Item{}, err
	}
	extraImages, err := repository.GetExtraImagesByItemId(itemID)
	if err != nil {
		return Item{}, err
	}

	return constructItem(item, properties, extraImages), nil
}
