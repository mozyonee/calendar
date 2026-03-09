import type { NextConfig } from 'next';
import path from 'path';

type OutputMode = 'standalone' | 'export' | undefined;
const outputMode = (process.env.NEXT_OUTPUT as OutputMode) ?? 'standalone';

const nextConfig: NextConfig = {
	output: outputMode,
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
