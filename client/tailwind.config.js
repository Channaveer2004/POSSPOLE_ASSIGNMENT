/** @type {import('tailwindcss').Config} */
export const content = [
  "./app/**/*.{js,ts,jsx,tsx}", // App Router (if using)
  "./pages/**/*.{js,ts,jsx,tsx}", // Pages Router
  "./components/**/*.{js,ts,jsx,tsx}", // Components
  "./src/**/*.{js,ts,jsx,tsx}", // If you keep files in src/
];
export const theme = {
  extend: {},
};
export const plugins = [];
