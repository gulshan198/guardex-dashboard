import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        red: {
          DEFAULT: "hsl(350, 84%, 54%)",
          50: "hsl(350, 84%, 95%)",
          100: "hsl(350, 84%, 85%)",
          200: "hsl(350, 84%, 75%)",
          300: "hsl(350, 84%, 65%)",
          400: "hsl(350, 84%, 54%)",
          500: "hsl(350, 84%, 44%)",
          600: "hsl(350, 84%, 34%)",
          700: "hsl(350, 84%, 24%)",
          800: "hsl(350, 84%, 14%)",
          900: "hsl(350, 84%, 4%)",
          950: "hsl(350, 84%, 2%)",
        },
        
        black: {
          DEFAULT: "hsl(0, 0%, 0%)",
          50: "hsl(0, 0%, 95%)",
          100: "hsl(0, 0%, 90%)",
          200: "hsl(0, 0%, 80%)",
          300: "hsl(0, 0%, 70%)",
          400: "hsl(0, 0%, 60%)",
          500: "hsl(0, 0%, 50%)",
          600: "hsl(0, 0%, 40%)",
          700: "hsl(0, 0%, 30%)",
          800: "hsl(0, 0%, 20%)",
          900: "hsl(0, 0%, 10%)",
          950: "hsl(0, 0%, 5%)",
        },
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        guardai: {
          red: {
            DEFAULT: "#ea384c",
            50: "#ffe5eb",
            100: "#ffb3c6",
            200: "#ff809e",
            300: "#ff4d75",
            400: "#ea384c",
            500: "#c52239",
            600: "#a01030",
            700: "#7a0c27",
            800: "#55061e",
            900: "#300215",
            950: "#1a0108"
          },
          black: {
            DEFAULT: "#000000",
            50: "#e6e6e6",
            100: "#cccccc",
            200: "#b3b3b3",
            300: "#999999",
            400: "#808080",
            500: "#666666",
            600: "#4d4d4d",
            700: "#333333",
            800: "#1a1a1a",
            900: "#000000"
          },
          lightgray: {
            DEFAULT: "#f3f3f3",
            50: "#fafafa",
            100: "#f5f5f5",
            200: "#eeeeee",
            300: "#e0e0e0",
            400: "#d3d3d3",
            500: "#c8c8c8",
            600: "#a0a0a0",
            700: "#808080",
            800: "#606060",
            900: "#404040"
          },
          darkgray: {
            DEFAULT: "#333333",
            50: "#f9f9f9",
            100: "#f0f0f0",
            200: "#e0e0e0",
            300: "#d0d0d0",
            400: "#b0b0b0",
            500: "#808080",
            600: "#606060",
            700: "#404040",
            800: "#303030",
            900: "#1a1a1a"
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shine': 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1))',
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(234, 56, 76, 0.5)',
        'glow-black': '0 0 20px rgba(0, 0, 0, 0.3)',
        'inner-glow': 'inset 0 0 10px rgba(255, 255, 255, 0.2)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
