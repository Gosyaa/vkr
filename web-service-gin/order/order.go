package order

import (
	"example/web-service-gin/repository"
	"time"
)

type OrderElement struct {
	ItemID   int64
	Quantity int64
}

type Order struct {
	OrderId    int64
	Status     string
	Items      []OrderElement
	PriceTotal int
	UserId     int64
	CreatedAt  string
	AlteredAt  string
}

func makeOrder(orderRaw repository.OrderRaw, orderItemsRaw []repository.OrderItemsRaw) Order {
	var orderItems []OrderElement
	for _, orderItemRaw := range orderItemsRaw {
		orderItems = append(orderItems, OrderElement{
			ItemID:   orderItemRaw.ItemId,
			Quantity: orderItemRaw.Quantity,
		})
	}

	return Order{
		OrderId:    orderRaw.Id,
		Status:     orderRaw.Status,
		Items:      orderItems,
		PriceTotal: orderRaw.PriceTotal,
		UserId:     orderRaw.UserId,
		CreatedAt:  orderRaw.CreatedAt.Format("2006-01-02 15:04:05"),
		AlteredAt:  orderRaw.AlteredAt.Format("2006-01-02 15:04:05"),
	}
}

func GetUserOrders(userID int64) ([]Order, error) {
	var orders []Order

	ordersRaw, err := repository.GetOrdersByUserId(userID)
	if err != nil {
		return orders, err
	}

	for _, orderRaw := range ordersRaw {
		orderItemsRaw, err := repository.GetOrderItemsByOrderId(orderRaw.Id)
		if err != nil {
			return orders, err
		}
		orders = append(orders, makeOrder(orderRaw, orderItemsRaw))
	}

	return orders, nil
}

func AddOrder(orderList []OrderElement, userID int64, priceTotal int64) error {
	order := repository.OrderRaw{
		Status:     "Новый",
		PriceTotal: int(priceTotal),
		UserId:     userID,
		CreatedAt:  time.Now(),
		AlteredAt:  time.Now(),
	}
	orderID, err := repository.InsertOrder(order)
	if err != nil {
		return err
	}

	for _, orderElement := range orderList {
		err := repository.InsertOrderItem(repository.OrderItemsRaw{
			OrderId:  orderID,
			ItemId:   orderElement.ItemID,
			Quantity: orderElement.Quantity,
		})

		if err != nil {
			return err
		}
	}

	return nil
}
