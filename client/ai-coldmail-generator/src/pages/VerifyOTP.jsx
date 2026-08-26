import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function VerifyOTP() {

  // ==================================================
  // Get email from registration
  // ==================================================

  const email = localStorage.getItem("registerEmail");

  // ==================================================
  // State
  // ==================================================

  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  // ==================================================
  // Verify OTP
  // ==================================================

  const handleVerifyOTP = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      // Send email + OTP to backend
      const response = await api.post(
        "/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      console.log(
        "OTP RESPONSE:",
        response.data
      );


      // ==================================================
      // Get token
      // ==================================================

      const token = response.data.token;


      // ==================================================
      // Get user
      // ==================================================

      const user = response.data.user;

      console.log(
        "USER FROM BACKEND:",
        user
      );


      // ==================================================
      // Safety check
      // ==================================================

      if (!token) {
        throw new Error(
          "Token was not returned by server"
        );
      }

      if (!user) {
        throw new Error(
          "User information was not returned by server"
        );
      }


      // ==================================================
      // Save token
      // ==================================================

      localStorage.setItem(
        "token",
        token
      );


      // ==================================================
      // Save user information
      // ==================================================

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );


      // ==================================================
      // Remove temporary registration email
      // ==================================================

      localStorage.removeItem(
        "registerEmail"
      );


      // ==================================================
      // Debug
      // ==================================================

      console.log(
        "TOKEN SAVED:",
        token
      );

      console.log(
        "USER SAVED:",
        user
      );


      // ==================================================
      // Go directly to dashboard
      // ==================================================

      navigate("/dashboard");

    } catch (error) {

      console.log(
        "OTP ERROR:",
        error
      );

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
        error.message ||
        "OTP verification failed"
      );

    } finally {

      setLoading(false);

    }
  };


  // ==================================================
  // UI
  // ==================================================

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

        {/* Logo */}

        <div className="text-center mb-6">

          <h1 className="text-3xl font-bold text-gray-900">
            ConvertBot
          </h1>

          <p className="text-gray-500 mt-2">
            Verify your email address
          </p>

        </div>


        {/* Email */}

        <div className="bg-gray-100 p-4 rounded-lg mb-5 text-center">

          <p className="text-sm text-gray-500">
            OTP sent to
          </p>

          <p className="font-semibold text-gray-900">
            {email}
          </p>

        </div>


        {/* Error */}

        {error && (

          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-5 text-sm">

            {error}

          </div>

        )}


        {/* Form */}

        <form onSubmit={handleVerifyOTP}>

          <label className="block mb-2 font-medium text-gray-700">
            Enter OTP
          </label>


          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {

              // Only allow numbers
              const value =
                e.target.value.replace(/\D/g, "");

              setOtp(value);

            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-xl tracking-[0.5em] outline-none focus:ring-2 focus:ring-blue-500"
            required
          />


          {/* Button */}

          <button
            type="submit"
            disabled={
              loading ||
              otp.length !== 6
            }
            className="w-full mt-5 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >

            {loading
              ? "Verifying..."
              : "Verify OTP"
            }

          </button>

        </form>


        {/* Register again */}

        <p className="text-center mt-6 text-gray-600">

          Wrong email?

          <button
            type="button"
            onClick={() => {

              localStorage.removeItem(
                "registerEmail"
              );

              navigate("/register");

            }}
            className="text-blue-600 font-semibold ml-1 hover:text-blue-700"
          >
            Register again
          </button>

        </p>

      </div>

    </div>

  );
}

export default VerifyOTP;