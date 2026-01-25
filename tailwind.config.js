/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'akademos-dark': '#4b1d4f',
        'akademos-medium': '#783b7d',
        'akademos-cream': '#efebe5',
        'akademos-white': '#ffffff',
        'akademos-gray': '#201f25',
      },
      fontFamily: {
        'hagrid': ['var(--font-hagrid)', 'sans-serif'],
        'poppins': ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
