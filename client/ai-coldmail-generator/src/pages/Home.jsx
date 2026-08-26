import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Navbar */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <h1 className="text-2xl font-bold text-blue-600">
            ConvertBot
          </h1>

          {/* Buttons */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-lg border border-gray-300
              text-gray-700 font-medium hover:bg-gray-100 transition"
            >
              Log in
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-5 py-2 rounded-lg bg-black text-white
              font-medium hover:bg-gray-800 transition"
            >
              Sign up
            </button>

          </div>

        </div>
      </nav>


      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6">

        <div className="text-center max-w-3xl">

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Where should we begin?
          </h2>

          <p className="text-lg text-gray-500 mb-10">
            Create professional cold emails, LinkedIn messages,
            and follow-ups with AI.
          </p>


          {/* Input-style box */}
          <div className="max-w-2xl mx-auto">

            <div
              className="border border-gray-300 rounded-2xl
              shadow-sm px-5 py-4 flex items-center
              text-gray-400 text-left"
            >
              <span>
                What would you like to generate?
              </span>
            </div>

          </div>


          {/* Get Started */}
          <button
            onClick={() => navigate("/register")}
            className="mt-6 px-8 py-3 bg-blue-600 text-white
            rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </button>

        </div>

      </main>


      {/* Footer */}
      <footer className="border-t border-gray-200 py-5 text-center text-gray-500 text-sm">
        © 2026 ConvertBot
      </footer>

    </div>
  );
}

export default Home;