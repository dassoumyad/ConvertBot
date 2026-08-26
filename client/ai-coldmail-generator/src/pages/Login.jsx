import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      // --------------------------------
      // SAVE TOKEN
      // --------------------------------

      localStorage.setItem(
        "token",
        response.data.token
      );


      // --------------------------------
      // SAVE USER
      // --------------------------------

      if (response.data.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

      }


      // --------------------------------
      // GO TO DASHBOARD
      // --------------------------------

      navigate("/dashboard");

    } catch (error) {

      console.log("LOGIN ERROR:", error);

      console.log(
        "STATUS:",
        error.response?.status
      );

      console.log(
        "RESPONSE:",
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Login to your ConvertBot account
        </p>


        {error && (

          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>

        )}


        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="mb-4">

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>


          {/* PASSWORD */}

          <div className="mb-6">

            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>


        {/* REGISTER */}

        <p className="text-center mt-6 text-gray-600">

          Don't have an account?

          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 font-semibold ml-1"
          >
            Register
          </button>

        </p>

      </div>

    </div>

  );
}

export default Login;