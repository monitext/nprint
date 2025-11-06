import { describe, expect, it } from 'vitest';
import {
	matchClosingTag,
	matchOpeningTag,
	splitByPseudoColorLangTags,
	writePseudoColorLang,
} from '../src/lib/lang/pseudoLang';

describe('splitByPseudoColorLangTags', () => {
	it('should split text into segments based on pseudo-language tags', () => {
		const input = 'Hello [mtxt-style[[bold]]], world! [[/mtxt-style]]';
		const result = splitByPseudoColorLangTags(input);
		expect(result).toEqual([
			'Hello ',
			'[mtxt-style[[bold]]]',
			', world! ',
			'[[/mtxt-style]]',
		]);
	});

	it('should return the original text if no tags are present', () => {
		const input = 'Hello, world!';
		const result = splitByPseudoColorLangTags(input);
		expect(result).toEqual(['Hello, world!']);
	});

	it('should handle text with multiple tags correctly', () => {
		const input =
			'[mtxt-style[[red]]]Hello[[/mtxt-style]] [mtxt-style[[bold]]]World[[/mtxt-style]]';
		const result = splitByPseudoColorLangTags(input);
		expect(result).toEqual([
			'[mtxt-style[[red]]]',
			'Hello',
			'[[/mtxt-style]]',
			' ',
			'[mtxt-style[[bold]]]',
			'World',
			'[[/mtxt-style]]',
		]);
	});
});

describe('matchOpeningTag', () => {
	it('should extract the style from an opening tag', () => {
		const input = '[mtxt-style[[red bold]]]';
		const result = matchOpeningTag(input);
		expect(result).toBe('red bold');
	});

	it('should return null if the input is not an opening tag', () => {
		const input = 'Hello, world!';
		const result = matchOpeningTag(input);
		expect(result).toBeNull();
	});
});

describe('matchClosingTag', () => {
	it('should return true if the text contains a closing tag', () => {
		const input = 'This is some text [[/mtxt-style]]';
		const result = matchClosingTag(input);
		expect(result).toBe(true);
	});

	it('should return false if the text does not contain a closing tag', () => {
		const input = 'This is some text';
		const result = matchClosingTag(input);
		expect(result).toBe(false);
	});
});

describe('writePseudoColorLang', () => {
	it('should wrap text with the specified styles', () => {
		const styles = ['red', 'bold'];
		const text = 'Hello, World!';
		const result = writePseudoColorLang(styles, text);
		expect(result).toBe(
			'[mtxt-style[[bold]]][mtxt-style[[red]]]Hello, World![[/mtxt-style]][[/mtxt-style]]',
		);
	});

	it('should handle an empty styles array', () => {
		const styles: string[] = [];
		const text = 'Hello, World!';
		const result = writePseudoColorLang(styles, text);
		expect(result).toBe('Hello, World!');
	});
});
