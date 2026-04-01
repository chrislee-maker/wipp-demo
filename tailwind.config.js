/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'navy': '#0B1D3A',
        'wipp-blue': '#1B4DFF',
        'wipp-mint': '#00E5A0',
      },
    },
  },
  plugins: [],
}
