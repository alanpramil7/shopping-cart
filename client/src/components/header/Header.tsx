import { Link, useNavigate } from "react-router-dom";
import CartWidget from "../cart-widget/CartWidget";
import style from "./header.module.scss";
import { useContext } from "react";
import { AuthContext } from "../../hooks/auth-context";
import axios from "axios";

export const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5001/users/logout", {
        withCredentials: true,
      });
      setUser(null);
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");

      navigate("/");
      navigate(0);
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
            <CartWidget />
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
