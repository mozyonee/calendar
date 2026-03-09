import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
	output: 'standalone',
	outputFileTracingRoot: path.join(__dirname, '../../'),
	images: {
		remotePatterns: [
			{ hostname: 'localhost' },
			...(process.env.NEXT_PUBLIC_SERVER_URL
				? [{ hostname: new URL(process.env.NEXT_PUBLIC_SERVER_URL).hostname }]
				: []),
		],
	},
};

export default nextConfig;
