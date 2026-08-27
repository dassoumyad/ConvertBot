import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Copy,
  Check
} from "lucide-react";
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
  // OTP Modal State
  // =========================

  const [showOtpModal, setShowOtpModal] = useState(false);

  const [demoOTP, setDemoOTP] = useState("");

  const [copied, setCopied] = useState(false);


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

      // =========================================
      // Send registration data to backend
      // =========================================

      const response = await api.post(
        "/auth/register",
        {
          name,
          email,
          password
        }
      );


      // =========================================
      // Check backend response
      // =========================================

      console.log(
        "REGISTER RESPONSE:",
        response.data
      );


      // =========================================
      // Save email
      // =========================================

      localStorage.setItem(
        "registerEmail",
        email
      );


      // =========================================
      // Demo OTP
      // =========================================

      if (response.data.demoOTP) {

        const otp = response.data.demoOTP;

        console.log(
          "DEMO OTP:",
          otp
        );


        // Save OTP temporarily
        localStorage.setItem(
          "demoOTP",
          otp
        );


        // Store OTP in state
        setDemoOTP(otp);


        // Open OTP modal
        setShowOtpModal(true);

      } else {

        // =========================================
        // Real email mode
        // =========================================

        navigate("/verify-otp");

      }


    } catch (error) {

      // =========================================
      // Error Debugging
      // =========================================

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


      // =========================================
      // Display Error
      // =========================================

      setError(
        error.response?.data?.message ||
        "Registration failed"
      );


    } finally {

      setLoading(false);

    }

  };


  // =========================
  // Copy OTP
  // =========================

  const handleCopyOTP = async () => {

    try {

      await navigator.clipboard.writeText(
        demoOTP
      );


      setCopied(true);


      setTimeout(() => {

        setCopied(false);

      }, 2000);


    } catch (error) {

      console.log(
        "Copy failed:",
        error
      );

    }

  };


  // =========================
  // Continue to OTP Page
  // =========================

  const handleContinue = () => {

    setShowOtpModal(false);

    navigate("/verify-otp");

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      {/* ======================================= */}
      {/* Register Card */}
      {/* ======================================= */}

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
        {/* Registration Form */}
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
              onChange={(e) =>
                setName(e.target.value)
              }
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
              onChange={(e) =>
                setEmail(e.target.value)
              }
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
            onClick={() =>
              navigate("/login")
            }
            className="text-blue-600 hover:text-blue-700 font-semibold ml-1"
          >

            Login

          </button>

        </p>

      </div>


      {/* ======================================= */}
      {/* OTP MODAL */}
      {/* ======================================= */}

      {showOtpModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">


          {/* ================================= */}
          {/* Modal Card */}
          {/* ================================= */}

          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">


            {/* ========================= */}
            {/* Header */}
            {/* ========================= */}

            <div className="text-center">


              {/* Icon */}

              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">

                <ShieldCheck
                  size={26}
                  className="text-blue-600"
                />

              </div>


              {/* Title */}

              <h2 className="text-xl font-semibold text-gray-900 mt-4">

                Verify your email

              </h2>


              {/* Description */}

              <p className="text-sm text-gray-500 mt-2">

                We've generated a verification code for

              </p>


              {/* Email */}

              <p className="text-sm font-medium text-gray-700 mt-1 break-all">

                {email}

              </p>

            </div>


            {/* ========================= */}
            {/* OTP Section */}
            {/* ========================= */}

            <div className="mt-6">


              <p className="text-xs font-medium text-gray-500 mb-2">

                VERIFICATION CODE

              </p>


              <div className="flex items-center gap-2">


                {/* OTP */}

                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg py-3 text-center overflow-hidden">

                  <span className="text-2xl font-semibold tracking-[0.25em] text-gray-900">

                    {demoOTP}

                  </span>

                </div>


                {/* Copy Button */}

                <button
                  type="button"
                  onClick={handleCopyOTP}
                  className="h-12 w-12 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
                  title="Copy OTP"
                >

                  {copied ? (

                    <Check
                      size={19}
                      className="text-green-600"
                    />

                  ) : (

                    <Copy
                      size={19}
                      className="text-gray-500"
                    />

                  )}

                </button>

              </div>

            </div>


            {/* ========================= */}
            {/* Expiry */}
            {/* ========================= */}

            <p className="text-xs text-gray-500 text-center mt-4">

              This code is valid for 15 minutes.

            </p>


            {/* ========================= */}
            {/* Continue Button */}
            {/* ========================= */}

            <button
              type="button"
              onClick={handleContinue}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
            >

              Continue

            </button>


            {/* ========================= */}
            {/* Demo Notice */}
            {/* ========================= */}

            <p className="text-xs text-gray-400 text-center mt-4">

              Demo verification code

            </p>

          </div>

        </div>

      )}

    </div>

  );

}

export default Register;