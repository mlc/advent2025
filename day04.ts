import { map2D, neighbors, readSplit, show, sumBy } from './util.ts';
import { showGrids } from './vis.ts';

const parse = (x: string) => Array.from(x);

const input = (await readSplit(4, '\n', false)).map(parse);

const removables = (arr: string[][]) =>
  map2D(
    arr,
    (pos, c) =>
      c === '@' &&
      sumBy(neighbors(pos, true), ([x, y]) => arr[x]?.[y] === '@') < 4,
  );

await show(sumBy(removables(input).map((r) => sumBy(r))));

let total = 0;
let mutated = input;
const frames: boolean[][][] = [];
while (true) {
  frames.push(map2D(mutated, (_, c) => c === '@'));
  const rm = removables(mutated);
  const thisR = sumBy(rm.map((r) => sumBy(r)));
  total += thisR;
  if (thisR === 0) {
    break;
  }
  mutated = map2D(mutated, ([x, y], orig) => rm[x][y] ? '.' : orig);
}

await showGrids(frames, { filename: 'day04.gif' });
await show(total);
