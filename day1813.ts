import { range, readSplit, show, sumBy } from './util.ts';

const parse = (x: string) => {
  const result = new Uint8Array(x.length / 2);
  for (const s of range(0, x.length, 2)) {
    result[s / 2] = Number.parseInt(x.substring(s, s + 2), 16);
  }
  return result;
};

const [part1, part2] = await readSplit(1813, '\n\n', false);

const bufs = part1.split('\n').map(parse);
const patterns = part2.split('\n').map((s) =>
  new RegExp('^' + s.trim() + '$', 'u')
);

const u16bedec = new TextDecoder('utf-16be');
const u16ledec = new TextDecoder('utf-16le');
const u8dec = new TextDecoder('utf-8', { fatal: true });
const l1dec = new TextDecoder('iso-8859-1');

const decode = (b: Uint8Array) => {
  if (b[0] === 0x00 || (b[0] === 0xfe && b[1] === 0xff)) {
    return u16bedec.decode(b);
  } else if (b[1] === 0x00 || (b[0] === 0xff && b[1] === 0xfe)) {
    return u16ledec.decode(b);
  }
  try {
    return u8dec.decode(b);
  } catch (_) {
    return l1dec.decode(b);
  }
};

const strings = bufs.map(decode);

const findMatch = (r: RegExp) => {
  const idx = strings.findIndex((s) => r.test(s));
  if (idx < 0) {
    throw new Error(r.toString());
  } else {
    return idx + 1;
  }
};

await show(sumBy(patterns, findMatch));
