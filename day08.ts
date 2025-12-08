import { getNums, productBy, readSplit, show, sumBy, zipWith } from './util.ts';
import { UndirectedGraph } from 'graphology';
import { Heap } from 'mnemonist';
import {
  connectedComponents,
  countConnectedComponents,
} from 'graphology-components';

const parse = (x: string) => getNums(x) as [number, number, number];

const input = (await readSplit(8, '\n', false)).map(parse);

const distSq = (a: number[], b: number[]) =>
  sumBy(zipWith(a, b, (a0, b0) => (b0 - a0) * (b0 - a0)));

const graph = new UndirectedGraph();
interface Dist {
  i: number;
  j: number;
  dist: number;
}
const h = new Heap<Dist>((x, y) => x.dist - y.dist);
for (let i = 0; i < input.length; i++) {
  graph.addNode(i);
}
for (let i = 0; i < input.length; i++) {
  for (let j = i + 1; j < input.length; j++) {
    h.push({ i, j, dist: distSq(input[i], input[j]) });
  }
}

for (let i = 0; i < 1000; ++i) {
  const next = h.pop()!;
  graph.addEdge(next.i, next.j);
}

const components = connectedComponents(graph).toSorted((a, b) =>
  b.length - a.length
);

await show(productBy(components.slice(0, 3), (c) => c.length));

// surely there is a more efficient algorithm for this but who cares
let candidate = 0;
while (countConnectedComponents(graph) > 1) {
  const next = h.pop()!;
  candidate = input[next.i][0] * input[next.j][0];
  graph.addEdge(next.i, next.j);
}

await show(candidate);
