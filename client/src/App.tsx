import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./app.module.scss";
import "./App.css";
import Product from "./components/products/Product";
import Cart from "./components/cart/Cart";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Update from "./components/update/Update";
import CreateProduct from "./components/newProduct/CreateProduct";

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update" element={<Update />} />
          <Route path="/product/new" element={<CreateProduct />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
