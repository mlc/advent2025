import { readSplit, show, sumBy } from './util.ts';

const input = await readSplit(1801, '\n', false);

const encoder = new TextEncoder();
const byteLength = (s: string) => encoder.encode(s).length;

const cost = (s: string) => {
  const validTweet = s.length <= 140;
  const validSms = byteLength(s) <= 160;
  if (validTweet && validSms) {
    return 13;
  } else if (validTweet) {
    return 7;
  } else if (validSms) {
    return 11;
  } else {
    return 0;
  }
};

await show(sumBy(input, cost));
