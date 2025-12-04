import { readSplit, show, sumBy } from './util.ts';

const parse = (x: string) => Array.from(x).map((ch) => Number(ch));

const input = (await readSplit(3, '\n', false)).map(parse);

const joltage = (n: number) => (bank: readonly number[]) => {
  let result = 0;
  let miniBank = bank;
  for (let i = n - 1; i >= 0; --i) {
    let d = -Infinity;
    let idx: number | undefined;
    for (let j = 0; j < miniBank.length - i; j++) {
      if (miniBank[j] > d) {
        d = miniBank[j];
        idx = j;
      }
    }
    if (typeof idx !== 'number') {
      throw new Error(`${d} ${miniBank}`);
    }
    result = 10 * result + d;
    miniBank = miniBank.toSpliced(0, idx + 1);
  }
  return result;
};

await show(sumBy(input, joltage(2)));

await show(sumBy(input, joltage(12)));
