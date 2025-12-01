import { ZonedDateTime, ZoneId } from '@js-joda/core';
import { readSplit, show, sumBy } from './util.ts';
import '@js-joda/timezone';

type Row = [ts: ZonedDateTime, right: number, wrong: number];

const parse = (x: string): Row => {
  const parts = x.split(/\s+/);
  return [ZonedDateTime.parse(parts[0]), Number(parts[1]), Number(parts[2])];
};

const input = (await readSplit(1807, '\n', false)).map(parse);

const zones = [ZoneId.of('America/Halifax'), ZoneId.of('America/Santiago')];

const fix = ([ts, right, wrong]: Row) => {
  const fullZ = zones.map((z) => ts.withZoneSameInstant(z)).find((c) =>
    c.offset() === ts.offset()
  );
  if (!fullZ) {
    throw new Error(ts.toString());
  }
  return fullZ.minusMinutes(wrong).plusMinutes(right);
};

await show(sumBy(input, (r, i) => fix(r).hour() * (i + 1)));
