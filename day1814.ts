import { productBy, readSplit, show, sumBy } from './util.ts';

const parse = (x: string) => x.split(' × ');

const input = (await readSplit(1814, '\n', false)).map(parse);

const digits = {
  '一': 1,
  '二': 2,
  '三': 3,
  '四': 4,
  '五': 5,
  '六': 6,
  '七': 7,
  '八': 8,
  '九': 9,
};
const tens = {
  '十': 10,
  '百': 100,
  '千': 1000,
};
const myriads = {
  '億': 10_000 * 10_000,
  '万': 10_000,
};
const units = {
  '尺': 1,
  '間': 6,
  '丈': 10,
  '町': 360,
  '里': 12960,
  '毛': 1 / 10_000,
  '厘': 1 / 1000,
  '分': 1 / 100,
  '寸': 1 / 10,
};

function isK<K extends object>(k: K, v: PropertyKey): v is keyof K {
  return Object.hasOwn(k, v);
}

const parseMyr = (s: string): number => {
  const chars = Array.from(s);
  let digit = 0;
  let sum = 0;

  while (chars.length > 0) {
    const ch = chars.shift()!;
    if (isK(digits, ch)) {
      digit = digits[ch];
    } else if (isK(tens, ch)) {
      sum += (digit || 1) * tens[ch];
      digit = 0;
    }
  }

  sum += digit;

  return sum;
};

const parseNumber = (s: string): number => {
  let remainder = s;
  let sum = 0;
  for (const [k, v] of Object.entries(myriads)) {
    const idx = remainder.indexOf(k);
    if (idx >= 0) {
      const thisMyr = remainder.substring(0, idx);
      sum += v * parseMyr(thisMyr);
      remainder = remainder.substring(idx + 1);
    }
  }
  if (remainder.length > 0) {
    sum += parseMyr(remainder);
  }
  return sum;
};

const parseLength = (s: string): number => {
  const unit = s[s.length - 1];
  if (!isK(units, unit)) {
    throw new Error(unit);
  }
  const base = parseNumber(s.substring(0, s.length - 1));

  return base * units[unit] * (10 / 33);
};

const area = (r: readonly string[]) => productBy(r, parseLength);

await show(sumBy(input, area));
