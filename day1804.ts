import {
  ChronoUnit,
  DateTimeFormatter,
  LocalDateTime,
  ZonedDateTime,
  ZoneId,
} from '@js-joda/core';
import { Locale } from '@js-joda/locale_en';
import '@js-joda/timezone';
import { readSplit, show, sumBy } from './util.ts';

type ZdtPair = [ZonedDateTime, ZonedDateTime];

const parser = DateTimeFormatter.ofPattern('MMM dd, yyyy, HH:mm').withLocale(
  Locale.US,
);

const parsePart = (x: string): ZonedDateTime => {
  const [, tz, ...rest] = x.split(/\s+/);
  const date = rest.join(' ');
  return LocalDateTime.parse(date, parser).atZone(ZoneId.of(tz));
};

const parse = (x: string): ZdtPair => x.split('\n').map(parsePart) as ZdtPair;

const input = (await readSplit(1804, '\n\n', false)).map(parse);

const duration = ([a, b]: ZdtPair) => a.until(b, ChronoUnit.MINUTES);

await show(sumBy(input, duration));
