/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1D4ED8',      // Azul Cobalto CTA
          primaryHover: '#1E40AF',
          primaryLight: '#EFF6FF',
          secondary: '#0037B0',    // Deep Cobalt Blue
          accent: '#16A34A',       // Verde Confiança Localiza
          accentLight: '#DCFCE7',
          price: '#DE2626',        // Vermelho Automotivo Webmotors
          priceLight: '#FEF2F2',
        },
        surface: {
          canvas: '#F8FAFC',
          card: '#FFFFFF',
          muted: '#F1F5F9',
          border: '#E2E8F0',
          borderHover: '#CBD5E1',
        },
        typography: {
          heading: '#0F172A',
          body: '#334155',
          muted: '#64748B',
          subtle: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        cardHover: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
        subtle: '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
      }
    },
  },
  plugins: [],
}
