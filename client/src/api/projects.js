import client from "./client";

export const fetchProjects = () => client.get("/projects").then((r) => r.data.projects);

export const fetchProject = (id) =>
  client.get(`/projects/${id}`).then((r) => r.data);

export const createProject = (data) =>
  client.post("/projects", data).then((r) => r.data.project);

export const updateProject = (id, data) =>
  client.patch(`/projects/${id}`, data).then((r) => r.data.project);

export const deleteProject = (id) => client.delete(`/projects/${id}`).then((r) => r.data);

export const addMember = (id, email, role = "contributor") =>
  client.post(`/projects/${id}/members`, { email, role }).then((r) => r.data);

export const removeMember = (id, userId) =>
  client.delete(`/projects/${id}/members/${userId}`).then((r) => r.data);

