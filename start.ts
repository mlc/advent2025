import '@js-joda/timezone';
import { ZonedDateTime, ZoneId } from '@js-joda/core';
import { renderFileToString } from 'dejs';

const now = ZonedDateTime.now(ZoneId.of('America/New_York'));
const date = Deno.args.length === 1 ? parseInt(Deno.args[0]) : now
  .toLocalDate()
  .plusDays(now.hour() >= 12 ? 1 : 0)
  .dayOfMonth();

const filename = `day${date < 10 ? '0' : ''}${date}.ts`;

const file = await Deno.open(filename, { createNew: true, write: true });
const ejs = await renderFileToString('template.ts.ejs', { date });
const encoder = new TextEncoderStream();
ReadableStream.from([ejs]).pipeTo(encoder.writable);
await encoder.readable.pipeTo(file.writable);

console.log(`wrote ${filename}`);

const gitCommand = new Deno.Command('git', {
  args: ['add', filename],
});

const output = await gitCommand.output();
if (!output.success) {
  throw new Error(new TextDecoder().decode(output.stderr));
}
