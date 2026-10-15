// Vite only exposes variables prefixed with VITE_ to the browser.
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
};
