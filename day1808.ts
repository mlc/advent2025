import { readSplit, show, sumBy } from './util.ts';
import { MultiSet } from 'mnemonist';

const input = await readSplit(1808, '\n', false);

const digit = /[0-9]/v;
const vowel = /[aeiou]/i;
const consonent = /[b-df-hj-np-tv-z]/i;
const asciiLetter = /^[a-z]$/;

const isValid = (p: string) => {
  if (p.length < 4 || p.length > 12) {
    return false;
  }
  const decomposed = p.normalize('NFD');
  if (![digit, vowel, consonent].every((r) => r.test(decomposed))) {
    return false;
  }
  const counts = MultiSet.from(
    Array.from(decomposed).map((ch) => ch.toLowerCase()).filter((ch) =>
      asciiLetter.test(ch)
    ),
  );
  return counts.top(1)[0][1] === 1;
};

await show(sumBy(input, isValid));
