import { useContext, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "../Admin.css";
import url from '../../data/consts';
import "./ItemForm.css";

export function ItemForm() {
    const navigate = useNavigate();

    const { user, token } = useContext(AuthContext);
    if (!user || !user.isAdmin) {
        navigate('/');
    }

    useEffect(() => {
        if (user == null || !user || !user.isAdmin) {
            navigate('/');
        }
    }, [user]);

    const location = useLocation();
    const item = location.state?.item || null;


    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        itemId: item?.id || '',
        categoryId: item?.categoryId || '',
        title: item?.title || '',
        description: item?.description || '',
        image: item?.image?.split('/').pop() || '',
        price: item?.price || '',
        available: item?.available || '',
        properties: item?.properties || [],
        extraImages: item?.extraImages?.map(url => url.split('/').pop()) || [],
    });

    useEffect(() => {
        const fetchURL = url + '/categories'
        fetch(fetchURL)
        .then(res => res.json())
        .then(data => setCategories(data))
        .catch(err => console.error('Ошибка при загрузке категорий:', err));
    }, []);

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

      
    const handlePropertyChange = (index, key, value) => {
        const newProps = [...formData.properties];
        newProps[index][key] = value;
        setFormData({ ...formData, properties: newProps });
    };

    const addProperty = () =>
        setFormData(prev => ({
        ...prev,
        properties: [...prev.properties, { propertyName: '', propertyValue: '' }],
        }));

    const removeProperty = index => {
        const newProps = [...formData.properties];
        newProps.splice(index, 1);
        setFormData({ ...formData, properties: newProps });
    };

    const addExtraImage = () =>
        setFormData(prev => ({ ...prev, extraImages: [...prev.extraImages, ''] }));

    const removeExtraImage = index => {
        const imgs = [...formData.extraImages];
        imgs.splice(index, 1);
        setFormData({ ...formData, extraImages: imgs });
    };

    const handleSubmit = async e => {
        e.preventDefault();
    
        const endpoint = item ? 'upsertItem' : 'createItem';
        const fetchURL = url + `/${endpoint}?accessToken=${token}`;
        const form = new FormData();
        if (item) form.append('itemId', formData.itemId);
        form.append('categoryId', formData.categoryId);
        form.append('title', formData.title);
        form.append('description', formData.description);
        form.append('image', formData.image);
        form.append('price', formData.price);
        form.append('available', formData.available);
        form.append('properties', JSON.stringify(formData.properties));
        form.append('extraImages', JSON.stringify(formData.extraImages));
    
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

      return (
        <div className="item-form-container">
            <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
            <h2>{item ? `Редактирование товара: ${item.title}` : 'Создание нового товара'}</h2>
            <Link to="/admin">
                <button className="back-admin-button">Назад</button>
            </Link>
            <form onSubmit={handleSubmit}>
                <div>
                <label>Категория: </label>
                <select
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                >
                    <option value="">Выберите категорию</option>
                    {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {cat.title}
                    </option>
                    ))}
                </select>
                </div>
        
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
                <label>Описание:</label>
                <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
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
                <label>Цена:</label>
                <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    required
                />
                </div>
        
                <div>
                <label>Наличие:</label>
                <input
                    type="number"
                    value={formData.available}
                    onChange={e => setFormData({ ...formData, available: e.target.value })}
                    required
                />
                </div>
        
                <div>
                <h4>Характеристики</h4>
                {formData.properties.map((prop, index) => (
                    <div key={index}>
                    <input
                        type="text"
                        placeholder="Имя"
                        value={prop.propertyName}
                        onChange={e => handlePropertyChange(index, 'propertyName', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Значение"
                        value={prop.propertyValue}
                        onChange={e => handlePropertyChange(index, 'propertyValue', e.target.value)}
                    />
                    <button type="button" className="form-delete-button" onClick={() => removeProperty(index)}>Удалить</button>
                    </div>
                ))}
                <button type="button" className="form-button" onClick={addProperty}>Добавить характеристику</button>
                </div>
        
                <div>
                <h4>Доп. изображения</h4>
                {formData.extraImages.map((img, index) => (
                    <div key={index}>
                    <input
                        type="file"
                        onChange={e => handleImageUpload(e.target.files[0], false, index)}
                    />
                        {img && (
                            <img
                                src={`http://localhost:8080/uploads/${img}`}
                                alt={`Доп. изображение ${index + 1}`}
                                style={{ maxWidth: '200px', display: 'block', marginTop: '10px' }}
                            />
                        )}
                    <button type="button" className="form-delete-button" onClick={() => removeExtraImage(index)}>Удалить</button>
                    </div>
                ))}
                <button type="button" onClick={addExtraImage} className="form-button">Добавить изображение</button>
                </div>
        
                <button type="submit" className="save-button">Сохранить</button>
            </form>
            </div>
        </div>
      );

}

export default ItemForm