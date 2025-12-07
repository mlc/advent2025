import { readSplit, show } from './util.ts';
import { MultiSet } from 'mnemonist';

const parse = (x: string) => Array.from(x);

const input = (await readSplit(7, '\n', false)).map(parse);

const beamSplit = () => {
  let beams = new Set<number>([input[0].indexOf('S')]);
  let splits = 0;
  for (let i = 1; i < input.length; i++) {
    //const splitters = new Set[...range(0,input[i].length)].filter(j => input[i][j] === '|');
    splits += [...beams].filter((b) => input[i][b] === '^').length;
    beams = new Set<number>(
      [...beams].flatMap((b) => input[i][b] === '^' ? [b - 1, b + 1] : [b]),
    );
  }
  return splits;
};

await show(beamSplit());

const beamSplitMulti = () => {
  let beams = MultiSet.from<number>([input[0].indexOf('S')]);
  let timelines = 1;
  for (let i = 1; i < input.length; i++) {
    //const splitters = new Set[...range(0,input[i].length)].filter(j => input[i][j] === '|');
    const nextBeams = new MultiSet<number>();
    beams.forEachMultiplicity((count, b) => {
      if (input[i][b] === '^') {
        nextBeams.add(b - 1, count);
        nextBeams.add(b + 1, count);
        timelines += count;
      } else {
        nextBeams.add(b, count);
      }
    });
    beams = nextBeams;
  }
  return timelines;
};

await show(beamSplitMulti());
