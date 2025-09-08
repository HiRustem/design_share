function parseFillToRgbNormalized(fill: any): [number, number, number] {
  if (!fill) return [0, 0, 0];

  if (typeof fill === 'string') {
    const s = fill.trim();

    if (s.startsWith('#')) {
      let hex = s.slice(1);
      if (hex.length === 3) {
        hex = hex
          .split('')
          .map((c) => c + c)
          .join('');
      }

      if (hex.length === 6) {
        const num = parseInt(hex, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        return [r / 255, g / 255, b / 255];
      }
    }

    const rgbMatch = s.match(/rgba?\\((\\d+)[,\\s]+(\\d+)[,\\s]+(\\d+))/i);

    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      return [r / 255, g / 255, b / 255];
    }
  }

  try {
    const FabricColor = (fabric as any) && (fabric as any).Color ? (fabric as any).Color : null;

    if (FabricColor) {
      const col = new FabricColor(fill);
      const src = col.getSource?.();
      if (src && src.length >= 3) {
        return [src[0] / 255, src[1] / 255, src[2] / 255];
      }
    }
  } catch (e) {}

  return [0, 0, 0];
}
