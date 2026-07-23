import client from "./client";

export const fetchPersonalNotes = () =>
  client.get("/personal-notes").then((r) => r.data.notes);

export const createPersonalNote = (text, color) =>
  client.post("/personal-notes", { text, color }).then((r) => r.data.note);

export const togglePersonalNote = (id) =>
  client.patch(`/personal-notes/${id}/toggle`).then((r) => r.data.note);

export const deletePersonalNote = (id) =>
  client.delete(`/personal-notes/${id}`).then((r) => r.data);
