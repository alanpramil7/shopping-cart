import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import style from "./auth.module.scss";
import { Validator } from "../../../validate";

 export interface FormDataProps {
  username: string;
  email: string;
  password: string;
}

const AdminRegister = () => {
  const [formData, setFormData] = useState<FormDataProps>({
    username: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [submit, setSubmit] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const onSubmit = async () => {
      if (Object.keys(formErrors).length === 0 && submit) {
        try {
          const response = await axios.post(
            "http://localhost:5001/users/register",
            {
              username: formData.username,
              email: formData.email,
              password: formData.password,
              isAdmin: true,
            }
          );
          navigate("/login");
          toast.success(response.data.message);
        } catch (error: any) {
          toast.error(error.response.data.message);
        }
        setSubmit(false);
      }
    };

    onSubmit();
  }, [formErrors, submit, formData, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors(Validator(formData));
    setSubmit(true);
  };

  return (
    <div className={style.container}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className={style.form}>
        <label>
          Username
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Username"
          />
        </label>
        <p>{formErrors.username}</p>
        <label>
          Email
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
        </label>
        <p>{formErrors.email}</p>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
          />
        </label>
        <p>{formErrors.password}</p>
        <button type="submit" className={style.formbtn}>
          Register
        </button>
      </form>
    </div>
  );
};

export default AdminRegister;
