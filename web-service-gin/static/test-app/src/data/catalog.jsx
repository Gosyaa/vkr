import imageStub      from './dot.png';
import fabrics        from './fabricsCover.jpg';
import braid          from './braidCover.jpg';
import wrap           from './wrapCover.jpg';
import rollZipper     from './rollZipperCover.jpg';
import tractorZipper  from './tractorZipperCover.jpg';
import sevices        from './servicesCover.jpg';
import url            from './consts'

async function getCategories() {
    const fetchURL = url + '/categories'
    try {
        const response = await fetch(fetchURL);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error(error.message);
        return [];
  }
}

export const categories = await getCategories()

export default {
    categories
}