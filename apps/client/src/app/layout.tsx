import StitchesRegistry from '@/lib/StitchesRegistry';
import { ReduxProvider } from '@/store/provider';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Calendar',
	description: 'Calendar application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<StitchesRegistry>
					<ReduxProvider>{children}</ReduxProvider>
				</StitchesRegistry>
			</body>
		</html>
	);
}
