import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "./InputField.jsx";
import { loginUser } from "../api/auth.js";
import { useNavigate } from "react-router-dom"
import { z } from "zod";

const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});


export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

    

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const result = schema.safeParse(formData);

      try {
        const data = await loginUser(formData.email, formData.password)
        navigate('/');
        setSuccess(true)
        setErrors("")
        setFormData({ email: '', password: '' })
        console.log(data);
      } catch (err) {
        const backendMessage = err?.response?.data?.message;
        const networkMessage = err?.message;
        setErrors(backendMessage || networkMessage || 'Login failed. Please try again.');
      } finally {
        setLoading(false)
      }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Login
          </button>
          {errors && (
            <p className="text-red-600 text-sm text-center">{errors}</p>
          )}
        </form>
        <div className="mt-3">
          <Link className="text-blue-600 hover:underline" to="/forgot-password">
            Forgot your Password?
          </Link>
        </div>
        <p className="mt-5 text-sm text-center">
          Don’t have an account?{" "}
          <Link className="text-blue-600 hover:underline" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
