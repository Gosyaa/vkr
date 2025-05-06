import url from '../data/consts'

async function fetchItems(categoryId) {
    try {
        let fetchURL = url + `/items?categoryId=${encodeURIComponent(categoryId)}`;
        console.log(fetchURL)
        const response = await fetch(fetchURL);
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log(data);
        return data;
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
        return [];
      }
}

export default fetchItems