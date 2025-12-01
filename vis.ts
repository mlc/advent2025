import { Image } from 'imagescript';

interface Opts {
  blocksize?: number;
  padding?: number;
  color?: number;
  filename?: string;
}

export const showGrid = async (
  pixels: boolean[][],
  { blocksize = 8, padding = 4, color = 0x11aa11ff, filename }: Opts = {},
): Promise<void> => {
  const height = pixels.length;
  const width = pixels[0].length;

  const img = new Image(
    width * blocksize + 2 * padding,
    height * blocksize + 2 * padding,
  );

  img.fill(0xff);
  pixels.forEach((row, y) =>
    row.forEach((val, x) => {
      img.drawBox(
        x * blocksize + padding,
        y * blocksize + padding,
        blocksize,
        blocksize,
        val ? color : 0x111111ff,
      );
    })
  );
  const png = await img.encode();

  if (filename) {
    await Deno.writeFile(filename, png);
  } else {
    const process = new Deno.Command('display', {
      stdin: 'piped',
      stderr: 'inherit',
      stdout: 'inherit',
    }).spawn();
    const writer = process.stdin.getWriter();
    await writer.write(png);
    await writer.close();
    await process.status;
  }
};
