/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#1B1F23",
        bone: "#F1F3EF",
        paper: "#FBFAF7",
        moss: {
          DEFAULT: "#3F6659",
          light: "#E4ECE8",
          dark: "#2C4A40",
        },
        amber: {
          DEFAULT: "#E2A33D",
          light: "#FBEED9",
        },
        slate: {
          DEFAULT: "#43586B",
          light: "#E3E9EE",
        },
        coral: {
          DEFAULT: "#D96C5F",
          light: "#F8E1DD",
        },
        line: "#DCD9D0",
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        graph: "linear-gradient(#DCD9D0 1px, transparent 1px), linear-gradient(90deg, #DCD9D0 1px, transparent 1px)",
      },
      backgroundSize: {
        graph: "24px 24px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,31,35,0.06), 0 1px 0 rgba(27,31,35,0.04)",
        lifted: "0 8px 24px rgba(27,31,35,0.12)",
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
