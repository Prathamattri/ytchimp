import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_serverURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api2 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_serverURL,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
