/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#8c2bee",
                "primary-dark": "#6b21b6",
                "secondary": "#db2777",
                "background-light": "#f7f6f8",
                "background-dark": "#191022",
                "charcoal": "#191022",
                "jobify": "#121214",
                "jobify-light": "#302839",
                "glass": "rgba(255, 255, 255, 0.05)",
                "glass-hover": "rgba(255, 255, 255, 0.1)",
                "glass-border": "rgba(255, 255, 255, 0.1)",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "2xl": "2rem",
                "full": "9999px"
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}
