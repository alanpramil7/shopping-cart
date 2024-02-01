import { useNavigate } from "react-router-dom";
import style from "./auth.module.scss";

const Register = () => {
  const navigate = useNavigate();
  return (
    <div className={style.backdrop}>
      <div className={style.container}>
        <h1>Register</h1>
        <div className={style.buttoncontainer}>
          <button onClick={() => navigate("/register/admin")}>Admin</button>
          <button onClick={() => navigate("/register/user")}>User</button>
        </div>
        <p onClick={() => navigate("/login")}>
          Aready have an account? Login here
        </p>
      </div>
    </div>
  );
};

export default Register;
