export interface WritingVar {
	configs: {
		join: string;
		inputs: string[];
	};
	pretty: {
		joinWith(char: string): void;
	};
	push: (...str: [...string[], string | { join?: string }]) => void;
}

export type WriteFn<P> = (param: P) => void;

export type AsyncWriteFn<P> = (param: P) => Promise<void>;

export type GenericWriteFn<P> = AsyncWriteFn<P> | WriteFn<P>;

/**
 * Deep merges source keys into a target object.
 * Objects are merged recursively; primitives and arrays are replaced.
 */
function deepMerge<
	T extends Record<string, any>,
	U extends Record<string, any>,
>(target: T, source: U): T & U {
	for (const key in source) {
		const srcVal = source[key];
		const tgtVal = (target as any)[key];

		if (
			srcVal &&
			typeof srcVal === 'object' &&
			!Array.isArray(srcVal) &&
			typeof tgtVal === 'object' &&
			!Array.isArray(tgtVal)
		) {
			deepMerge(tgtVal, srcVal);
		} else {
			(target as any)[key] = srcVal;
		}
	}
	return target as T & U;
}

/**
 * Creates an isolated writing environment.
 * Optionally merges extra configuration or contextual properties deeply.
 *
 * @example
 * const w = createWritingVar({
 *   configs: { join: " " },
 *   pretty: { hr: "—" },
 *   theme: "dark"
 * });
 */
export function createWritingVar<
	U extends Record<string, unknown> | undefined = undefined,
>(param?: U): U extends undefined ? WritingVar : WritingVar & U {
	const configs = {
		join: '\n',
		inputs: [] as string[],
	};

	const push = (...str: [...string[], string | { join?: string }]): void => {
		let joinString = '';
		const last = str.at(-1);
		if (typeof last === 'object' && !(last instanceof String)) {
			joinString = last.join ?? '';
			str.pop();
		}
		configs.inputs.push(str.join(joinString));
	};

	const pretty = {
		joinWith(char: string) {
			configs.join = char;
		},
	};

	// Base writing context
	const base: WritingVar = { configs, pretty, push };

	// ✅ Deep merge user-provided extensions into the context
	if (param && typeof param === 'object') {
		deepMerge(base, param);
	}

	return base as any;
}

export function joinWithConstrain({ inputs, join }: WritingVar['configs']) {
	return inputs.join(join);
}
