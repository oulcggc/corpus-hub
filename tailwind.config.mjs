/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      // 		--accent: 136, 58, 234;
      // --accent-light: 224, 204, 250;
      // --accent-dark: 49, 10, 101;
      colors: {
        accent: {
          DEFAULT: "rgb(136, 58, 234)",
          light: "rgb(224, 204, 250)",
          dark: "rgb(49, 10, 101)",
        },
      },
    },
  },
  plugins: [],
  darkMode: "selector",
};
