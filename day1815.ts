import {
  DateTimeFormatter,
  DayOfWeek,
  Instant,
  LocalDate,
  LocalTime,
  ZoneId,
} from '@js-joda/core';
import { Locale } from '@js-joda/locale_en';
import '@js-joda/timezone';
import { range, readSplit, show, sumBy } from './util.ts';
import { Duration } from '@js-joda/core';

const dateFormat = DateTimeFormatter.ofPattern('d MMMM yyyy').withLocale(
  Locale.US,
);

interface Entity {
  name: string;
  tz: ZoneId;
  holidays: LocalDate[];
}

const parse = (x: string) => {
  const components = x.split('\t');
  return {
    name: components[0],
    tz: ZoneId.of(components[1]),
    holidays: components[2].split(';').map((h) =>
      LocalDate.parse(h, dateFormat)
    ),
  };
};

const [offices, customers] = (await readSplit(1815, '\n\n', false)).map(
  (section) => section.split('\n').map(parse),
);

const WORKDAY_START = LocalTime.parse('08:30');
const WORKDAY_END = LocalTime.parse('17:00');
const YEAR_START = Instant.parse('2022-01-01T00:00:00Z');
const YEAR_END = Instant.parse('2023-01-01T00:00:00Z');

const isWorking = (office: Entity, when: Instant) => {
  const zdt = when.atZone(office.tz);
  const dow = zdt.dayOfWeek();
  if (dow === DayOfWeek.SATURDAY || dow === DayOfWeek.SUNDAY) {
    return false;
  }
  if (office.holidays.some((h) => h.equals(zdt.toLocalDate()))) {
    return false;
  }
  const t = zdt.toLocalTime();
  return !t.isBefore(WORKDAY_START) && t.isBefore(WORKDAY_END);
};

const otMinutes = (customer: Entity, delta = 15) => {
  const deltaMinutes = Duration.ofMinutes(delta);
  let minutes = 0;
  for (let t = YEAR_START; t.isBefore(YEAR_END); t = t.plus(deltaMinutes)) {
    const date = LocalDate.ofInstant(t, customer.tz);
    const dow = date.dayOfWeek();
    if (
      dow === DayOfWeek.SATURDAY || dow === DayOfWeek.SUNDAY ||
      customer.holidays.some((h) => h.equals(date))
    ) {
      continue;
    }
    if (!offices.some((o) => isWorking(o, t))) {
      minutes += delta;
    }
  }
  return minutes;
};

const otNeeded = customers.map((c) => otMinutes(c)).toSorted();

await show(otNeeded.at(-1)! - otNeeded[0]);
