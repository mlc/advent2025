import { productBy, readSplit, show, sumBy } from './util.ts';

interface Row {
  last: string;
  first: string;
  phone: number;
}

const parse = (x: string): Row => {
  const parts = x.split(/[,:] /);
  if (parts.length !== 3) {
    throw new Error(x);
  }
  return {
    last: parts[0],
    first: parts[1],
    phone: Number.parseInt(parts[2], 10),
  };
};

const input = (await readSplit(1812, '\n', false)).map(parse);

type Comparator<T> = (a: T, b: T) => number;
type Normalizer = (a: string) => string;
const rowComparator = (
  sc: Comparator<string>,
  normalizer: Normalizer = (s) => s,
): Comparator<Row> =>
(a, b) =>
  sc(normalizer(a.last), normalizer(b.last)) ||
  sc(normalizer(a.first), normalizer(b.first));

const englishNormalizer = (s: string) =>
  s.toLocaleUpperCase('en-US').replaceAll(/\P{Alpha}/gv, '').replaceAll(
    'Æ',
    'AE',
  );
const englishCollator = new Intl.Collator('en-US');
const english = input.toSorted(
  rowComparator(englishCollator.compare, englishNormalizer),
);

const swedishNormalizer = (s: string) =>
  s.toLocaleUpperCase('sv').replaceAll(/\P{Alpha}/gv, '').replaceAll('Æ', 'Ä')
    .replaceAll('Ø', 'Ö');
const swedishCollator = new Intl.Collator('sv');
const swedish = input.toSorted(
  rowComparator(swedishCollator.compare, swedishNormalizer),
);

const dutchNormalizer = (s: string) =>
  s.replace(/^[\p{Lower} ]+/v, '').toLocaleUpperCase('nl').replaceAll(
    'Æ',
    'AE',
  );
const dutchCollator = new Intl.Collator('nl');
const dutch = input.toSorted(
  rowComparator(dutchCollator.compare, dutchNormalizer),
);

const middleValue = (rs: readonly Row[]): number =>
  rs.at(Math.floor(rs.length / 2))!.phone;

await show(productBy([english, swedish, dutch], middleValue));
