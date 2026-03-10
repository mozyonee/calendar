'use client';

import React from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { getCssText, globalStyles } from './stitches';

export default function StitchesRegistry({ children }: { children: React.ReactNode }) {
	useServerInsertedHTML(() => {
		globalStyles();
		return <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />;
	});

	return <>{children}</>;
}
