import imageStub from './dot.png';
import imageStub1 from './wrapCover.jpg';

export const items = [
    {
        "id": 1,
        "categoryId": 1,
        "title": "Кнопка DOT тентовая",
        "description": "Кнопка установочная для ремонта лодочных тентов. Комплект из двух деталей: шляпки и гнезда. Материал - латунь, не ржавеет.",
        "image": "http://localhost:8080/uploads/dot.png",
        "price": 999,
        "available": 5,
        "properties": [
            {
                "propertyName": "Шляпка диаметр",
                "propertyValue": "15.24 мм"
            },
            {
                "propertyName": "Высота",
                "propertyValue": "4.32 мм"
            },
            {
                "propertyName": "Гнездо внутренний диаметр",
                "propertyValue": "11.024 мм"
            }
        ],
        "extraImages": [
            "http://localhost:8080/uploads/wrapCover.jpg",
            "http://localhost:8080/uploads/braidCover.jpg"
        ]
    },
    {id: 2, categoryId: 1, title: "Кнопка DOT тентовая", description: "Кнопка установочная для ремонта лодочных тентов. Комплект из двух деталей: шляпки и гнезда. Материал - латунь, не ржавеет.", image: imageStub, price: 999, available: 0,  properties: [], extraImages: []},
    {id: 3, categoryId: 1, title: "Кнопка DOT тентовая", description: "Кнопка установочная для ремонта лодочных тентов. Комплект из двух деталей: шляпки и гнезда. Материал - латунь, не ржавеет.", image: imageStub, price: 999, available: 4,  properties: [], extraImages: []},
    {id: 4, categoryId: 1, title: "Кнопка DOT тентовая", description: "Кнопка установочная для ремонта лодочных тентов. Комплект из двух деталей: шляпки и гнезда. Материал - латунь, не ржавеет.", image: imageStub, price: 999, available: 10, properties: [], extraImages: []},
    {id: 5, categoryId: 1, title: "Кнопка DOT тентовая", description: "Кнопка установочная для ремонта лодочных тентов. Комплект из двух деталей: шляпки и гнезда. Материал - латунь, не ржавеет.", image: imageStub, price: 999, available: 10, properties: [], extraImages: []},
    {id: 6, categoryId: 1, title: "Кнопка DOT тентовая", description: "Кнопка установочная для ремонта лодочных тентов. Комплект из двух деталей: шляпки и гнезда. Материал - латунь, не ржавеет.", image: imageStub, price: 999, available: 10, properties: [], extraImages: []},
    {id: 7, categoryId: 2, title: "Кнопка DOT тентовая", description: "Кнопка установочная для ремонта лодочных тентов. Комплект из двух деталей: шляпки и гнезда. Материал - латунь, не ржавеет.", image: imageStub, price: 999, available: 1,  properties: [], extraImages: []}
];

export default {
    items
}