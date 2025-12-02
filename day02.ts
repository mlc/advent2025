import { Pair, readSplit, show, sumBy } from './util.ts';

const parse = (x: string) => x.split('-').map(Number) as Pair<number>;

const input = (await readSplit(2, ',', false)).map(parse);

const leftHalf = (s: string, ceil = false) => {
  const f = ceil ? Math.ceil : Math.floor;
  return s.substring(0, f(s.length / 2));
};

const invalidCount = ([a, b]: Pair<number>) => {
  const lowerBound = Number(leftHalf(a.toString()));
  const upperBound = Number(leftHalf(b.toString(), true));
  let count = 0;
  for (let i = lowerBound; i <= upperBound; i++) {
    const candidate = Number(`${i}${i}`);
    if (candidate >= a && candidate <= b) {
      count += candidate;
    }
  }
  return count;
};

await show(sumBy(input, invalidCount));

const invalidCount2 = ([a, b]: Pair<number>) => {
  const upperBound = Number(leftHalf(b.toString(), true));
  let count = 0;
  const seen = new Set<number>();
  for (let i = 1; i <= upperBound; i++) {
    let str = `${i}${i}`;
    let candidate;
    while ((candidate = Number(str)) <= b) {
      if (candidate >= a && !seen.has(candidate)) {
        seen.add(candidate);
        count += candidate;
      }
      str += `${i}`;
    }
  }
  return count;
};

await show(sumBy(input, invalidCount2));
