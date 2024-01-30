import { Link, useNavigate } from "react-router-dom";
import CartWidget from "../cart-widget/CartWidget";
import style from "./header.module.scss";
import { CartProps } from "../products/Product";
import useLocalStorageState from "use-local-storage-state";
import { useContext } from "react";
import { AuthContext } from "../../hooks/auth-context";
import axios from "axios";

export const Header = () => {
  const [cart] = useLocalStorageState<CartProps>("cart", {});
  const productsCount = Object.keys(cart || {}).length;
  const navigate = useNavigate();
  const { authState, setAuthState } = useContext(AuthContext);
  const user = authState.user;

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5001/users/logout",
        {},
        { withCredentials: true }
      );
      setAuthState({
        accesstoken: null,
        user: null,
      });
      // no if refresh token
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");

      navigate("/");
    } catch (error) {
      console.log("Error on logout", error);
    }
  };

  return (
    <header className={style.header}>
      <div>
        <Link to="/">
          <img src="/logo.svg" alt="Logo" className={style.logo} />
        </Link>
      </div>
      <div>
        {!user ? (
          <div className={style.headerbtn}>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </div>
        ) : (
          <div className={style.headerbtn2}>
            <CartWidget productsCount={productsCount} />
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
