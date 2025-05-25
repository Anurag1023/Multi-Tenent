import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { authUser } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: [],
    priority: "medium",
    dueDate: "",
    category: "feature",
  });
  const [statusUpdate, setStatusUpdate] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [inviteForm, setInviteForm] = useState({ role: "member" });
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/tasks/", { withCredentials: true });
      setTasks(Array.isArray(res.data) ? res.data : res.data.tasks || []);
    } catch (err) {
      setError("Failed to fetch tasks");
      toast.error("Failed to fetch tasks");
      setTasks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch members list
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axiosInstance.get(
          "/users/",
          { withCredentials: true }
        );
        setMembers(Array.isArray(res.data) ? res.data : res.data.members || []);
      } catch (err) {
        setMembers([]);
        toast.error("Failed to fetch members");
      }
    };
    fetchMembers();
  }, []);

  // Handle form input for task creation
  const handleTaskFormChange = (e) => {
    const { name, value, selectedOptions } = e.target;
    if (name === "assignedTo") {
      const selected = Array.from(selectedOptions, (option) => option.value);
      setTaskForm((prev) => ({ ...prev, assignedTo: selected }));
    } else {
      setTaskForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle checkbox for assignedTo
  const handleAssignedToCheckbox = (userId) => {
    setTaskForm((prev) => {
      const alreadySelected = prev.assignedTo.includes(userId);
      return {
        ...prev,
        assignedTo: alreadySelected
          ? prev.assignedTo.filter((id) => id !== userId)
          : [...prev.assignedTo, userId],
      };
    });
  };

  // Handle create task (admin/manager only)
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await axiosInstance.post(
        "/tasks",
        { ...taskForm },
        { withCredentials: true }
      );
      setSuccess("Task created!");
      toast.success("Task created!");
      setTaskForm({
        title: "",
        description: "",
        assignedTo: [],
        priority: "medium",
        dueDate: "",
        category: "feature",
      });
      await fetchTasks(); // refresh tasks after creation
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
      toast.error(err.response?.data?.message || "Failed to create task");
    }
  };

  // Handle status update (member: only own tasks)
  const handleStatusChange = (taskId, value) => {
    setStatusUpdate((prev) => ({ ...prev, [taskId]: value }));
  };

  const handleUpdateStatus = async (taskId) => {
    setError("");
    setSuccess("");
    try {
      await axiosInstance.patch(
        `/tasks/${taskId}/status`,
        { status: statusUpdate[taskId] },
        { withCredentials: true }
      );
      toast.success("Status updated successfully!");
      setSuccess("Status updated!");
      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, status: statusUpdate[taskId] } : t
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  // Invite user handlers
  const handleInviteChange = (e) => {
    setInviteForm({ ...inviteForm, [e.target.name]: e.target.value });
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setInviteSuccess("");
    setInviteError("");
    setInviteCode("");
    try {
      const res = await axiosInstance.post(
        "/org/invite",
        inviteForm,
        { withCredentials: true }
      );
      setInviteSuccess(res.data.message || "Invite created!");
      setInviteCode(res.data.code || "");
      toast.success(res.data.message || "Invite created!");
    } catch (err) {
      setInviteError(err.response?.data?.message || "Failed to create invite");
      toast.error(err.response?.data?.message || "Failed to create invite");
    }
  };

  // Delete task handler
  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`, { withCredentials: true });
      toast.success("Task deleted!");
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  // Use authUser.user for details
  const user = authUser?.user;

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-900 drop-shadow-lg tracking-tight">
        Dashboard
      </h1>

      {/* Invite User Section (Admin/Manager only) */}
      {(user?.role === "admin" || user?.role === "manager") && (
        <div className="mb-10 p-8 bg-white rounded-2xl shadow-lg max-w-xl mx-auto border border-blue-100">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Invite User</h2>
          <form onSubmit={handleInviteSubmit}>
            <div className="mb-3">
              <label className="block text-gray-700 font-medium mb-1">
                Role
              </label>
              <select
                name="role"
                value={inviteForm.role}
                onChange={handleInviteChange}
                className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-400"
                required
              >
                <option value="member">Member</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <button
              type="submit"
              className="mt-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded shadow hover:from-blue-700 hover:to-purple-700 transition"
            >
              Generate Invite Code
            </button>
          </form>
          {inviteSuccess && (
            <div className="text-green-600 mt-2">{inviteSuccess}</div>
          )}
          {inviteCode && (
            <div className="mt-2 break-all">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">{inviteCode}</span>
            </div>
          )}
          {inviteError && (
            <div className="text-red-600 mt-2">{inviteError}</div>
          )}
        </div>
      )}

      {/* Admin/Manager: Create Task */}
      {(user?.role === "admin" || user?.role === "manager") && (
        <form
          onSubmit={handleCreateTask}
          className="mb-10 p-8 bg-white rounded-2xl shadow-lg max-w-xl mx-auto border border-blue-100"
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Create Task</h2>
          <div className="mb-4">
            <input
              type="text"
              name="title"
              value={taskForm.title}
              onChange={handleTaskFormChange}
              placeholder="Title"
              required
              className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div className="mb-4">
            <textarea
              name="description"
              value={taskForm.description}
              onChange={handleTaskFormChange}
              placeholder="Description"
              className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Assign to Members
            </label>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(members) &&
                members.map((member) => (
                  <label key={member._id} className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded shadow-sm">
                    <input
                      type="checkbox"
                      checked={taskForm.assignedTo.includes(member._id)}
                      onChange={() => handleAssignedToCheckbox(member._id)}
                      className="accent-blue-600"
                    />
                    <span className="text-gray-800">
                      {member.name} <span className="text-xs text-gray-500">({member.email})</span>
                    </span>
                  </label>
                ))}
            </div>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <select
              name="priority"
              value={taskForm.priority}
              onChange={handleTaskFormChange}
              className="px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              name="category"
              value={taskForm.category}
              onChange={handleTaskFormChange}
              className="px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            >
              <option value="feature">Feature</option>
              <option value="bug">Bug</option>
              <option value="improvement">Improvement</option>
            </select>
            <input
              type="date"
              name="dueDate"
              value={taskForm.dueDate}
              onChange={handleTaskFormChange}
              className="px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <button
            type="submit"
            className="mt-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded shadow hover:from-blue-700 hover:to-purple-700 transition"
          >
            Create Task
          </button>
        </form>
      )}

      {/* Task List */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-blue-800">Tasks</h2>
        {loading ? (
          <div className="text-center text-blue-600 font-semibold py-8">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No tasks found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="py-3 px-4 font-semibold text-blue-900">Title</th>
                  <th className="px-4 font-semibold text-blue-900">Description</th>
                  <th className="px-4 font-semibold text-blue-900">Assigned To</th>
                  <th className="px-4 font-semibold text-blue-900">Status</th>
                  <th className="px-4 font-semibold text-blue-900">Priority</th>
                  <th className="px-4 font-semibold text-blue-900">Due Date</th>
                  <th className="px-4 font-semibold text-blue-900">Category</th>
                  {user?.role === "member" && <th className="px-4 font-semibold text-blue-900">Update Status</th>}
                  {user?.role === "admin" && <th className="px-4 font-semibold text-blue-900">Delete</th>}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(tasks) &&
                  [...tasks].reverse().map((task, idx) => (
                    <tr
                      key={task._id}
                      className={`border-t ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
                    >
                      <td className="py-3 px-4 font-medium">{task.title}</td>
                      <td className="px-4">{task.description}</td>
                      <td className="px-4">
                        {Array.isArray(task.assignedTo)
                          ? task.assignedTo
                              .map((u) =>
                                typeof u === "object" && u !== null && u.name && u.email
                                  ? `${u.name} (${u.email})`
                                  : (() => {
                                      const memberObj = members.find((m) => m._id === u || m.id === u);
                                      return memberObj
                                        ? `${memberObj.name} (${memberObj.email})`
                                        : u;
                                    })()
                              )
                              .join(", ")
                          : ""}
                      </td>
                      <td className="px-4">
                        <select
                          value={statusUpdate[task._id] || task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          className="px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-400 bg-white"
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button
                          onClick={() => handleUpdateStatus(task._id)}
                          className="ml-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                          Update
                        </button>
                      </td>
                      <td className="px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-4">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : ""}
                      </td>
                      <td className="px-4 capitalize">{task.category}</td>
                      {/* Member: Only update status for own tasks */}
                      {user?.role === "member" &&
                        Array.isArray(task.assignedTo) &&
                        task.assignedTo.some(
                          (u) => (u && (u._id === user.id || u === user.id))
                        ) && (
                          <td className="px-4">
                            <select
                              value={statusUpdate[task._id] || task.status}
                              onChange={(e) =>
                                handleStatusChange(task._id, e.target.value)
                              }
                              className="px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring focus:border-blue-400 bg-white"
                            >
                              <option value="todo">To Do</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                            <button
                              onClick={() => handleUpdateStatus(task._id)}
                              className="ml-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                              Update
                            </button>
                          </td>
                        )}
                      {/* Admin: Delete task button */}
                      {user?.role === "admin" && (
                        <td className="px-4">
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;