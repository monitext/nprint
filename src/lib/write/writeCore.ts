import {
	AsyncWriteFn,
	createWritingVar,
	GenericWriteFn,
	joinWithConstrain,
	WriteFn,
	WritingVar,
} from './writeHelpers';

type WritingParams = Omit<WritingVar, 'configs'>;

export function writeCore<T extends GenericWriteFn<WritingParams>>(
	fn: T,
): T extends AsyncWriteFn<WritingParams>
	? ReturnType<typeof writeCoreAsync>
	: ReturnType<typeof writeCoreSync> {
	const isAsync = fn.constructor.name === 'AsyncFunction';
	if (isAsync) {
		return writeCoreAsync(fn as AsyncWriteFn<WritingParams>) as any;
	} else {
		return writeCoreSync(fn as WriteFn<WritingParams>) as any;
	}
}

export function writeCoreSync(fn: WriteFn<WritingParams>) {
	const { configs, pretty, push } = createWritingVar();
	fn({ pretty, push });
	return joinWithConstrain({ ...configs });
}

export async function writeCoreAsync(fn: AsyncWriteFn<WritingParams>) {
	const { configs, pretty, push } = createWritingVar();
	await fn({ pretty, push });
	return joinWithConstrain({ ...configs });
}
