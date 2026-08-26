import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function History() {
  const navigate = useNavigate();

  // ==============================
  // STATE
  // ==============================

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Which item is being regenerated
  const [regenerating, setRegenerating] = useState(null);

  // Which text was copied
  const [copied, setCopied] = useState("");

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);

  // Delete loading
  const [deleting, setDeleting] = useState(false);


  // ==============================
  // GET HISTORY
  // ==============================

  const getHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/ai/history");

      setHistory(response.data.data);

    } catch (error) {
      console.log("HISTORY ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load email history"
      );

    } finally {
      setLoading(false);
    }
  };


  // ==============================
  // LOAD HISTORY
  // ==============================

  useEffect(() => {
    getHistory();
  }, []);


  // ==============================
  // COPY
  // ==============================

  const handleCopy = async (text, id) => {
    try {

      await navigator.clipboard.writeText(text);

      // Show Copied
      setCopied(id);

      // Change back after 2 seconds
      setTimeout(() => {
        setCopied("");
      }, 2000);

    } catch (error) {

      console.log("COPY ERROR:", error);

    }
  };


  // ==============================
  // REGENERATE
  // ==============================

  const handleRegenerate = async (item) => {
    try {

      setRegenerating(item._id);

      await api.post("/ai/generate-email", {
        prompt: item.prompt
      });

      // Reload history
      await getHistory();

    } catch (error) {

      console.log("REGENERATE ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Failed to regenerate email"
      );

    } finally {

      setRegenerating(null);

    }
  };


  // ==============================
  // OPEN DELETE MODAL
  // ==============================

  const openDeleteModal = (id) => {
    setDeleteId(id);
  };


  // ==============================
  // CLOSE DELETE MODAL
  // ==============================

  const closeDeleteModal = () => {
    if (!deleting) {
      setDeleteId(null);
    }
  };


  // ==============================
  // DELETE HISTORY
  // ==============================

  const handleDelete = async () => {

    if (!deleteId) {
      return;
    }

    try {

      setDeleting(true);

      await api.delete(
        `/ai/history/${deleteId}`
      );

      // Remove from UI
      setHistory((previousHistory) =>
        previousHistory.filter(
          (item) => item._id !== deleteId
        )
      );

      // Close modal
      setDeleteId(null);

    } catch (error) {

      console.log("DELETE ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Failed to delete email"
      );

    } finally {

      setDeleting(false);

    }
  };


  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("registerEmail");

    navigate("/login");
  };


  // ==============================
  // LOADING
  // ==============================

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Loading history...
          </p>

        </div>

      </div>
    );
  }


  // ==============================
  // MAIN UI
  // ==============================

  return (

    <div className="min-h-screen bg-gray-50">


      {/* ==================================
          NAVBAR
      ================================== */}

      <nav className="bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}

          <button
            onClick={() => navigate("/dashboard")}
            className="text-2xl font-bold text-blue-600"
          >
            AI Cold Mail
          </button>


          {/* Right side */}

          <div className="flex items-center gap-6">

            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium transition"
            >
              Logout
            </button>

          </div>

        </div>

      </nav>



      {/* ==================================
          MAIN
      ================================== */}

      <main className="max-w-7xl mx-auto px-6 py-10">


        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Email History
          </h1>

          <p className="text-gray-500 mt-2">
            View and manage your previously generated emails.
          </p>

        </div>



        {/* ERROR */}

        {error && (

          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>

        )}



        {/* EMPTY */}

        {!error && history.length === 0 && (

          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">

            <div className="text-5xl mb-4">
              ✉️
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              No email history yet
            </h2>

            <p className="text-gray-500 mt-2">
              Generate your first AI cold email.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Generate Email
            </button>

          </div>

        )}



        {/* ==================================
            HISTORY LIST
        ================================== */}

        <div className="space-y-8">

          {history.map((item) => (

            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
            >


              {/* CARD HEADER */}

              <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                  <p className="text-sm text-gray-400 mb-1">

                    {new Date(
                      item.createdAt
                    ).toLocaleString()}

                  </p>

                  <h2 className="text-xl font-bold text-gray-900">
                    {item.subject}
                  </h2>

                </div>


                {/* Copy Subject */}

                <button
                  onClick={() =>
                    handleCopy(
                      item.subject,
                      `${item._id}-subject`
                    )
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    copied === `${item._id}-subject`
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >

                  {copied === `${item._id}-subject`
                    ? "✓ Copied"
                    : "Copy Subject"}

                </button>

              </div>



              {/* CARD BODY */}

              <div className="p-6">


                {/* ==================================
                    PROMPT
                ================================== */}

                <div className="mb-7">

                  <h3 className="font-semibold text-gray-800 mb-2">
                    Prompt
                  </h3>

                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">

                    <p className="text-gray-600 leading-relaxed">
                      {item.prompt}
                    </p>

                  </div>

                </div>



                {/* ==================================
                    COLD EMAIL
                ================================== */}

                <div className="mb-7">

                  <div className="flex items-center justify-between mb-2">

                    <h3 className="font-semibold text-gray-800">
                      Cold Email
                    </h3>

                    <button
                      onClick={() =>
                        handleCopy(
                          item.emailBody,
                          `${item._id}-email`
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        copied === `${item._id}-email`
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      }`}
                    >

                      {copied === `${item._id}-email`
                        ? "✓ Copied"
                        : "Copy"}

                    </button>

                  </div>


                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">

                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {item.emailBody}
                    </p>

                  </div>

                </div>



                {/* ==================================
                    LINKEDIN
                ================================== */}

                <div className="mb-7">

                  <div className="flex items-center justify-between mb-2">

                    <h3 className="font-semibold text-gray-800">
                      LinkedIn DM
                    </h3>

                    <button
                      onClick={() =>
                        handleCopy(
                          item.linkedinDM,
                          `${item._id}-linkedin`
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        copied === `${item._id}-linkedin`
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      }`}
                    >

                      {copied === `${item._id}-linkedin`
                        ? "✓ Copied"
                        : "Copy"}

                    </button>

                  </div>


                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">

                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {item.linkedinDM}
                    </p>

                  </div>

                </div>



                {/* ==================================
                    FOLLOW UP
                ================================== */}

                <div>

                  <div className="flex items-center justify-between mb-2">

                    <h3 className="font-semibold text-gray-800">
                      Follow-up Email
                    </h3>

                    <button
                      onClick={() =>
                        handleCopy(
                          item.followUpEmail,
                          `${item._id}-followup`
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        copied === `${item._id}-followup`
                          ? "bg-green-100 text-green-700"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >

                      {copied === `${item._id}-followup`
                        ? "✓ Copied"
                        : "Copy"}

                    </button>

                  </div>


                  <div className="bg-green-50 border border-green-100 rounded-xl p-5">

                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {item.followUpEmail}
                    </p>

                  </div>

                </div>



                {/* ==================================
                    ACTIONS
                ================================== */}

                <div className="border-t border-gray-200 mt-8 pt-5 flex flex-col sm:flex-row justify-end gap-3">


                  {/* REGENERATE */}

                  <button
                    onClick={() =>
                      handleRegenerate(item)
                    }
                    disabled={
                      regenerating === item._id
                    }
                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:bg-gray-400"
                  >

                    {regenerating === item._id
                      ? "Regenerating..."
                      : "↻ Regenerate"}

                  </button>



                  {/* DELETE */}

                  <button
                    onClick={() =>
                      openDeleteModal(item._id)
                    }
                    className="px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
                  >

                    🗑 Delete

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </main>



      {/* ==================================
          DELETE CONFIRMATION MODAL
      ================================== */}

      {deleteId && (

        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

          {/* Background */}

          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDeleteModal}
          ></div>


          {/* Modal */}

          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-7">


            {/* Icon */}

            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">

              <span className="text-2xl">
                🗑️
              </span>

            </div>


            {/* Title */}

            <h2 className="text-xl font-bold text-gray-900 text-center">

              Delete Email?

            </h2>


            {/* Message */}

            <p className="text-gray-500 text-center mt-3 leading-relaxed">

              Are you sure you want to delete this email?

              <br />

              This action cannot be undone.

            </p>


            {/* Buttons */}

            <div className="flex gap-3 mt-7">


              {/* Cancel */}

              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="flex-1 px-5 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>


              {/* Delete */}

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-5 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition disabled:bg-red-300"
              >

                {deleting
                  ? "Deleting..."
                  : "Yes, Delete"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default History;