/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/**/*.{js,ts,jsx,tsx,html,mdx}", "./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    screens: { md: { min: "551px", max: "1050px" }, sm: { min: "200px", max: "550px" } },
    extend: {
      colors: {
        gray: { 600: "#818181", "600_b2": "#818181b2" },
        blue_gray: { 100: "#d9d9d9", "100_01": "#d1d1d1" },
        black: { 900: "#000000" },
        deep_purple: { A200: "#7754f6", A200_54: "#7754f654" },
        white: { A700: "#ffffff" },
      },
      boxShadow: { bs: "0px 15px  30px -10px #7754f654" },
      fontFamily: { inter: "Inter" },
    },
  },
};
