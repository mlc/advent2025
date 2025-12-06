import { productBy, range, readSplit, show, sumBy } from './util.ts';

const parse = (x: string) => x.split(/\s+/);

const input = (await readSplit(6, '\n', false)).map(parse);

const colOp = (colIdx: number) => {
  const col = input.map((row) => row[colIdx]);
  const op = col.pop();
  const ns = col.map((x) => Number(x));
  return op === '+' ? sumBy(ns) : productBy(ns);
};

await show(sumBy([...range(0, input[0].length)], colOp));

const input2 = await readSplit(6, '\n', false);
const separators = [...range(0, input2[0].length)].filter((i) =>
  input2.every((row) => row[i] === ' ')
);
const fenceposts = [-1, ...separators, input2[0].length];
const pieces: string[][] = [];
for (let i = 0; i < (fenceposts.length - 1); i++) {
  pieces.push(
    input2.map((row) => row.substring(fenceposts[i] + 1, fenceposts[i + 1])),
  );
}
const pieceVals = (p: string[]) => {
  const q = [...p];
  const op = q.pop()!.trim() === '+' ? sumBy : productBy;
  const ns = [...range(0, q[0].length)].map((i) =>
    Number(q.map((r) => r[i]).join('').trim())
  );
  return op(ns);
};
await show(sumBy(pieces, pieceVals));
