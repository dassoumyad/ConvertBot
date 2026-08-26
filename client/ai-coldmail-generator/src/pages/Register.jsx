import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../utils/api";

function Register() {

  // =========================
  // Form State
  // =========================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  // =========================
  // UI State
  // =========================

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  // =========================
  // Navigation
  // =========================

  const navigate = useNavigate();


  // =========================
  // Register
  // =========================

  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);


    try {

      // Send registration data
      const response = await api.post(
        "/auth/register",
        {
          name,
          email,
          password
        }
      );


      console.log(
        "REGISTER RESPONSE:",
        response.data
      );


      // Save email temporarily
      // OTP page will use this email
      localStorage.setItem(
        "registerEmail",
        email
      );


      // Redirect to OTP page
      navigate("/verify-otp");


    } catch (error) {

      console.log(
        "FULL ERROR:",
        error
      );

      console.log(
        "STATUS:",
        error.response?.status
      );

      console.log(
        "URL:",
        error.config?.url
      );

      console.log(
        "BASE URL:",
        error.config?.baseURL
      );

      console.log(
        "RESPONSE:",
        error.response?.data
      );


      setError(
        error.response?.data?.message ||
        "Registration failed"
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">


        {/* ========================= */}
        {/* Logo */}
        {/* ========================= */}

        <div className="text-center mb-6">

          <h1 className="text-3xl font-bold text-gray-900">
            ConvertBot
          </h1>

          <p className="text-gray-500 mt-2">
            Create your account
          </p>

        </div>


        {/* ========================= */}
        {/* Error Message */}
        {/* ========================= */}

        {error && (

          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-5 text-sm">

            {error}

          </div>

        )}


        {/* ========================= */}
        {/* Form */}
        {/* ========================= */}

        <form onSubmit={handleRegister}>


          {/* ========================= */}
          {/* Name */}
          {/* ========================= */}

          <div className="mb-4">

            <label
              htmlFor="name"
              className="block mb-2 font-medium text-gray-700"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>


          {/* ========================= */}
          {/* Email */}
          {/* ========================= */}

          <div className="mb-4">

            <label
              htmlFor="email"
              className="block mb-2 font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>


          {/* ========================= */}
          {/* Password */}
          {/* ========================= */}

          <div className="mb-6">

            <label
              htmlFor="password"
              className="block mb-2 font-medium text-gray-700"
            >
              Password
            </label>


            <div className="relative">

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />


              {/* Eye Button */}

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showPassword ? (

                  <EyeOff
                    size={20}
                    strokeWidth={1.8}
                  />

                ) : (

                  <Eye
                    size={20}
                    strokeWidth={1.8}
                  />

                )}

              </button>

            </div>

          </div>


          {/* ========================= */}
          {/* Register Button */}
          {/* ========================= */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
          >

            {loading
              ? "Creating Account..."
              : "Create Account"
            }

          </button>


        </form>


        {/* ========================= */}
        {/* Login */}
        {/* ========================= */}

        <p className="text-center mt-6 text-gray-600">

          Already have an account?

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-700 font-semibold ml-1"
          >

            Login

          </button>

        </p>


      </div>

    </div>

  );

}

export default Register;