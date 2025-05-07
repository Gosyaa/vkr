import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { PageCatalog, PagePayment, PageDelivey, PageOffers, PageSupport, PageAbout, PageLogin, PageRegister, PagePersonal, PageCart, PageItem, PageAdmin } from './Pages';
import { Shop } from './Shop/Shop.jsx';
import MainPage from './MainPages';

function App() {

  return (
    <>
      <AuthProvider>
      <CartProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} >
              <Route index element={<PageCatalog />} />
              <Route path="catalog"  element={<PageCatalog  />} />
              <Route path="about"    element={<PageAbout    />} />
              <Route path="payment"  element={<PagePayment  />} />
              <Route path="delivery" element={<PageDelivey  />} />
              <Route path="offers"   element={<PageOffers   />} />
              <Route path="support"  element={<PageSupport  />} />
              <Route path="login"    element={<PageLogin    />} />
              <Route path="register" element={<PageRegister />} />
              <Route path="personal" element={<PagePersonal />} />
              <Route path="shop"     element={<Shop         />} />
              <Route path="cart"     element={<PageCart     />} />
              <Route path="item"     element={<PageItem     />} />
              <Route path="admin"    element={<PageAdmin    />} />
            </Route>
        </Routes>
        </BrowserRouter>
      </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App
