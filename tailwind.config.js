/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./*.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                aura: {
                    green: '#4caf50',
                    darkgreen: '#388e3c',
                    lightgreen: '#c8e6c9',
                    brown: '#795548',
                    dark: '#1a1a1a',
                    light: '#f5f5f5',
                    gold: '#fbc02d',
                }
            },
            fontFamily: {
                sans: ['Josefin Sans', 'sans-serif'],
                heading: ['Josefin Sans', 'sans-serif'],
                body: ['Josefin Sans', 'sans-serif'],
                cursive: ['Caveat', 'cursive'],
            }
        },
    },
    plugins: [],
    darkMode: 'class',
}
