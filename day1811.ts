import { mapChars, readSplit, show, sumBy } from './util.ts';

const target = /Οδυ[σς][σς]ε(?:υ[σς]|ω[σς]|ι|α|υ)/;

const uppercase = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ';
const lowercase = 'αβγδεζηθικλμνξοπρστυφχψω';

const map = new Map<string, string>();
for (const alphabet of [uppercase, lowercase]) {
  Array.prototype.forEach.call(alphabet, (value, i) => {
    map.set(value, alphabet[i === alphabet.length - 1 ? 0 : i + 1]);
  });
}
map.set('ς', 'τ');

const input = await readSplit(1811, '\n', false);

const shift = (s: string) => mapChars(s, (ch) => map.get(ch) ?? ch);
const MAX_SHIFTS = uppercase.length - 1;

const value = (s: string) => {
  let trial = s;
  for (let i = 0; i < MAX_SHIFTS; i++) {
    if (target.test(trial)) {
      return i;
    }
    trial = shift(trial);
  }
  return 0;
};

await show(sumBy(input, value));
