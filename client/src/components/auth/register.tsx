import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import style from "./auth.module.scss";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:5001/users/register", {
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      console.log("error while creating user", error);
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
        Register
      </button>
    </form>
  );
};

export default Register;
