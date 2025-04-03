import imageStub      from './dot.png';
import fabrics        from './fabricsCover.jpg';
import braid          from './braidCover.jpg';
import wrap           from './wrapCover.jpg';
import rollZipper     from './rollZipperCover.jpg';
import tractorZipper  from './tractorZipperCover.jpg';
import sevices        from './servicesCover.jpg';


export const categories = [
    {id: 2, title: "Тентовые ткани",      image: fabrics},
    {id: 1, title: "Продукция фирмы dot", image: imageStub},
    {id: 3, title: "Тесьма отделочная",   image: braid},
    {id: 4, title: "Плёнка ПВХ",          image: wrap},
    {id: 5, title: "Разъёмные молнии",    image: rollZipper},
    {id: 6, title: "Рулонные молнии",     image: tractorZipper},
    {id: 7, title: "Услгуи",              image: sevices}
]

export default {
    categories
}