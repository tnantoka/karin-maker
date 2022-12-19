const FONT_NAME = 'DotGothic16';

const preview = document.querySelector('.preview');
const output = document.querySelector('.output');
const download = document.querySelector('.download');
const inputs = ['pokemon', 'trainer', 'strong', 'weak', 'win', 'fight'].reduce((a, e) => (
  { ...a, [e]: document.querySelector(`.${e}`) }
),{});

let images = {};

const sleep = async (s) => await new Promise((resolve) => setTimeout(resolve, s));

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

const getTexts = () => {
  const getInput = (name) => inputs[name].value;

  return [
    [`${getInput('strong')}　${getInput('pokemon')}`],
    [`${getInput('weak')}　${getInput('pokemon')}`],
    [`そんなの　ひとの　かって`],
    [`ほんとうに　${getInput('strong')}　${getInput('trainer')}なら`, `すきな　${getInput('pokemon')}で`],
    [`${getInput('win')}ように　${getInput('fight')}べき`],
  ];
};

download.addEventListener('click', async () => {
  const setDisabled = (flag) => {
    output.disabled = flag;
    download.disabled = flag;
    Object.keys(inputs).forEach((key) => inputs[key].disabled = flag);
  };

  setDisabled(true);
  const prefix = '...';
  download.textContent += prefix;
  await new Generator(preview.cloneNode(), true).generate();
  download.textContent = download.textContent.replace(prefix, '');
  setDisabled(false);
});

const init = async () => {
  await loadFont();

  images = {
    frame: await loadImage('frame.png'),
    arrow: await loadImage('arrow.png'),
    line: await loadImage('line.png'),
  }

  preview.width = images.frame.width * 0.5;
  preview.height = images.frame.height * 0.5;

  new Generator(preview, false).generate();
};

init();

