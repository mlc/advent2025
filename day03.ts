import { range, readSplit, show, sumBy } from './util.ts';

const parse = (x: string) => Array.from(x).map((ch) => Number(ch));

const input = (await readSplit(3, '\n', false)).map(parse);

const joltage = (bank: readonly number[]): number => {
  const d1 = Math.max(...bank.toSpliced(bank.length - 1));
  const i1 = bank.indexOf(d1);
  if (i1 < 0) {
    throw new Error();
  }
  const d2 = Math.max(...bank.toSpliced(0, i1 + 1));
  return d1 * 10 + d2;
};

await show(sumBy(input, joltage));

const highJoltage = (bank: readonly number[]) => {
  let result = 0;
  let miniBank = bank;
  for (let i = 11; i >= 0; --i) {
    const d = Math.max(...miniBank.toSpliced(miniBank.length - i));
    const idx = miniBank.indexOf(d);
    if (idx < 0) {
      throw new Error(`${d} ${miniBank}`);
    }
    result = 10 * result + d;
    miniBank = miniBank.toSpliced(0, idx + 1);
  }
  return result;
};

await show(sumBy(input, highJoltage));
