registerPaint(
  "headerHighlight",
  class {
    static get contextOptions() {
      return { alpha: true };
    }

    /*
    ctx is the 2D drawing context
    size is the paintSize, the dimensions (height and width) of the box being painted
  */
    paint(ctx, size) {
      ctx.fillStyle = "hsl(55 90% 60% / 1.0)";
      ctx.fillRect(0, size.height / 3, size.width * 0.4, size.height * 0.6);
    }
  }
);
