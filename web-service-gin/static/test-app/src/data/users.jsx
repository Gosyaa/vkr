import imageStub from './dot.png';

export const testUser = {
    login: "gosya",
    firstName: "Иван",
    lastName: "Иванов",
    fatherName: "Иванович", 
    phone: "+79123456789",
    email: "ivan@gmail.com",
    orders: [
        {id: 1, status: "Доставлен", items: [{itemId: 1, quantity: 1}, {itemId: 3, quantity: 4}], priceTotal: 4000, image: imageStub}
    ]
};
export default {
    testUser
}