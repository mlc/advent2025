import {
  ChronoField,
  DateTimeFormatterBuilder,
  LocalDate,
  ResolverStyle,
} from '@js-joda/core';
import { readSplit, show } from './util.ts';

interface Row {
  d: string;
  ns: Set<string>;
}

const parse = (x: string): Row => {
  const [d, b] = x.split(': ');
  return { d, ns: new Set(b.split(', ')) };
};

const input = (await readSplit(1809, '\n', false)).map(parse);

const allNames = input.reduce((s, { ns }) => s.union(ns), new Set<string>());

const kinds = [
  'dmy',
  'mdy',
  'ymd',
  'ydm',
];

const candidates = kinds.map(() => new Set(allNames));

const appendField = (fb: DateTimeFormatterBuilder, field: string) => {
  switch (field) {
    case 'd':
      fb.appendValue(ChronoField.DAY_OF_MONTH, 2);
      break;
    case 'm':
      fb.appendValue(ChronoField.MONTH_OF_YEAR, 2);
      break;
    case 'y':
      fb.appendValueReduced(ChronoField.YEAR_OF_ERA, 2, 2, 1920);
      break;
    default:
      throw new Error(field);
  }
};

const formatters = kinds.map((kind) => {
  const fb = new DateTimeFormatterBuilder().parseStrict().parseDefaulting(
    ChronoField.ERA,
    1,
  );
  appendField(fb, kind[0]);
  fb.appendLiteral('-');
  appendField(fb, kind[1]);
  fb.appendLiteral('-');
  appendField(fb, kind[2]);
  return fb.toFormatter(ResolverStyle.STRICT);
});

input.forEach(({ d, ns }) => {
  formatters.forEach((kind, i) => {
    try {
      LocalDate.parse(d, kind);
    } catch (_e) {
      ns.forEach((n) => candidates[i].delete(n));
    }
  });
});

const SEPT_11 = LocalDate.parse('2001-09-11');

const result = formatters.flatMap((fmt, i) => {
  const target = fmt.format(SEPT_11);
  const row = input.find(({ d }) => d === target);
  return row ? [...candidates[i].intersection(row.ns)] : [];
}).toSorted((a, b) => a.localeCompare(b));

await show(result.join(' '));
