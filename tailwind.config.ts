import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    // Background colors
    'bg-white', 'bg-gray-50', 'bg-gray-100', 'bg-blue-50', 'bg-blue-600', 
    'bg-green-50', 'bg-green-600', 'bg-purple-50', 'bg-purple-600',
    'bg-red-50', 'bg-red-600', 'bg-yellow-50', 'bg-yellow-600',
    'bg-indigo-50', 'bg-indigo-600',
    // Text colors
    'text-gray-900', 'text-gray-700', 'text-gray-600', 'text-white',
    'text-blue-600', 'text-blue-800', 'text-green-600', 'text-green-800',
    'text-purple-600', 'text-red-600',
    // Font sizes
    'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
    'text-4xl', 'text-5xl', 'text-6xl', 'text-4xl lg:text-6xl',
    // Padding
    'py-4', 'py-8', 'py-12', 'py-16', 'py-20', 'py-24', 'py-32',
    'py-20 lg:py-32',
    // Gradient classes (for fallback)
    'from-blue-50', 'to-indigo-100', 'from-green-50', 'to-emerald-100',
    'from-purple-50', 'to-pink-100', 'from-orange-50', 'to-red-100',
    'from-indigo-50', 'to-purple-100', 'from-green-50', 'to-teal-100',
    'from-blue-50', 'to-cyan-100', 'bg-gradient-to-r'
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
