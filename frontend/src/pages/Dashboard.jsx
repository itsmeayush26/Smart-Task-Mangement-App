import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "../utils/axios";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    sortBy: "",
  });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
    fetchAnalytics();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);

      const response = await axios.get(`/tasks?${params}`);
      setTasks(response.data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get("/tasks/analytics/dashboard");
      setAnalytics(response.data.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`/tasks/${id}`);
        fetchTasks();
        fetchAnalytics();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`/tasks/${task._id}`, {
        status: task.status === "Completed" ? "Pending" : "Completed",
      });
      fetchTasks();
      fetchAnalytics();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusBadge = (status) => {
    return status === "Completed"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-blue-100 text-blue-700 border-blue-200";
  };

  return (
    <div className="min-h-screen  bg-gray-100">
      <Navbar />

      <div className="flex flex-col gap-2 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mt-6">
        {/* Welcome */}
        <div className=" flex flex-col justify-center items-center mb-8">
          <h1 className=" text-4xl font-bold text-gray-800">
            Welcome back,{" "}
            <span className="text-blue-600">{user?.fullName}</span>
          </h1>
          <p className="text-gray-900 font-medium mt-1">
            Here’s what you need to focus on today
          </p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 mt-6 md:mt-8 lg:mt-10 px-4 md:px-6">
            {[
              {
                label: "Total Tasks",
                value: analytics.totalTasks,
                color: "text-gray-800",
              },
              {
                label: "Completed",
                value: analytics.completedTasks,
                color: "text-green-600",
              },
              {
                label: "Pending",
                value: analytics.pendingTasks,
                color: "text-orange-600",
              },
              {
                label: "Completion Rate",
                value: `${analytics.completionRate}%`,
                color: "text-purple-600",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-blue-100 p-6 rounded-lg shadow-sm">
                <h3 className="text-md font-semibold text-blue-700 mb-1">
                  {item.label}
                </h3>
                <p className={`text-3xl font-bold ${item.color}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-transparent px-4 py-4 mt-6 flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 max-w-3xl w-full">
            <input
              type="text"
              placeholder=" Search tasks..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="bg-purple-100 px-4 py-2 border border-gray-300 rounded-xl hover:border-blue-500 focus:outline-none focus:border-blue-800"
            />

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className=" bg-purple-100 px-4 py-2 border border-gray-300 rounded-xl hover:border-blue-500 focus:outline-none focus:border-blue-800"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
              className=" bg-purple-100 px-4 py-2 border border-gray-300 rounded-xl hover:border-blue-500 focus:outline-none focus:border-blue-800"
            >
              <option value="">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value })
              }
              className=" bg-purple-100 px-4 py-2 border border-gray-300 rounded-xl hover:border-blue-500 focus:outline-none focus:border-blue-800"
            >
              <option value="">Sort By</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        {/* Tasks */}

        <div className="bg-purple-100 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-blue-300  p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Your Tasks
              </h2>
              <p className="text-sm text-gray-500">{tasks.length} tasks</p>
            </div>

            <Link
              to="/tasks/new"
              className="px-6 py-4  bg-blue-800 font-bold  text-white rounded-lg hover:bg-purple-700 text-xl"
            >
              New Task
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center text-xl font-bold text-red-500">
              No tasks found
            </div>
          ) : (
            <div className="divide-y">
              {tasks.map((task) => (
                <div key={task._id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between gap-">
                    <div className="flex  gap-4">
                      <input
                        type="checkbox"
                        checked={task.status === "Completed"}
                        onChange={() => toggleComplete(task)}
                        className="mt-1"
                      />
                      <div>
                        <h3
                          className={`font-medium ${task.status === "Completed" ? "line-through text-gray-400" : "text-gray-800"}`}
                        >
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {task.description}
                        </p>
                        <div className="flex gap-2 text-xs">
                          <span
                            className={`px-2 py-1 border rounded ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </span>
                          <span
                            className={`px-2 py-1 border rounded ${getStatusBadge(task.status)}`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-2 items-center">
                      <Link
                        to={`/tasks/edit/${task._id}`}
                        className="px-3 py-1 text-blue-600 border font-medium border-blue-200 rounded hover:bg-blue-200 text-md"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="px-3 py-1 text-red-600 border  font-medium border-red-200 rounded hover:bg-red-200 text-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
