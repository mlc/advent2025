import { readSplit, show, sumBy } from './util.ts';

const input = await readSplit(1803, '\n', false);

const upper = /\p{Upper}/v;
const lower = /\p{Lower}/v;
const nonAscii = /[^\p{ASCII}]/v;
const digit = /[0-9]/v;

const isValid = (p: string) => {
  if (p.length < 4 || p.length > 12) {
    return false;
  }
  return [upper, lower, nonAscii, digit].every((r) => r.test(p));
};

await show(sumBy(input, isValid));
