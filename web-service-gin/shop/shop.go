package shop

import (
	"errors"
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

func CheckAvailability(itemID int64, count int64) (int64, error) {
	item, err := GetItem(itemID)
	if err != nil {
		return -1, err
	}

	if item.Available < count {
		return -1, nil
	}

	return item.Price * count, nil
}

func HandleOrder(itemID int64, count int64) error {
	item, err := repository.GetItemById(itemID)
	if err != nil {
		return err
	}

	item.Available -= count
	if item.Available < 0 {
		return errors.New("item not available")
	}

	err = repository.UpdateItemQuantity(itemID, item.Available)
	if err != nil {
		return err
	}

	return nil
}

func InsertItem(item Item) error {
	itemRaw := repository.ItemRaw{
		CategoryId:  item.CategoryId,
		Title:       item.Title,
		Description: item.Description,
		Image:       item.Image,
		Price:       item.Price,
		Available:   item.Available,
	}

	itemID, err := repository.InsertItem(itemRaw)
	if err != nil {
		return err
	}

	err = insertProperties(itemID, item.Properties)
	if err != nil {
		return err
	}

	err = insertExtraImages(itemID, item.ExtraImages)
	if err != nil {
		return err
	}

	return nil
}

func UpsertItem(item Item) error {
	itemRaw := repository.ItemRaw{
		CategoryId:  item.CategoryId,
		Title:       item.Title,
		Description: item.Description,
		Image:       item.Image,
		Price:       item.Price,
		Available:   item.Available,
	}
	itemID := item.Id

	err := repository.UpdateItem(itemID, itemRaw)
	if err != nil {
		return err
	}

	err = repository.ClearPropeties(itemID)
	if err != nil {
		return err
	}

	err = insertProperties(itemID, item.Properties)
	if err != nil {
		return err
	}

	err = repository.ClearExtraImages(itemID)
	if err != nil {
		return err
	}

	err = insertExtraImages(itemID, item.ExtraImages)
	if err != nil {
		return err
	}

	return nil
}

func InsertCategory(category Category) error {
	categoryRaw := repository.CategoryRaw{
		Title:  category.Title,
		Image:  category.Image,
		Weight: category.Weight,
	}

	err := repository.InsertCategory(categoryRaw)
	if err != nil {
		return err
	}

	return nil
}

func UpsertCategory(category Category) error {
	categoryRaw := repository.CategoryRaw{
		Id:     category.ID,
		Title:  category.Title,
		Image:  category.Image,
		Weight: category.Weight,
	}

	err := repository.UpdateCategory(categoryRaw)
	if err != nil {
		return err
	}

	return nil
}

func insertProperties(itemID int64, properties []ItemProperty) error {
	for _, property := range properties {
		propertyRaw := repository.ItemPropertyRaw{
			PropertyName:  property.PropertyName,
			PropertyValue: property.PropertyValue,
		}
		err := repository.InsertProperty(itemID, propertyRaw)
		if err != nil {
			return err
		}
	}
	return nil
}

func insertExtraImages(itemID int64, images []string) error {
	for _, image := range images {
		err := repository.InsertExtraImage(itemID, image)
		if err != nil {
			return err
		}
	}
	return nil
}
