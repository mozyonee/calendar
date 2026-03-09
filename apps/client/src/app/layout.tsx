import { globalStyles } from '@/lib/stitches';
import { ReduxProvider } from '@/store/provider';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Calendar',
	description: 'Calendar application',
};

globalStyles();

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<ReduxProvider>{children}</ReduxProvider>
			</body>
		</html>
	);
}
