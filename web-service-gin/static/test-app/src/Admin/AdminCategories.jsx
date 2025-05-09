import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import "./Admin.css";
import url from '../data/consts';

export function AdminCategories({ token = "" }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchURL = url + `/categories`
        fetch(fetchURL)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Ошибка при загрузке данных');
            }
            return response.json();
          })
          .then((data) => {
            setCategories(data.sort((a, b) => b.weight - a.weight));
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
        <h2>Список категорий</h2>
        <div className="admin-items-header">
           <Link to="/adminItem" state={{ item: null }}>
              <button className="create-button">Новая категория</button>
           </Link>
        </div>
        <table className="admin-items-table">
           <thead>
              <tr>
              <th>ID</th>
              <th>Категория</th>
              <th>Вес (сортировка)</th>
              <th>Действия</th>
              </tr>
           </thead>
           <tbody>
              {categories.map((category) => (
              <tr key={category.id}>
                 <td>{category.id}</td>
                 <td>{category.title}</td>
                 <td>{category.weight}</td>
                 <td>
                    <Link key={category.id} to='/adminCategories' state={{ category }}> 
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

export default AdminCategories;