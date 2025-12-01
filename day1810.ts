import { readSplit, show, sumBy } from './util.ts';
import * as b from 'bcrypt';

const [passInput, triesInput] = (await readSplit(1810, '\n\n', false)).map(
  (section) => section.split('\n'),
);

const passwd = Object.fromEntries(passInput.map((x) => x.split(' ')));
const tries: [string, string][] = triesInput.map((x) =>
  x.split(' ') as [string, string]
);

const ps = (prefix: string[], suffix: string[]): string[] => {
  if (suffix.length === 0) {
    return [prefix.join('')];
  }
  const [thisChar, ...rest] = suffix;
  const nfd = thisChar.normalize('NFD');
  if (thisChar === nfd) {
    return ps([...prefix, thisChar], rest);
  } else {
    return [thisChar, nfd].flatMap((candidate) =>
      ps([...prefix, candidate], rest)
    );
  }
};

const possibilities = (s: string) => ps([], Array.from(s.normalize('NFC')));

const isValid = ([login, pass]: [string, string], i: number) => {
  const crypted = passwd[login];
  console.log(login, i);
  if (!crypted) {
    return false;
  }
  const passes = possibilities(pass);
  return passes.some((p) => b.compareSync(p, crypted));
};

await show(sumBy(tries, isValid));
