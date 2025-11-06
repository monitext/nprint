export interface TextNode {
	type: 'text';
	content: string;
}

export interface HtmlNode {
	type: 'tag';
	attrs?: {
		class?: string;
	};
	voidElement: boolean;
	children?: (TextNode | HtmlNode)[];
}

export type Node = HtmlNode | TextNode;

export interface CodeScheme {
	name: string;
	styles: {
		[k: string]: ((...x: string[]) => string)[];
	};
}
