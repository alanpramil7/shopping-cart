import { Link, useNavigate } from "react-router-dom";
import CartWidget from "../cart-widget/CartWidget";
import style from "./header.module.scss";
import { useContext } from "react";
import { AuthContext } from "../../hooks/auth-context";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5001/users/logout", {
        withCredentials: true,
      });
      setUser(null);
      navigate("/");
      navigate(0);
    } catch (error) {
      console.log("Error on logout", error);
    }
  };

  return (
    <header className={style.header}>
      <div>
        <Link to={user?.isAdmin ? "/admin-page" : "/user-page"}>
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
            <p>
              Hello, <br /> {user?.username}
            </p>
            {user.isAdmin ? null : <CartWidget />}
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
