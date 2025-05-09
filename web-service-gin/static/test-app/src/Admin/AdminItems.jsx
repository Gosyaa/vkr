import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import "./Admin.css";
import url from '../data/consts';

export function AdminItems({ token = "" }) {

   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchURL = url + `/adminItems?accessToken=${token}`
      fetch(fetchURL)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Ошибка при загрузке данных');
          }
          return response.json();
        })
        .then((data) => {
          setItems(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }, []);

   if (loading) return <p>Загрузка...</p>;
   if (error) return <p>Ошибка: {error}</p>;

   return (
      <div className="admin-items-container">
      <h2>Список товаров</h2>
      <div className="admin-items-header">
         <Link to="/adminItem" state={{ item: null }}>
            <button className="create-button">Новый товар</button>
         </Link>
      </div>
      <table className="admin-items-table">
         <thead>
            <tr>
            <th>ID</th>
            <th>Категория</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Наличие</th>
            <th>Действия</th>
            </tr>
         </thead>
         <tbody>
            {items.map((item) => (
            <tr key={item.id}>
               <td>{item.id}</td>
               <td>{item.categoryName}</td>
               <td>{item.title}</td>
               <td>{item.price} ₽</td>
               <td>{item.available}</td>
               <td>
                  <Link key={item.id} to='/adminItem' state={{ item }}> 
                     <button className="edit-button">
                     Редактировать
                     </button>
                  </Link>
               </td>
            </tr>
            ))}
         </tbody>
      </table>
      </div>
   );
}

export default AdminItems;