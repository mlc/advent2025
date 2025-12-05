import { Pair, readSplit, show, sumBy } from './util.ts';

const [rangesT, itemsT] = (await readSplit(5, '\n\n', false)).map((section) =>
  section.split('\n')
);

const ranges = rangesT.map((s) => s.split('-').map(BigInt) as Pair<bigint>);
const items = itemsT.map(BigInt);

const isFresh = (n: bigint) => ranges.some(([a, b]) => n >= a && n <= b);

await show(sumBy(items, isFresh));

const total = () => {
  const r = ranges.toSorted(([a1, b1], [a2, b2]) =>
    Number(a1 - a2) || Number(b1 - b2)
  );
  let result = 0n;
  let [cura, curb] = r.shift()!;
  for (const [a, b] of r) {
    if (a > curb) {
      result += (curb - cura) + 1n;
      cura = a;
      curb = b;
    } else if (b > curb) {
      curb = b;
    }
  }
  result += (curb - cura) + 1n;
  return result;
};

await show(total());
