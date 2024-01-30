import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../hooks/auth-context";
import style from "./auth.module.scss";

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setAuthState } = useContext(AuthContext);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/users/login", {
        username,
        email,
        password,
      });

      console.log("Access Token:", response.data.accesstoken);
      console.log("user", response.data.user);

      const { id, isAdmin } = response.data.user;
      setAuthState({
        accesstoken: response.data.accesstoken,
        user: { id, isAdmin },
      });
      console.log(response.data);

      navigate("/");
    } catch (error) {
      console.log("Error while Logging :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" className={style.formbtn}>
        Login
      </button>
    </form>
  );
};

export default Login;
