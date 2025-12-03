// deno-lint-ignore-file no-explicit-any

export type Pair<T, U = T> = [T, U];

export const identity = <T>(x: T): T => x;

export function sumBy(array: ArrayLike<number> | ArrayLike<boolean>): number;

export function sumBy<T>(
  array: ArrayLike<T>,
  validator: (elt: T, index: number) => number | boolean,
): number;

export function sumBy<T>(
  array: ArrayLike<T>,
  validator: (elt: any, index: number) => number | boolean = identity,
): number {
  return Array.prototype.reduce.call(
    array,
    (accum: unknown, element: T, index: number) =>
      (accum as number) + (validator(element, index) as number),
    0,
  ) as number;
}

export function productBy(array: readonly number[]): number;

export function productBy<T>(
  array: readonly T[],
  validator: (elt: T, index: number) => number,
): number;

export function productBy<T>(
  array: readonly T[],
  validator: (elt: any, index: number) => number = identity,
): number {
  return array.reduce(
    (accum, element, index) => accum * validator(element, index),
    1,
  );
}

export const inputFilename = (day: number, t: boolean) =>
  `input${day < 10 ? '0' : ''}${day}${t ? 't' : ''}`;

export const readSplit = (
  day: number,
  separator = '\n',
  t = false,
): Promise<string[]> =>
  Deno.readTextFile(inputFilename(day, t)).then((str) =>
    str.trim().split(separator)
  );

export const setIntersect = <T>(
  ...sets: Set<T>[]
): Set<T> => {
  if (sets.length === 0) {
    return new Set<T>();
  } else {
    return sets.reduce((accum, a) => accum.intersection(a));
  }
};

export const mapChars = (
  str: string,
  op: (ch: string, index: number) => string,
) => {
  const arr = new Array(str.length);
  for (let i = 0; i < str.length; ++i) {
    arr[i] = op(str[i], i);
  }
  return arr.join('');
};

export const addVectors = (
  vector: readonly number[] = [],
  ...vectors: readonly number[][]
): number[] => vector.map((x, i) => vectors.reduce((a, v) => a + v[i], x));

export const scaleCoord = (p: Coord, factor: number): Coord =>
  p.map((x) => x * factor) as Coord;

export function* range(start: number, end: number, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

export type Coord = [number, number];

export const neighbors = (
  [x, y]: Coord,
  includeDiagonals = false,
  includeSelf = false,
): Coord[] => {
  const result: Coord[] = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ];
  if (includeDiagonals) {
    result.push([x - 1, y - 1], [x - 1, y + 1], [x + 1, y - 1], [x + 1, y + 1]);
  }
  if (includeSelf) {
    result.push([x, y]);
  }
  return result;
};

export const show = async (data: string | number | bigint) => {
  console.log(data);
  const child = new Deno.Command('wl-copy', {
    stdin: 'piped',
    stdout: 'inherit',
    stderr: 'inherit',
  }).spawn();
  const encoder = new TextEncoderStream();
  const pipe = encoder.readable.pipeTo(child.stdin);
  const writer = encoder.writable.getWriter();
  await writer.write(data.toString());
  await writer.close();
  await pipe;
  const status = await child.status;
  if (!status.success) {
    throw new Error('wl-copy failed');
  }
};

const digits = /-?\d+/g;
const posDigits = /\d+/g;

export const getNums = (target: string, onlyPositive = true): number[] =>
  target
    .match(onlyPositive ? posDigits : digits)
    ?.map((n) => parseInt(n, 10)) ?? [];

export const getBigNums = (target: string): bigint[] =>
  target
    .match(digits)
    ?.map((n) => BigInt(n)) ?? [];

export const forEach2D = <T>(
  arr: T[][],
  fn: ([x, y]: Coord, val: T) => void,
) => {
  for (let x = 0; x < arr.length; ++x) {
    for (let y = 0; y < arr[x].length; ++y) {
      fn([x, y], arr[x][y]);
    }
  }
};

export const map2D = <T, R>(
  arr: T[][],
  fn: ([x, y]: Coord, val: T) => R,
): R[][] => arr.map((row, x) => row.map((elt, y) => fn([x, y], elt)));

export const inBounds = (arr: any[][], [x, y]: Coord): boolean =>
  x >= 0 && y >= 0 && x < arr.length && y < arr[x].length;

export const find2D = <T>(arr: T[][], target: T): Coord => {
  for (let i = 0; i < arr.length; ++i) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] === target) {
        return [i, j];
      }
    }
  }
  throw new Error('not found');
};

export const zipWith = <T1, T2, R>(
  arr1: readonly T1[],
  arr2: readonly T2[],
  fn: (arg1: T1, arg2: T2) => R,
): R[] => arr1.map((e1, idx) => fn(e1, arr2[idx]));

export const zip = <T1, T2>(
  arr1: readonly T1[],
  arr2: readonly T2[],
): [T1, T2][] => zipWith(arr1, arr2, (a, b) => [a, b]);

export const gcd = (x: number, y: number): number => {
  if (
    (!Number.isSafeInteger(x) && !Number.isSafeInteger(y)) ||
    x < 0 ||
    y < 0
  ) {
    throw new Error('invalid input');
  }
  let a: number, b: number;
  if (x > y) {
    a = x;
    b = y;
  } else {
    b = x;
    a = y;
  }
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
};

export const gcdBig = (x: bigint, y: bigint): bigint => {
  if (x < 0n || y < 0n) {
    throw new Error('invalid input');
  }
  let a: bigint, b: bigint;
  if (x > y) {
    a = x;
    b = y;
  } else {
    b = x;
    a = y;
  }
  while (b !== 0n) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
};

export const gcdMany = (...ns: readonly number[]) => ns.reduce(gcd);

export const lcm = (...ns: readonly number[]) =>
  ns.reduce((a, b) => (a / gcd(a, b)) * b, 1);

export const lcmBig = (...ns: readonly bigint[]) =>
  ns.reduce((a, b) => (a / gcdBig(a, b)) * b, 1n);

export const mod = (n: number, d: number): number => ((n % d) + d) % d;
