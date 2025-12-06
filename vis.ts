import { Frame, GIF, Image } from 'imagescript';

interface Opts {
  blocksize?: number;
  padding?: number;
  color?: number;
}

interface PngOpts extends Opts {
  filename?: string;
}

interface GifOpts extends Opts {
  filename: string;
  duration?: number;
}

// should be able to omit ImageFuncs and say <T extends Image> but TS complains
type ImageFuncs = Pick<Image, 'fill' | 'drawBox'>;

interface ImageConstructor<T extends ImageFuncs> {
  new (width: number, height: number): T;
}

const mkImg = <T extends ImageFuncs>(
  pixels: boolean[][],
  { blocksize = 8, padding = 4, color = 0x11aa11ff }: Opts,
  klass: ImageConstructor<T>,
): T => {
  const height = pixels.length;
  const width = pixels[0].length;

  const img = new klass(
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

  return img;
};

export const showGrid = async (
  pixels: boolean[][],
  { filename, ...opts }: PngOpts = {},
): Promise<void> => {
  const img = mkImg(pixels, opts, Image);
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

export const showGrids = async (
  pixelss: boolean[][][],
  { filename, duration = 100, ...opts }: GifOpts,
) => {
  const frames = pixelss.map((pixels) => {
    const frame = mkImg(pixels, opts, Frame);
    frame.duration = duration;
    return frame;
  });
  const gif = new GIF(frames);
  const encoded = await gif.encode();
  await Deno.writeFile(filename, encoded);
};
