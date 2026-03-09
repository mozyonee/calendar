import type { Metadata } from 'next';
import { ReduxProvider } from '@/store/provider';
import './globals.css';

export const metadata: Metadata = {
	title: 'Calendar',
	description: 'Calendar application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<ReduxProvider>{children}</ReduxProvider>
			</body>
		</html>
	);
}
