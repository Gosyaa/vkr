import { useContext, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "../Admin.css";
import url from '../../data/consts';
import "./ItemForm.css";

export function CategoryForm() {
    const navigate = useNavigate();

    const { user, token } = useContext(AuthContext);

    useEffect(() => {
        if (user == null || !user || !user.isAdmin) {
            navigate('/');
        }
    }, [user]);

    const location = useLocation();
    const category = location.state?.category || null;

    const [formData, setFormData] = useState({
        id: category?.id || '',
        title: category?.title || '',
        image: category?.image?.split('/').pop() || '',
        weight: category?.weight || '',
    });

    const handleImageUpload = async (file, isMain = false, index = null) => {
        const data = new FormData();
        data.append('file', file);
        const fetchURL = url + '/upload'
        const res = await fetch(fetchURL, {
          method: 'POST',
          body: data,
        });
        const result = await res.json();
        const filename = result.file; 
        if (isMain) {
          setFormData(prev => ({ ...prev, image: filename }));
        } else {
          setFormData(prev => {
            const newImages = [...prev.extraImages];
            newImages[index] = filename;
            return { ...prev, extraImages: newImages };
          });
        }
      };

      const handleSubmit = async e => {
        e.preventDefault();
    
        const endpoint = category ? 'upsertCategory' : 'createCategory';
        const fetchURL = url + `/${endpoint}?accessToken=${token}`;
        const form = new FormData();
        if (category) form.append('id', formData.id);
        form.append('title', formData.title);
        form.append('image', formData.image);
        form.append('weight', formData.weight);
    
        try {
          const response = await fetch(fetchURL, {
            method: 'POST',
            body: form,
          });
          navigate('/admin');
        } catch (error) {
          alert('Ошибка при отправке формы: ' + error);
        }
      };

      console.log(category)

      return (
        <div className="item-form-container">
            <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
            <h2>{category ? `Редактирование категории: ${category.title}` : 'Создание новой категории'}</h2>
            <Link to="/admin">
                <button className="back-admin-button">Назад</button>
            </Link>
            <form onSubmit={handleSubmit}>
        
                <div>
                <label>Название:</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                />
                </div>
        
                <div>
                <label>Изображение:</label>
                <input type="file" onChange={e => handleImageUpload(e.target.files[0], true)} />
                {formData.image && (
                    <img
                        src={`http://localhost:8080/uploads/${formData.image}`}
                        alt="Изображение товара"
                        style={{ maxWidth: '200px', display: 'block', marginTop: '10px' }}
                    />
                    )}
                </div>
        
                <div>
                <label>Вес для сортировки:</label>
                <input
                    type="number"
                    value={formData.weight}
                    onChange={e => setFormData({ ...formData, weight: e.target.value })}
                    required
                />
                </div>
        
                <button type="submit" className="save-button">Сохранить</button>
            </form>
            </div>
        </div>
      );
}