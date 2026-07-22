/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', 'system-ui', 'sans-serif'],
  			display: ['Inter', 'system-ui', 'sans-serif'],
  			mono: ['JetBrains Mono', 'monospace']
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			'neon-cyan': '#00B8D9',
  			'hot-pink': '#FF59D6',
  			'vivid-lavender': '#C86BFF',
  			'retro-gold': '#FFE25A',
        'gold-shine': '#FFE25A',
  			'poster-purple': 'hsl(var(--background))',
        'bg-primary': 'hsl(var(--background))',
        'neon-purple': '#B026FF',
        'sunset-orange': '#FF6B35',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			ring: 'hsl(var(--ring))',
  			card: {
  				DEFAULT: 'hsl(var(--card-bg))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			}
  		},
      borderWidth: {
        '12': '12px',
        '16': '16px',
      },
  		keyframes: {
  			bloom: {
  				'0%, 100%': { filter: 'brightness(1) blur(0px)', opacity: '1' },
  				'50%': { filter: 'brightness(1.4) blur(1px)', opacity: '0.9' }
  			},
  			shimmer: {
  				'0%': { backgroundPosition: '-200% center' },
  				'100%': { backgroundPosition: '200% center' }
  			},
  			'vhs-jitter': {
  				'0%, 100%': { transform: 'translateY(0)' },
  				'10%, 90%': { transform: 'translateY(0)' },
  				'20%': { transform: 'translateY(-1px)' },
  				'50%': { transform: 'translateY(1px)' },
  				'80%': { transform: 'translateY(-0.5px)' }
  			}
  		},
  		animation: {
  			bloom: 'bloom 3s ease-in-out infinite',
  			shimmer: 'shimmer 6s linear infinite',
  			jitter: 'vhs-jitter 0.2s linear infinite',
  			'pulse-glow': 'bloom 2s ease-in-out infinite'
  		},
  		boxShadow: {
  			'extrude-purple': '4px 4px 0px rgba(122, 34, 168, 0.8), 8px 8px 0px rgba(90, 18, 111, 0.4)',
  			'extrude-pink': '4px 4px 0px rgba(255, 89, 214, 0.8), 8px 8px 0px rgba(200, 107, 255, 0.4)',
        'extrude-orange': '4px 4px 0px rgba(255, 107, 53, 0.8), 8px 8px 0px rgba(204, 85, 34, 0.4)',
        'extrude-gold': '4px 4px 0px rgba(204, 172, 0, 0.8), 8px 8px 0px rgba(153, 129, 0, 0.4)',
  			'neon-cyan': '0 0 15px rgba(0, 184, 217, 0.5)',
        'glow-soft': '0 0 10px rgba(0, 184, 217, 0.3)',
        'glow-intense': '0 0 20px rgba(255, 89, 214, 0.5)',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")]
}