import { readSplit, show, sumBy } from './util.ts';

const parse = (x: string) => {
  const sign = x[0] === 'L' ? -1 : 1;
  return Number(x.substring(1)) * sign;
};

const input = (await readSplit(1, '\n', false)).map(parse);

const positions = input.reduce<number[]>(
  (acc, n) => [...acc, (10000 + acc.at(-1)! + n) % 100],
  [50],
);

await show(sumBy(positions, (n) => n === 0));

let n = 50;
let result = 0;
for (const dist of input) {
  const lastN = n;
  let didIt = false;
  n += dist;
  while (n > 100) {
    result += 1;
    n -= 100;
  }
  while (n < 0) {
    result += (lastN === 0 && !didIt) ? 0 : 1;
    n += 100;
    didIt = true;
  }
  if (n === 100) {
    n = 0;
    result += 1;
  } else if (n === 0) {
    result += 1;
  }
  //console.log({dist,n,result})
}

await show(result);
