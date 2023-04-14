/** @type {import('tailwindcss').Config} */

const colorGroups = [
  "backgroundColor",
  "textColor",
  "borderColor",
  "colors",
].reduce(
  (prev, curr) => ({
    ...prev,
    [curr]: {
      "twitter-blue": "#1d9bf0",
      "twitter-darkblue": "#1584cf",
    },
  }),
  {}
);

export default {
  content: [],
  theme: {
    extend: {
      ...colorGroups,
    },
    fontFamily: {
      Chirp: ["Chirp, sans-serif"],
    },
    container: {
      center: true,
      screens: {
        sm: "1250px",
        md: "1250px",
        lg: "1250px",
        xl: "1250px",
        "2xl": "1250px",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
};


