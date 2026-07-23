import client from "./client";

export const fetchTasks = (projectId, params = {}) =>
  client.get(`/projects/${projectId}/tasks`, { params }).then((r) => r.data.tasks);

export const createTask = (projectId, data) =>
  client.post(`/projects/${projectId}/tasks`, data).then((r) => r.data.task);

export const updateTask = (taskId, data) =>
  client.patch(`/tasks/${taskId}`, data).then((r) => r.data.task);

export const deleteTask = (taskId) => client.delete(`/tasks/${taskId}`).then((r) => r.data);

export const fetchUpcomingDeadlines = () =>
  client.get("/tasks/upcoming").then((r) => r.data.tasks);

export const addRemark = (taskId, text, color) =>
  client.post(`/tasks/${taskId}/remarks`, { text, color }).then((r) => r.data.task);

export const deleteRemark = (taskId, remarkId) =>
  client.delete(`/tasks/${taskId}/remarks/${remarkId}`).then((r) => r.data.task);


