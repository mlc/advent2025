import { readSplit, show, sumBy } from './util.ts';

declare global {
  interface Array<T> {
    max(): number;
  }
}

Array.prototype.max = function max() {
  return this.reduce((acc, x) => acc > x ? acc : x, -Infinity);
};

const parse = (x: string) => Array.from(x).map((ch) => Number(ch));

const input = (await readSplit(3, '\n', false)).map(parse);

const joltage = (n: number) => (bank: readonly number[]) => {
  let result = 0;
  let miniBank = bank;
  for (let i = n - 1; i >= 0; --i) {
    const d = miniBank.toSpliced(miniBank.length - i).max();
    const idx = miniBank.indexOf(d);
    if (idx < 0) {
      throw new Error(`${d} ${miniBank}`);
    }
    result = 10 * result + d;
    miniBank = miniBank.toSpliced(0, idx + 1);
  }
  return result;
};

await show(sumBy(input, joltage(2)));

await show(sumBy(input, joltage(12)));
