import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "./InputField.jsx";
import { registerUser } from "../api/auth.js";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({ name: "", password: "", server: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = { name: "", password: "" };
    setLoading(true);
    if (!/[A-Z]/.test(formData.name)) {
      newErrors.name = "Name must contain at least one uppercase letter";
    }

    const hasMinLength = formData.password.length >= 8;
    const hasLower = /[a-z]/.test(formData.password);
    const hasUpper = /[A-Z]/.test(formData.password);
    const hasSpecial = /[^A-Za-z0-9]/.test(formData.password);
    if (!(hasMinLength && hasLower && hasUpper && hasSpecial)) {
      newErrors.password = "Password must be 8+ chars, with 1 lowercase, 1 uppercase, 1 special";
    }

    if (newErrors.name || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    setErrors({ name: "", password: "", server: "" });
    try {
      await registerUser(formData.name, formData.email, formData.password);
      navigate('/verify-otp');
    } catch (err) {
      const backendMessage = err?.response?.data?.message;
      const networkMessage = err?.message;
      setErrors(prev => ({ ...prev, server: backendMessage || networkMessage || 'Registration failed. Please try again.' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl">
        <div className="flex flex-col items-start justify-center">
          <h2 className="text-2xl font-bold text-start mb-2">Register to your account</h2>
          <p className="text-sm text-start mb-6">Enter your details below to register to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name}</p>
          )}
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password}</p>
          )}
          <div className="mt-8 w-full flex flex-col items-center justify-center">
            <button
              type="submit"
              className="w-full py-2 text-white rounded-lg hover:bg-primary/90 transition"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {!loading && "Register"}
            </button>
          </div>
          
          {errors.server && (
            <p className="text-red-600 text-sm text-center">{errors.server}</p>
          )}
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link className="text-blue-600 hover:underline" to='/login'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
