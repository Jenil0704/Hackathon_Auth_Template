import { Link } from "react-router-dom";
  import InputField from "./InputField.jsx";
import { Loader2 } from "lucide-react";
import { useRegister } from "../hooks/useRegister.js";

export default function Register() {
  const { formData, errors, loading, handleChange, handleSubmit } = useRegister();

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
              className="w-full py-2 bg-black text-white rounded-lg hover:bg-primary/90 transition"
              disabled={loading}
            >
              {loading && <Loader2 className="w-full h-4 animate-spin" />}
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
