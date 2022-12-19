class Generator {
  constructor(canvas, download) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.download = download;
  }

  async generate() {
    this.initGif();

    const fontSize = images.frame.height * 0.1;
    this.context.font = `bold ${fontSize}px ${FONT_NAME}`;

    const texts = getTexts();

    for await (const text of texts) {
      this.context.drawImage(
        images.frame,
        0, 0, images.frame.width, images.frame.height,
        0, 0, this.canvas.width, this.canvas.height
      );

      const x = 14;
      const y = 44
      this.context.fillText(text[0], x, y);
      this.context.fillText(text[1] || '', x, y + fontSize * 1.6);

      await this.addGifFrame(600);

      if (text == texts[texts.length - 1]) {
        await this.addGifFrame(1000);
      } else {
        for (let i = 0; i < 2; i++) {
          const arrowX = this.canvas.width - 30
          const arrowY = this.canvas.height - 14

          const delay = 200
          this.context.drawImage(
            images.arrow,
            0, 0, images.arrow.width, images.arrow.height,
            arrowX, arrowY, images.arrow.width * 0.5, images.arrow.height * 0.5
          );
          await this.addGifFrame(delay);

          this.context.drawImage(
            images.line,
            0, 0, images.arrow.width, images.arrow.height,
            arrowX, arrowY, images.arrow.width * 0.5, images.arrow.height * 0.5
          );
          await this.addGifFrame(delay);
        }
      }
    }

    if (this.download) {
      this.gif.render();
    } else {
      await sleep(1000);
      this.generate();
    }
  }

  initGif() {
    if (!this.download) {
      return;
    }

    this.gif = new GIF({
      width: this.canvas.width,
      height: this.canvas.height,
      workerScript: 'gif.worker.js',
    });

    this.gif.on('finished', (blob) => {
      const link = document.createElement('a');
      link.download = 'karin-maker.gif';
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }

  async addGifFrame(delay) {
    await sleep(delay);

    if (!this.download) {
      return;
    }

    this.gif.addFrame(this.context, { delay, copy: true })
  }
}
