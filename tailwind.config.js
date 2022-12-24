/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        opensens:['Open Sans','sans-serif'],
        Poppins:['Poppins','sans-serif'],
      },
      colors:{
        heading:'#11175D',
        secondary: '#888BAE',
        button:'#5F35F5',
        span:'#EA6C00',
        inputfont:'#595D8E',
        ptag: '#4D4D4D',
      }
    },
  },
  plugins: [],
}
