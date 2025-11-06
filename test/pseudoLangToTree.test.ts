import { describe, expect, it } from 'vitest';
import { pseudoLangToTree } from '../src/lib/lang/pseudoParser';

describe('pseudoLangToTree', () => {
	it('should parse plain text without any tags', () => {
		const input = 'Hello world!';
		const result = pseudoLangToTree(input);
		expect(result).toEqual([{ type: 'text', content: 'Hello world!' }]);
	});

	it('should parse text with a single styled tag', () => {
		const input = 'Hello [mtxt-style[[red]]]world[[/mtxt-style]]!';
		const result = pseudoLangToTree(input);
		expect(result).toEqual([
			{ type: 'text', content: 'Hello ' },
			{
				type: 'styled',
				style: 'red',
				children: [{ type: 'text', content: 'world' }],
			},
			{ type: 'text', content: '!' },
		]);
	});

	it('should parse nested styled tags', () => {
		const input =
			'[mtxt-style[[red]]][mtxt-style[[bold]]]Hello[[/mtxt-style]] world[[/mtxt-style]]!';
		const result = pseudoLangToTree(input);
		expect(result).toEqual([
			{
				type: 'styled',
				style: 'red',
				children: [
					{
						type: 'styled',
						style: 'bold',
						children: [{ type: 'text', content: 'Hello' }],
					},
					{ type: 'text', content: ' world' },
				],
			},
			{ type: 'text', content: '!' },
		]);
	});

	it('should handle multiple styled tags at the same level', () => {
		const input =
			'[mtxt-style[[red]]]Hello[[/mtxt-style]] [mtxt-style[[blue]]]world[[/mtxt-style]]!';
		const result = pseudoLangToTree(input);
		expect(result).toEqual([
			{
				type: 'styled',
				style: 'red',
				children: [{ type: 'text', content: 'Hello' }],
			},
			{ type: 'text', content: ' ' },
			{
				type: 'styled',
				style: 'blue',
				children: [{ type: 'text', content: 'world' }],
			},
			{ type: 'text', content: '!' },
		]);
	});

	it('should handle empty input', () => {
		const input = '';
		const result = pseudoLangToTree(input);
		expect(result).toEqual([]);
	});

	it('should handle input with only tags and no content', () => {
		const input = '[mtxt-style[[red]]][[/mtxt-style]]';
		const result = pseudoLangToTree(input);
		expect(result).toEqual([
			{
				type: 'styled',
				style: 'red',
				children: [],
			},
		]);
	});
});
