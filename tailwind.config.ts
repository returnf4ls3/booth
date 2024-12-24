import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-custom': `
          linear-gradient(
            to bottom,
            rgba(22, 163, 74, 0.8),
            rgba(239, 68, 68, 0.7),
            rgba(255, 255, 255, 0.9)
          )
        `,
      },
    },
  },
  plugins: [],
} satisfies Config;
