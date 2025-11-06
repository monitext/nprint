import monokai from './styles/monokai';
import githubDark from './styles/github-dark';
import vs from './styles/vs';
import far from './styles/far';
import { CodeScheme } from './types';

export const ThemeRegistry = {
	vs,
	far,
	monokai,
	githubDark,
} satisfies { [k: string]: CodeScheme };

export type Theme = keyof typeof ThemeRegistry;
