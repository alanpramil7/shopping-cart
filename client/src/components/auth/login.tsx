import { useNavigate } from "react-router-dom";
import style from "./auth.module.scss";

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className={style.backdrop}>
      <div className={style.container}>
        <h1>Login</h1>
        <div className={style.buttoncontainer}>
          <button onClick={() => navigate("/login/admin")}>Admin</button>
          <button onClick={() => navigate("/login/user")}>User</button>
        </div>
        <p onClick={() => navigate("/register")}>
          Don't have account? Register
        </p>
      </div>
    </div>
  );
};

export default Login;
