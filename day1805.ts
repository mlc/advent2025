import { inputFilename, show, sumBy } from './util.ts';

const input = await Deno.readTextFile(inputFilename(1805, false)).then((str) =>
  str.split('\n').map((x: string) => Array.from(x))
);

if (input.pop()!.length !== 0) {
  throw new Error('whatever');
}

if (input.some((r) => r.length !== input[0].length)) {
  throw new Error('parse error');
}

await show(sumBy(input, (r, i) => r[i * 2 % r.length] === '💩'));
