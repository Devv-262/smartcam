/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.5)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.5)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.5)',
        'glow-yellow': '0 0 20px rgba(234, 179, 8, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
      },
    },
  },
  plugins: [],
  // Safelist for dynamic color classes
  safelist: [
    {
      pattern: /(bg|text|border)-(red|orange|yellow|green|cyan|blue|purple|pink)-(300|400|500|600|700)/,
      variants: ['hover', 'focus', 'active'],
    },
    {
      pattern: /from-(red|orange|yellow|green|cyan|blue|purple|pink)-(500|600|700)/,
    },
    {
      pattern: /to-(red|orange|yellow|green|cyan|blue|purple|pink)-(500|600|700|800)/,
    },
  ],
}