import { createStitches } from '@stitches/react';

export const { styled, css, globalCss, keyframes, theme, createTheme, getCssText } = createStitches({
	media: {
		sm: '(max-width: 640px)',
	},
	theme: {
		colors: {
			white: '#ffffff',
			black: '#000000',
			gray50: '#f9fafb',
			gray100: '#f3f4f6',
			gray200: '#e5e7eb',
			gray300: '#d1d5db',
			gray400: '#9ca3af',
			gray500: '#6b7280',
			gray600: '#4b5563',
			gray700: '#374151',
			gray800: '#1f2937',
			gray900: '#111827',
			green400: '#34d399',
			sky400: '#38bdf8',
			amber400: '#fbbf24',
			rose400: '#fb7185',
			purple400: '#a78bfa',
			emerald50: '#ecfdf5',
			emerald700: '#047857',
			accent50: 'var(--color-accent-50)',
			accent100: 'var(--color-accent-100)',
			accent200: 'var(--color-accent-200)',
			accent400: 'var(--color-accent-400)',
			accent500: 'var(--color-accent-500)',
			accent600: 'var(--color-accent-600)',
		},
		space: {
			1: '0.25rem',
			1_5: '0.375rem',
			2: '0.5rem',
			3: '0.75rem',
			4: '1rem',
			6: '1.5rem',
			8: '2rem',
		},
		sizes: {
			full: '100%',
			screen: '100vh',
		},
		radii: {
			sm: '0.375rem',
			md: '0.5rem',
			lg: '0.75rem',
			full: '9999px',
		},
		fontSizes: {
			xs: '0.75rem',
			sm: '0.875rem',
			base: '1rem',
			lg: '1.125rem',
		},
		fontWeights: {
			medium: '500',
			semibold: '600',
			bold: '700',
		},
	},
});

export const globalStyles = globalCss({
	':root': {
		'--color-accent-50': 'var(--color-accent-50)',
		'--color-accent-100': 'var(--color-accent-100)',
		'--color-accent-200': 'var(--color-accent-200)',
		'--color-accent-400': 'var(--color-accent-400)',
		'--color-accent-500': 'var(--color-accent-500)',
		'--color-accent-600': 'var(--color-accent-600)',
	},
	'html, body': {
		height: '100%',
		margin: 0,
		padding: 0,
		fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
	},
	'*, *::before, *::after': {
		boxSizing: 'border-box',
	},
});
