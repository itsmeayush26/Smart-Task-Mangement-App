import { useState, useEffect } from "react";
import axios from "../utils/axios";
import Navbar from "../components/Navbar";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get("/tasks/analytics/dashboard");
      setAnalytics(response.data.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Main Container */}

      <div className="flex flex-col gap-2 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mt-6">
        {/* Header */}
        <div className=" flex flex-col justify-center items-center mb-8">
          <h1 className=" text-4xl font-bold text-gray-800">Task Analytics</h1>
          <p className="text-gray-900 mt-1 text-sm sm:text-base">
            Insights into your productivity and task management
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-blue-100 p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-md font-semibold text-blue-700 mb-2">
              Total Tasks
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">
              {analytics?.totalTasks || 0}
            </p>
          </div>

          <div className="bg-blue-100 p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-md font-semibold text-blue-700 mb-2">
              Completed
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              {analytics?.completedTasks || 0}
            </p>
          </div>

          <div className="bg-blue-100 p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-md font-semibold text-blue-700 mb-2">
              Pending
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-orange-600">
              {analytics?.pendingTasks || 0}
            </p>
          </div>

          <div className="bg-blue-100 p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-md font-semibold text-blue-700 mb-2">
              Success Rate
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">
              {analytics?.completionRate || 0}%
            </p>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-purple-100 p-4 sm:p-6 rounded-lg shadow-sm mb-6 sm:mb-8">
          <h2 className="text-xl font-black text-blue-700 mb-4">
            Priority Distribution
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {analytics?.priorityDistribution?.map((item) => {
              const percentage = (
                (item.count / analytics.totalTasks) *
                100
              ).toFixed(1);

              return (
                <div key={item._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-black text-gray-500">{item._id}</span>
                    <span className="font-black text-gray-500">
                      {percentage}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-400 h-2 rounded">
                    <div
                      className={`h-2 rounded ${
                        item._id === "High"
                          ? "bg-yellow-400"
                          : item._id === "Medium"
                            ? "bg-lime-400"
                            : "bg-cyan-400"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-purple-100 p-4 sm:p-6 rounded-lg shadow-sm mb-6 sm:mb-8">
          <h2 className="text-xl font-black text-blue-700 mb-4">Task Status</h2>

          <div className="space-y-3 sm:space-y-4">
            {analytics?.statusDistribution?.map((item) => {
              const percentage = (
                (item.count / analytics.totalTasks) *
                100
              ).toFixed(1);

              return (
                <div key={item._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-black text-gray-500">{item._id}</span>
                    <span className="font-black text-gray-500">
                      {percentage}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-400 h-2 rounded">
                    <div
                      className={`h-2 rounded ${
                        item._id === "Completed"
                          ? "bg-emerald-500"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <h2 className="bg-blue-500 rounded text-xl font-bold text-white mb-4">
            Upcoming Deadlines
          </h2>

          {analytics?.upcomingDeadlines?.length === 0 ? (
            <p className="text-gray-500 text-xl font-bold text-center py-6">
              No upcoming deadlines 🎉
            </p>
          ) : (
            <div className="space-y-3">
              {analytics?.upcomingDeadlines?.map((task) => (
                <div
                  key={task._id}
                  className="bg-red-400 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 border rounded hover:bg-gray-50"
                >
                  <div>
                    <p className="font-bold text-xl text-gray-800">
                      {task.title}
                    </p>
                    <p className="text-md font-semibold text-gray-900">
                      {new Date(task.dueDate).toDateString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
