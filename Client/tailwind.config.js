/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        wcolor : '#ffffff',
        bgcolor : '#181a1b',
        bglight : '#1c1c1c',
        fgcolor : '#c9c9c9',
        themecolor : '#06d433',
        blurcolor: '#444745',
        grayedcolor : '#cec5c59c',
        tagcolor: '#02f798',
        errorcolor: '#ee0303',
        groupcolor: '#e76306'
      },
      fontFamily: {
        roboto : 'Roboto',
        poppins: 'Poppins'
      }
    },
  },
  plugins: [],
}

