/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './index.html',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container:
    {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      "xs": "540px",
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px",
      "3xl": "1800px"
    },
    extend: {
      colors :{
        "autofill" : "transparent",
        "primary-border-color" : "#464647",
        "primary-background" : "#1A1D1D",
        "secondary-background" : "#292B2C",
        "accent-primary" : "#014B77",
        "accent-secondary" : "#035c91",
        "text-primary" : "white",
        "text-heading" : "white",
        "text-secondary" : "#9EA7B0"
      },
      fontFamily: {
        'Guerrilla': ['Protest Guerrilla', 'ui-sans-serif', 'system-ui'],
        'Josefin': ['Josefin Sans', 'ui-sans-serif', 'system-ui'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"),
    require("autoprefixer")
  ],
}