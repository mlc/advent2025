import '@js-joda/timezone';
import { Month, ZonedDateTime, ZoneId } from '@js-joda/core';
import { inputFilename } from './util.ts';

const exists = (fn: string): Promise<boolean> =>
  Deno.stat(fn).then(
    ({ isFile }) => isFile,
    (err: Error) => {
      if (err instanceof Deno.errors.NotFound) {
        return false;
      } else {
        return Promise.reject(err);
      }
    },
  );

const now = ZonedDateTime.now(ZoneId.of('America/New_York'));
const day = Deno.args.length === 1 ? parseInt(Deno.args[0]) : now.dayOfMonth();
const year = now.year();

if (now.month() !== Month.DECEMBER || day >= 26) {
  throw new Error("it's not the right season");
}

const filename = inputFilename(day, false);

if (await exists(filename)) {
  console.log('already present');
  Deno.exit(0);
}

const cookie = await Deno.readTextFile(
  Deno.env.get('HOME')! + '/.aoccookie',
).then((d) => d.trim());

const resp = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
  headers: {
    Cookie: cookie,
    'User-Agent': 'mlc-advent/0.1 github.com/mlc/advent2024',
  },
});

if (!resp.ok) {
  console.error(resp.statusText);
  Deno.exit(1);
}

if (!resp.body) {
  throw new Error('no body??');
}

const file = await Deno.open(filename, { write: true, create: true });
await resp.body.pipeTo(file.writable);

console.log(`${filename} written`);
