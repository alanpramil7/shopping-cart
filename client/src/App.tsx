import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./app.module.scss";
import "./App.css";
import Product from "./components/products/Product";
import Cart from "./components/cart/Cart";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Update from "./components/update/Update";
import CreateProduct from "./components/newProduct/CreateProduct";
import UserLogin from "./components/auth/user/user-login";
import UserRegister from "./components/auth/user/user-register";
import AdminRegister from "./components/auth/admin/admin-register";
import AdminLogin from "./components/auth/admin/admin-login";
import AdminPage from "./components/admin-page/adminpage";
import UserPage from "./components/user-page/userpage";

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/register/user" element={<UserRegister />} />
          <Route path="/admin-page" element={<AdminPage />} />
          <Route path="/user-page" element={<UserPage />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/register/admin" element={<AdminRegister />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update" element={<Update />} />
          <Route path="/product/new" element={<CreateProduct />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
