import { ZonedDateTime } from '@js-joda/core';
import { readSplit, show } from './util.ts';
import { MultiSet } from 'mnemonist';

const parse = (x: string) => ZonedDateTime.parse(x).toInstant().toString();

const input = (await readSplit(1802, '\n', false)).map(parse);

const counts = MultiSet.from(input);
const [[result, n]] = counts.top(1);
if (n !== 4) {
  throw new Error('unexpected count');
}
await show(result.replace(/Z$/, '+00:00'));
