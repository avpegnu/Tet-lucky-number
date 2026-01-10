/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Tet Lucky Money Theme Colors
                'tet-red': {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626', // Primary red
                    700: '#b91c1c',
                    800: '#991b1b', // Dark red
                    900: '#7f1d1d',
                },
                'tet-gold': {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b', // Primary gold
                    600: '#d97706', // Dark gold
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                // Role-specific colors
                'lover-pink': {
                    500: '#ec4899',
                    600: '#db2777',
                },
                'friend-orange': {
                    500: '#fb923c',
                    600: '#ea580c',
                },
                'colleague-red': {
                    700: '#b91c1c',
                    800: '#991b1b',
                },
            },
            fontFamily: {
                'display': ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'shake': 'shake 0.5s ease-in-out',
                'confetti': 'confetti 1s ease-out',
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
                    '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
                },
                confetti: {
                    '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
                    '100%': { transform: 'translateY(-100vh) rotate(720deg)', opacity: '0' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
