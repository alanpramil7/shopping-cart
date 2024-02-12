import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../hooks/auth-context";
import style from "./auth.module.scss";
import toast from "react-hot-toast";
import PasswordInput from "../../password-input/password-input";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/login/user`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      const { id, username, isAdmin } = response.data.data;
      setUser({ id, username, isAdmin });
      toast.success(response.data.message);
      navigate("/user-page");
    } catch (error: any) {
      if (error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className={style.container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className={style.form}>
        <label>
          Email
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </label>
        <label>
          Password
          <PasswordInput
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className={style.formbtn}>
          Login
        </button>
      </form>
    </div>
  );
};

export default UserLogin;
