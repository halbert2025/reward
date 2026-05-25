import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#26322f",
        paper: "#fffaf0",
        leaf: "#5f7d63",
        berry: "#b8585f",
        sky: "#8fb7c7"
      },
      borderRadius: {
        panel: "8px"
      }
    }
  },
  plugins: []
};

export default config;
