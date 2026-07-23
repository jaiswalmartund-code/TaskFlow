import client from "./client";

export const signup = (data) => client.post("/auth/signup", data).then((r) => r.data);
export const login = (data) => client.post("/auth/login", data).then((r) => r.data);
export const fetchMe = () => client.get("/auth/me").then((r) => r.data);
