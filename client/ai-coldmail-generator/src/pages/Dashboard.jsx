import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function Dashboard() {

  const navigate = useNavigate();

  // =========================
  // State
  // =========================

  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [result, setResult] = useState(null);

  const [history, setHistory] = useState([]);

  const [user, setUser] = useState(null);


  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);


  // Copy state
  const [copied, setCopied] = useState("");


  // Delete modal
  const [deleteItem, setDeleteItem] = useState(null);

  const [deleteLoading, setDeleteLoading] = useState(false);


  // =========================
  // Load User
  // =========================

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {

      try {

        setUser(JSON.parse(storedUser));

      } catch (error) {

        console.log("User parsing error");

      }

    }

  }, []);


  // =========================
  // Get History
  // =========================

  const loadHistory = async () => {

    try {

      const response = await api.get("/ai/history");

      setHistory(response.data.data || []);

    } catch (error) {

      console.log(
        "History Error:",
        error.response?.data || error.message
      );

    }

  };


  useEffect(() => {

    loadHistory();

  }, []);


  // =========================
  // Generate Email
  // =========================

  const handleGenerate = async (e) => {

    e.preventDefault();

    if (!prompt.trim()) {

      setError("Please enter a prompt");

      return;

    }

    try {

      setLoading(true);

      setError("");

      setResult(null);


      const response = await api.post(
        "/ai/generate-email",
        {
          prompt
        }
      );


      setResult(response.data.data);


      // Refresh history
      await loadHistory();


    } catch (error) {

      console.log("AI ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Failed to generate email"
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================
  // Open History
  // =========================

  const openHistory = (item) => {

    setPrompt(item.prompt);

    setResult({

      subject: item.subject,

      emailBody: item.emailBody,

      linkedinDM: item.linkedinDM,

      followUpEmail: item.followUpEmail

    });


    // Close sidebar on mobile
    setSidebarOpen(false);

  };


  // =========================
  // New Email
  // =========================

  const handleNewEmail = () => {

    setPrompt("");

    setResult(null);

    setError("");

    setCopied("");

    setSidebarOpen(false);

  };


  // =========================
  // Copy Text
  // =========================

  const handleCopy = async (text, type) => {

    try {

      await navigator.clipboard.writeText(text);

      setCopied(type);


      // Return button to Copy
      setTimeout(() => {

        setCopied("");

      }, 2000);

    } catch (error) {

      console.log("Copy failed:", error);

    }

  };


  // =========================
  // Delete History
  // =========================

  const handleDelete = async () => {

    if (!deleteItem) return;


    try {

      setDeleteLoading(true);


      await api.delete(
        `/ai/history/${deleteItem._id}`
      );


      // Remove from frontend immediately
      setHistory((prev) =>
        prev.filter(
          (item) => item._id !== deleteItem._id
        )
      );


      // If currently viewing deleted email
      if (
        result &&
        deleteItem.subject === result.subject
      ) {

        setResult(null);

        setPrompt("");

      }


      // Close modal
      setDeleteItem(null);


    } catch (error) {

      console.log(
        "Delete Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to delete email"
      );

    } finally {

      setDeleteLoading(false);

    }

  };


  // =========================
  // Regenerate
  // =========================

  const handleRegenerate = async () => {

    if (!prompt.trim()) {

      setError("No prompt available");

      return;

    }


    try {

      setLoading(true);

      setError("");


      const response = await api.post(
        "/ai/generate-email",
        {
          prompt
        }
      );


      setResult(response.data.data);


      // Refresh history
      await loadHistory();


    } catch (error) {

      console.log(
        "Regenerate Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to regenerate email"
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================
  // Logout
  // =========================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

  };


  return (

    <div className="min-h-screen bg-gray-100">


      {/* ================================= */}
      {/* MOBILE OVERLAY */}
      {/* ================================= */}

      {sidebarOpen && (

        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />

      )}


      {/* ================================= */}
      {/* SIDEBAR */}
      {/* ================================= */}

      <aside
        className={`
          fixed
          top-0
          left-0
          h-screen
          w-72
          bg-[#111827]
          text-white
          z-50
          flex
          flex-col
          transition-transform
          duration-300
          ease-in-out

          ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }

          md:translate-x-0
        `}
      >


        {/* ================================= */}
        {/* SIDEBAR HEADER */}
        {/* ================================= */}

        <div className="p-4">

          <div className="flex items-center justify-between">

            <h1 className="text-xl font-bold">
              ConvertBot
            </h1>


            {/* Mobile close */}

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>

          </div>


          {/* New Email */}

          <button
            onClick={handleNewEmail}
            className="w-full mt-5 border border-gray-600 hover:bg-gray-800 rounded-xl px-4 py-3 text-left transition"
          >

            <span className="text-lg">
              +
            </span>

            <span className="ml-2">
              New Email
            </span>

          </button>

        </div>


        {/* ================================= */}
        {/* RECENT HISTORY */}
        {/* ================================= */}

        <div className="flex-1 overflow-y-auto px-3">

          <p className="text-xs text-gray-400 uppercase px-2 mb-3">
            Recent
          </p>


          {history.length === 0 ? (

            <p className="text-sm text-gray-500 px-2">
              No emails yet
            </p>

          ) : (

            <div className="space-y-1">

              {history.map((item) => (

                <div
                  key={item._id}
                  className="group flex items-center gap-1"
                >


                  {/* Prompt */}

                  <button
                    onClick={() => openHistory(item)}
                    className="flex-1 min-w-0 text-left px-3 py-3 rounded-lg hover:bg-gray-800 transition"
                  >

                    <p className="text-sm text-gray-200 truncate">

                      {item.prompt}

                    </p>

                  </button>


                  {/* Delete */}

                  <button
                    onClick={() => setDeleteItem(item)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 px-2 transition"
                    title="Delete"
                  >

                    🗑️

                  </button>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* ================================= */}
        {/* USER */}
        {/* ================================= */}

        <div className="border-t border-gray-700 p-4">


          <div className="flex items-center gap-3">


            {/* Avatar */}

            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">

              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"
              }

            </div>


            <div className="min-w-0">

              <p className="font-medium truncate">

                {user?.name || "User"}

              </p>

              <p className="text-xs text-gray-400 truncate">

                {user?.email || ""}

              </p>

            </div>

          </div>


          {/* Logout */}

          <button
            onClick={handleLogout}
            className="w-full mt-4 px-3 py-2 text-left rounded-lg hover:bg-red-900/40 text-red-400 transition"
          >

            🚪 Logout

          </button>

        </div>

      </aside>


      {/* ================================= */}
      {/* MAIN */}
      {/* ================================= */}

      <main className="md:ml-72">


        {/* ================================= */}
        {/* TOP BAR */}
        {/* ================================= */}

        <header className="h-16 bg-white border-b flex items-center px-4 md:px-8 sticky top-0 z-30">


          {/* Hamburger */}

          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden mr-4 text-2xl text-gray-700"
          >

            ☰

          </button>


          <h2 className="font-semibold text-gray-700">

            AI Cold Email Generator

          </h2>

        </header>


        {/* ================================= */}
        {/* CONTENT */}
        {/* ================================= */}

        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-10">


          {/* Heading */}

          <div className="text-center mb-8">

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">

              AI Cold Email Generator

            </h1>

            <p className="text-gray-500 mt-2">

              Generate professional cold emails in seconds

            </p>

          </div>


          {/* ================================= */}
          {/* PROMPT BOX */}
          {/* ================================= */}

          <div className="bg-white rounded-2xl shadow-sm border p-5 md:p-6">


            <label className="block font-semibold text-gray-700 mb-3">

              What email do you want to generate?

            </label>


            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Write a professional cold email to Rahul, HR Manager at Amazon. I am a backend developer with 4 years of experience."
              className="w-full min-h-40 border border-gray-300 rounded-xl p-4 resize-none outline-none focus:ring-2 focus:ring-blue-500"
            />


            {/* Error */}

            {error && (

              <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3">

                {error}

              </div>

            )}


            {/* Generate */}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition"
            >

              {loading
                ? "Generating..."
                : "Generate Email"
              }

            </button>

          </div>


          {/* ================================= */}
          {/* RESULT */}
          {/* ================================= */}

          {result && (

            <div className="mt-8 space-y-5">


              {/* ================================= */}
              {/* SUBJECT */}
              {/* ================================= */}

              <div className="bg-white rounded-xl border shadow-sm p-5">

                <div className="flex items-center justify-between gap-4 mb-3">

                  <h3 className="font-semibold text-gray-700">
                    Subject
                  </h3>


                  <button
                    onClick={() =>
                      handleCopy(
                        result.subject,
                        "subject"
                      )
                    }
                    className="px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                  >

                    {copied === "subject"
                      ? "✓ Copied"
                      : "Copy"
                    }

                  </button>

                </div>


                <p className="text-gray-800">
                  {result.subject}
                </p>

              </div>


              {/* ================================= */}
              {/* COLD EMAIL */}
              {/* ================================= */}

              <div className="bg-white rounded-xl border shadow-sm p-5">

                <div className="flex items-center justify-between gap-4 mb-3">

                  <h3 className="font-semibold text-gray-700">
                    Cold Email
                  </h3>


                  <button
                    onClick={() =>
                      handleCopy(
                        result.emailBody,
                        "email"
                      )
                    }
                    className="px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                  >

                    {copied === "email"
                      ? "✓ Copied"
                      : "Copy"
                    }

                  </button>

                </div>


                <div className="whitespace-pre-wrap text-gray-700 leading-7">

                  {result.emailBody}

                </div>

              </div>


              {/* ================================= */}
              {/* LINKEDIN */}
              {/* ================================= */}

              <div className="bg-white rounded-xl border shadow-sm p-5">

                <div className="flex items-center justify-between gap-4 mb-3">

                  <h3 className="font-semibold text-gray-700">
                    LinkedIn DM
                  </h3>


                  <button
                    onClick={() =>
                      handleCopy(
                        result.linkedinDM,
                        "linkedin"
                      )
                    }
                    className="px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                  >

                    {copied === "linkedin"
                      ? "✓ Copied"
                      : "Copy"
                    }

                  </button>

                </div>


                <div className="whitespace-pre-wrap text-gray-700 leading-7">

                  {result.linkedinDM}

                </div>

              </div>


              {/* ================================= */}
              {/* FOLLOW UP */}
              {/* ================================= */}

              <div className="bg-white rounded-xl border shadow-sm p-5">

                <div className="flex items-center justify-between gap-4 mb-3">

                  <h3 className="font-semibold text-gray-700">
                    Follow-up Email
                  </h3>


                  <button
                    onClick={() =>
                      handleCopy(
                        result.followUpEmail,
                        "followup"
                      )
                    }
                    className="px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                  >

                    {copied === "followup"
                      ? "✓ Copied"
                      : "Copy"
                    }

                  </button>

                </div>


                <div className="whitespace-pre-wrap text-gray-700 leading-7">

                  {result.followUpEmail}

                </div>

              </div>


              {/* ================================= */}
              {/* ACTION BUTTONS */}
              {/* ================================= */}

              <div className="flex flex-col sm:flex-row gap-3">


                {/* Regenerate */}

                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition"
                >

                  {loading
                    ? "Regenerating..."
                    : "🔄 Regenerate"
                  }

                </button>


                {/* Delete */}

                <button
                  onClick={() => {

                    const current = history.find(
                      (item) =>
                        item.subject === result.subject
                    );

                    if (current) {
                      setDeleteItem(current);
                    }

                  }}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3 rounded-xl font-semibold transition"
                >

                  🗑️ Delete

                </button>

              </div>

            </div>

          )}

        </div>

      </main>


      {/* ================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ================================= */}

      {deleteItem && (

        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center px-4">


          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">


            {/* Icon */}

            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl mb-4">

              🗑️

            </div>


            <h2 className="text-xl font-bold text-gray-800">

              Delete email?

            </h2>


            <p className="text-gray-500 mt-2 leading-6">

              Are you sure you want to delete this email?

              <br />

              This action cannot be undone.

            </p>


            {/* Buttons */}

            <div className="flex gap-3 mt-6">


              <button
                onClick={() => setDeleteItem(null)}
                disabled={deleteLoading}
                className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold transition"
              >

                Cancel

              </button>


              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition"
              >

                {deleteLoading
                  ? "Deleting..."
                  : "Delete"
                }

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default Dashboard;