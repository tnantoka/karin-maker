const FONT_NAME = 'DotGothic16';

const canvas = document.querySelector('canvas');
const output = document.querySelector('.output');
const context = canvas.getContext('2d');

const getTexts = () => {
  return [
    ['つよい　ポケモン'],
    ['よわい　ポケモン'],
    ['そんなの　ひとの　かって'],
    ['ほんとうに　つよい　トレーナーなら', 'すきな　ポケモンで'],
    ['かてるように　がんばるべき'],
  ];
};
 
const loadFont = async () => {
  const font = new FontFace(FONT_NAME, 'url(https://fonts.gstatic.com/s/dotgothic16/v15/v6-QGYjBJFKgyw5nSoDAGE7L435YPFrT.ttf)');
  await font.load();
  document.fonts.add(font);
};
 
const loadImage = async(src) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
  });
};

(async () => {
  const frame = await loadImage('frame.png');
  const arrow = await loadImage('arrow.png');
  const line = await loadImage('line.png');
  await loadFont();

  const { width, height } = frame;
  canvas.width = width * 0.5;
  canvas.height = height * 0.5;

  const texts = getTexts();

  const fontSize = height * 0.1;
  context.font = `bold ${fontSize}px ${FONT_NAME}`;

  const gif = new GIF({
    width: canvas.width,
    height: canvas.height,
    workerScript: 'gif.worker.js',
    transparent: 0xFFFFFF,
  });

  gif.on('finished', function (blob) {
    output.src = URL.createObjectURL(blob)
  });

  for await (text of texts) {
    context.drawImage(frame, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
    const x = 14;
    const y = 44
    context.fillText(text[0], x, y);
    context.fillText(text[1] || '', x, y + fontSize * 1.6);

    const delay = 600;
    gif.addFrame(context, { delay, copy: true })
    await new Promise((resolve) => setTimeout(resolve, delay));

    for (i = 0; i < 2; i++) {
      const arrowX = canvas.width - 30
      const arrowY = canvas.height - 14

      const delay = 200
      context.drawImage(arrow, 0, 0, arrow.width, arrow.height, arrowX, arrowY, arrow.width * 0.5, arrow.height * 0.5);
      gif.addFrame(context, { delay, copy: true })
      await new Promise((resolve) => setTimeout(resolve, delay));

      context.drawImage(line, 0, 0, arrow.width, arrow.height, arrowX, arrowY, arrow.width * 0.5, arrow.height * 0.5);
      gif.addFrame(context, { delay, copy: true })
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  
  gif.render();
})();
