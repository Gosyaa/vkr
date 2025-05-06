import url from '../data/consts'

async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:8080/categories');
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Категории:', data);
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
      }
}

export default fetchCategories