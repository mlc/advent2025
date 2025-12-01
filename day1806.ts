import { readSplit, show, sumBy } from './util.ts';

const [words, puzzle] = (await readSplit(1806, '\n\n', false)).map((part) =>
  part.split('\n')
);

const chars = (s: string) => Uint8Array.from(s, (c) => c.charCodeAt(0));
const decoder = new TextDecoder('utf-8');
const demojiBake = (s: string) => decoder.decode(chars(s));

const fix = (word: string, i: number) => {
  if (i % 15 === 0) {
    return demojiBake(demojiBake(word));
  } else if (i % 3 === 0 || i % 5 === 0) {
    return demojiBake(word);
  } else {
    return word;
  }
};

const fixedWords = words.map((w, i) => fix(w, i + 1));

const findWord = (row: string) => {
  const pattern = new RegExp('^' + row.trim() + '$');
  const idx = fixedWords.findIndex((word) => pattern.test(word));
  if (idx < 0) {
    throw new Error(row);
  }
  return idx + 1;
};

await show(sumBy(puzzle, findWord));
