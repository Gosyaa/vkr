import About    from "./About/About";
import Admin    from "./Admin/Admin";
import Catalog  from "./Catalog/Catalog";
import Login    from "./Login/Login";
import Register from "./Login/Register";
import Cart     from "./Cart/Cart";
import Item     from "./Item/Item";
import Personal from "./Personal/Personal";
import Feedback from "./Feedback/Feedback";
import ItemForm from "./Admin/Forms/ItemForm";
import { CategoryForm } from "./Admin/Forms/CategoryForm";

export const PageCatalog  = ()     => {
    return (<Catalog/>);
}
export const PagePayment  = ()     => {
    return (<h2>Оплата</h2>);
}
export const PageDelivey  = ()     => {
    return (<h2>Доставка</h2>);
}
export const PageOffers   = ()     => {
    return (<h2>Акции и скидки</h2>);
}
export const PageSupport  = ()     => {
    return (<Feedback/>);
}
export const PageAbout    = ()     => {
    return ( <>
        <h2>О нас</h2>
        <About/> </>
    );
}
export const PageLogin    = ()     => {
    return (<Login/>);
}
export const PageRegister = ()     => {
    return (<Register/>);
}
export const PagePersonal = ()     => {
    return (<Personal/>);
}
export const PageCart     = ()     => {
    return (<Cart/>);
}
export const PageItem     = ()     => {
    return (<Item/>);
}
export const PageAdmin    = ()     => {
    return (<Admin/>);
}
export const PageItemForm = ()     => {
    return (<ItemForm/>)
}
export const PageCategoryForm = () => {
    return (<CategoryForm/>)
}