import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/axios";
import Navbar from "../components/Navbar";

const TaskForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await axios.get(`/tasks/${id}`);
      const task = response.data.data;
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate.split("T")[0],
        priority: task.priority,
      });
    } catch {
      setError("Error fetching task");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEdit) {
        await axios.put(`/tasks/${id}`, formData);
      } else {
        await axios.post("/tasks", formData);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="h-[calc(100vh-64px)] flex items-center bg-gray-100 justify-center px-4 overflow-hidden">
        <div className="bg-sky-200 rounded-2xl p-8 border border-gray-100 w-full max-w-2xl">
          <div className="mb-">
            <h1 className="text-3xl font-bold text-gray-800 ">
              {isEdit ? "Edit Task" : "Create New Task"}
            </h1>
            <p className="text-gray-800 font-blackmt-2">
              {isEdit
                ? " Update your task details below"
                : " Fill in the details to create a new task"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Task Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full px-4 py-3.5 border-2 border-blue-400 rounded-md focus:outline-none focus:border-purple-500"
                placeholder=" Enter task title"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {formData.title.length}/100
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3.5 border-2 border-blue-400 rounded-md focus:outline-none focus:border-purple-500"
                placeholder=" Describe your task..."
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {formData.description.length}/500
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3.5 border-2 border-blue-400 rounded-md focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["High", "Medium", "Low"].map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority })}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        formData.priority === priority
                          ? priority === "High"
                            ? "bg-red-500 text-white"
                            : priority === "Medium"
                              ? "bg-yellow-500 text-white"
                              : "bg-green-500 text-white"
                          : "bg-purple-100 text-gray-700 hover:bg-purple-300"
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
              >
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                    ? "Update Task"
                    : "Create Task"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-red-400 text-black py-4 rounded-xl font-semibold hover:bg-red-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
