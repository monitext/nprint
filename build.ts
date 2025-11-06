import { Bundle, GenerateDts } from '@monitext-dev/builder';
import { dependencies } from './package.json';

Bundle({
	mode: 'file',
	targets: [
		{
			entry: './src/main.ts',
			outfile: './dist/lib-min.js',
			variant: ['cjs', 'esm'],
			options: {
				plateform: 'neutral',
				minify: true,
				minifySyntax: true,
				minifyWhitespace: true,
				eternal: [...Object.keys(dependencies)],
			},
			extraOpts: { mainFields: ['main'] },
		},
		{
			entry: './src/main.ts',
			outfile: './dist/lib-min-full.js',
			variant: ['cjs', 'esm'],
			options: {
				plateform: 'neutral',
				minify: true,
				minifySyntax: true,
				minifyWhitespace: true,
				eternal: [],
			},
			extraOpts: { mainFields: ['main'] },
		},
	],
});

GenerateDts({
	mode: 'file',
	entry: './src/main.ts',
	outfile: './dist/lib.ts',
	tsconfig: './tsconfig.build.json',
});
