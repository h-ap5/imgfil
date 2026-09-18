"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const elements = {
  canvas: $("#preview-canvas"),
  dropZone: $("#drop-zone"),
  emptyState: $("#empty-state"),
  fileInput: $("#file-input"),
  uploadButton: $("#upload-button"),
  resetButton: $("#reset-button"),
  compareButton: $("#compare-button"),
  downloadButton: $("#download-button"),
  filterCards: $$(".filter-card"),
  strengthRange: $("#strength-range"),
  strengthValue: $("#strength-value"),
  grainRange: $("#grain-range"),
  grainValue: $("#grain-value"),
  ratioButtons: $$("[data-ratio]"),
  dateToggle: $("#date-toggle"),
  fileMeta: $("#file-meta"),
  statusSize: $("#status-size"),
  processing: $("#processing-indicator"),
  toast: $("#toast"),
  stickerTray: $("#sticker-tray"),
  stickerTabs: $$('[data-sticker-group]'),
  randomStickers: $("#random-stickers"),
  clearStickers: $("#clear-stickers"),
  stickerTools: $("#sticker-tools"),
  stickerSize: $("#sticker-size"),
  stickerSizeValue: $("#sticker-size-value"),
  stickerRotation: $("#sticker-rotation"),
  stickerRotationValue: $("#sticker-rotation-value"),
  deleteSticker: $("#delete-sticker"),
};

const state = {
  image: null,
  fileName: "",
  filter: "softcam",
  strength: 0.72,
  grain: 0.24,
  ratio: "original",
  showDate: false,
  comparing: false,
  renderFrame: null,
  seed: Math.floor(Math.random() * 100000),
  stickerGroup: "holo",
  stickers: [],
  selectedStickerId: null,
  draggingSticker: null,
  stickerCounter: 0,
};

const stickerCatalog = window.STICKER_CATALOG || [];
const stickerDefinitions = new Map(stickerCatalog.map((sticker) => [sticker.id, sticker]));
const stickerAssets = new Map();

const filterNames = {
  softcam: "흐릿한 아이폰",
  y2k: "Y2K 앰버",
  analog: "아날로그 TV",
  disposable: "일회용 플래시",
  ccd: "블루 CCD",
  liquify: "네온 용해",
  signal: "신호 붕괴",
  frameecho: "프레임 잔상",
  prism: "프리즘 잔상",
  thermal: "열화상 블룸",
  xerox: "복사기 레이브",
  riso: "리소 어긋남",
  comic: "셀 만화",
  holo: "홀로 드림",
};

function clamp(value, min = 0, max = 255) {
  return Math.max(min, Math.min(max, value));
}

function mulberry32(seed) {
  return function random() {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 3200);
}

function setRangeFill(input) {
  input.style.setProperty("--range-value", `${input.value}%`);
}

function getCrop(sourceWidth, sourceHeight, ratio) {
  if (ratio === "original") {
    return { sx: 0, sy: 0, sw: sourceWidth, sh: sourceHeight, aspect: sourceWidth / sourceHeight };
  }

  const targetAspect = ratio === "1:1" ? 1 : 4 / 5;
  const sourceAspect = sourceWidth / sourceHeight;
  let sw = sourceWidth;
  let sh = sourceHeight;

  if (sourceAspect > targetAspect) sw = sourceHeight * targetAspect;
  else sh = sourceWidth / targetAspect;

  return {
    sx: (sourceWidth - sw) / 2,
    sy: (sourceHeight - sh) / 2,
    sw,
    sh,
    aspect: targetAspect,
  };
}

function getOutputSize(crop, maxSide) {
  const scale = Math.min(1, maxSide / Math.max(crop.sw, crop.sh));
  return {
    width: Math.max(1, Math.round(crop.sw * scale)),
    height: Math.max(1, Math.round(crop.sh * scale)),
  };
}

function presetFilter(name, strength) {
  const s = strength;
  const filters = {
    softcam: `brightness(${1 + 0.09 * s}) contrast(${1 - 0.18 * s}) saturate(${1 - 0.25 * s}) sepia(${0.08 * s}) blur(${0.65 * s}px)`,
    y2k: `brightness(${1 + 0.03 * s}) contrast(${1 + 0.08 * s}) saturate(${1 - 0.3 * s}) sepia(${0.46 * s}) hue-rotate(${-8 * s}deg)`,
    analog: `brightness(${1 - 0.04 * s}) contrast(${1 + 0.25 * s}) saturate(${1 - 0.42 * s})`,
    disposable: `brightness(${1 + 0.02 * s}) contrast(${1 + 0.26 * s}) saturate(${1 - 0.12 * s}) sepia(${0.1 * s})`,
    ccd: `brightness(${1 - 0.02 * s}) contrast(${1 - 0.06 * s}) saturate(${1 - 0.16 * s}) hue-rotate(${4 * s}deg)`,
    liquify: `brightness(${1 - 0.08 * s}) contrast(${1 + 0.34 * s}) saturate(${1 + 0.72 * s})`,
    signal: `brightness(${1 - 0.04 * s}) contrast(${1 + 0.2 * s}) saturate(${1 + 0.28 * s})`,
    frameecho: `brightness(${1 - 0.03 * s}) contrast(${1 + 0.12 * s}) saturate(${1 + 0.18 * s})`,
    prism: `brightness(${1 + 0.08 * s}) contrast(${1 - 0.12 * s}) saturate(${1 + 0.12 * s})`,
    comic: `brightness(${1 + 0.02 * s}) contrast(${1 + 0.12 * s}) saturate(${1 + 0.3 * s})`,
    holo: `brightness(${1 + 0.1 * s}) contrast(${1 - 0.22 * s}) saturate(${1 - 0.12 * s}) blur(${0.28 * s}px)`,
  };
  return filters[name] || "none";
}

function snapshotCanvas(canvas) {
  const copy = document.createElement("canvas");
  copy.width = canvas.width;
  copy.height = canvas.height;
  copy.getContext("2d").drawImage(canvas, 0, 0);
  return copy;
}

function pixelIndex(x, y, width) {
  return (y * width + x) * 4;
}

function luminance(data, index) {
  return data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
}

function mixChannel(from, to, amount) {
  return clamp(from + (to - from) * amount);
}

function addColorWash(ctx, width, height, color, alpha, blend = "source-over") {
  ctx.save();
  ctx.globalCompositeOperation = blend;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function addBloom(ctx, canvas, width, height, strength, tone = "#fff3ea") {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.12 + strength * 0.18;
  ctx.filter = `blur(${Math.max(2, width * 0.009)}px) brightness(1.16)`;
  ctx.drawImage(canvas, 0, 0, width, height);
  ctx.filter = "none";
  ctx.fillStyle = tone;
  ctx.globalAlpha = strength * 0.05;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function addVignette(ctx, width, height, amount) {
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.18,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.72,
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.62, "rgba(0,0,0,0)");
  gradient.addColorStop(1, `rgba(18,10,23,${amount})`);
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function addFlash(ctx, width, height, strength) {
  const gradient = ctx.createRadialGradient(
    width * 0.48,
    height * 0.43,
    0,
    width * 0.48,
    height * 0.43,
    Math.max(width, height) * 0.58,
  );
  gradient.addColorStop(0, `rgba(255,255,245,${0.45 * strength})`);
  gradient.addColorStop(0.34, `rgba(255,241,218,${0.14 * strength})`);
  gradient.addColorStop(1, "rgba(255,220,190,0)");
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function addScanlines(ctx, width, height, strength) {
  const gap = Math.max(3, Math.round(height / 280));
  ctx.save();
  ctx.globalAlpha = 0.18 + strength * 0.2;
  ctx.fillStyle = "#05060b";
  for (let y = 0; y < height; y += gap) ctx.fillRect(0, y, width, Math.max(1, gap * 0.24));
  ctx.restore();
}

function applyNeonLiquify(ctx, width, height, strength, seed) {
  if (strength <= 0.01) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const source = new Uint8ClampedArray(imageData.data);
  const data = imageData.data;
  const phase = (seed % 997) / 997 * Math.PI * 2;
  const horizontalAmp = width * (0.025 + strength * 0.11);
  const verticalAmp = height * (0.025 + strength * 0.19);
  const channelShift = Math.max(1, Math.round(width * (0.004 + strength * 0.014)));

  for (let y = 0; y < height; y += 1) {
    const ny = y / height;
    for (let x = 0; x < width; x += 1) {
      const nx = x / width;
      const ribbon = Math.sin(nx * 22 + phase) * 0.58 + Math.sin(nx * 9 - phase * 0.7) * 0.42;
      const curve = Math.sin(ny * 15 + ribbon * 3.2 + phase) + Math.sin(ny * 31 - nx * 7) * 0.34;
      const pull = Math.pow((ribbon + 2) / 4, 2) * verticalAmp;
      const sourceX = Math.round(clamp(x + curve * horizontalAmp, 0, width - 1));
      const sourceY = Math.round(clamp(y - pull + Math.sin(nx * 16 + ny * 5 + phase) * verticalAmp * 0.36, 0, height - 1));
      const redX = Math.round(clamp(sourceX + channelShift * (0.35 + Math.abs(curve)), 0, width - 1));
      const blueX = Math.round(clamp(sourceX - channelShift * (0.35 + Math.abs(ribbon)), 0, width - 1));
      const target = pixelIndex(x, y, width);
      const redSource = pixelIndex(redX, sourceY, width);
      const greenSource = pixelIndex(sourceX, sourceY, width);
      const blueSource = pixelIndex(blueX, sourceY, width);
      const red = source[redSource];
      const green = source[greenSource + 1];
      const blue = source[blueSource + 2];
      data[target] = clamp(red * 1.36 + blue * 0.12);
      data[target + 1] = clamp(green * 0.5 + Math.min(red, blue) * 0.12);
      data[target + 2] = clamp(blue * 1.48 + red * 0.13);
      data[target + 3] = source[greenSource + 3];
    }
  }
  ctx.putImageData(imageData, 0, 0);
  addColorWash(ctx, width, height, "#17002e", 0.16 * strength, "multiply");
}

function applySignalCrash(ctx, width, height, strength, seed) {
  if (strength <= 0.01) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const source = new Uint8ClampedArray(imageData.data);
  const data = imageData.data;
  const shift = Math.max(1, Math.round(width * (0.006 + strength * 0.022)));
  const random = mulberry32(seed + 71);

  for (let y = 0; y < height; y += 1) {
    const lineKick = random() > 0.985 - strength * 0.008 ? Math.round((random() - 0.5) * shift * 6) : 0;
    for (let x = 0; x < width; x += 1) {
      const target = pixelIndex(x, y, width);
      const redX = Math.round(clamp(x + shift + lineKick, 0, width - 1));
      const blueX = Math.round(clamp(x - shift + lineKick, 0, width - 1));
      data[target] = source[pixelIndex(redX, y, width)];
      data[target + 1] = source[target + 1];
      data[target + 2] = source[pixelIndex(blueX, y, width) + 2];
    }
  }
  ctx.putImageData(imageData, 0, 0);

  const shifted = snapshotCanvas(ctx.canvas);
  const tearCount = Math.round(7 + strength * 18);
  for (let i = 0; i < tearCount; i += 1) {
    const y = Math.floor(random() * height);
    const bandHeight = Math.max(2, Math.floor((0.003 + random() * 0.025 * strength) * height));
    const offset = Math.round((random() - 0.5) * width * (0.05 + strength * 0.18));
    ctx.drawImage(shifted, 0, y, width, bandHeight, offset, y, width, bandHeight);
  }

  ctx.save();
  const blockCount = Math.round(5 + strength * 13);
  for (let i = 0; i < blockCount; i += 1) {
    const blockWidth = width * (0.04 + random() * 0.18);
    const blockHeight = Math.max(3, height * (0.004 + random() * 0.018));
    ctx.globalAlpha = 0.5 + random() * 0.45 * strength;
    ctx.fillStyle = random() > 0.18 ? "#07070d" : random() > 0.5 ? "#ff244f" : "#00dce8";
    ctx.fillRect(random() * (width - blockWidth), random() * height, blockWidth, blockHeight);
  }
  ctx.globalAlpha = 0.3 + strength * 0.35;
  ctx.fillStyle = "#e8fffb";
  for (let i = 0; i < Math.round(20 + strength * 60); i += 1) {
    const y = random() * height;
    ctx.fillRect(random() * width, y, random() * width * 0.13, Math.max(1, height * 0.0012));
  }
  ctx.restore();
}

function applyFrameEcho(ctx, width, height, strength, seed) {
  if (strength <= 0.01) return;
  const source = snapshotCanvas(ctx.canvas);
  const random = mulberry32(seed + 191);
  const distance = width * (0.018 + strength * 0.13);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let i = 4; i >= 1; i -= 1) {
    const direction = i % 2 === 0 ? 1 : -1;
    ctx.globalAlpha = (0.055 + strength * 0.045) * (5 - i);
    ctx.filter = `hue-rotate(${direction > 0 ? 165 : -18}deg) saturate(2.1) contrast(1.08)`;
    ctx.drawImage(source, direction * distance * i * 0.56, 0, width, height);
  }
  ctx.restore();

  const blocks = Math.round(18 + strength * 58);
  ctx.save();
  for (let i = 0; i < blocks; i += 1) {
    const sourceX = random() * width * 0.86;
    const sourceY = random() * height;
    const blockWidth = width * (0.025 + random() * 0.11);
    const blockHeight = Math.max(3, height * (0.004 + random() * 0.035));
    const offset = (random() - 0.34) * distance * 2.4;
    ctx.globalAlpha = 0.22 + random() * 0.48 * strength;
    ctx.drawImage(source, sourceX, sourceY, blockWidth, blockHeight, sourceX + offset, sourceY, blockWidth * (1 + random() * 0.4), blockHeight);
  }
  ctx.restore();
}

function applyPrismEcho(ctx, width, height, strength) {
  if (strength <= 0.01) return;
  const source = snapshotCanvas(ctx.canvas);
  const distance = width * (0.012 + strength * 0.045);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.08 + strength * 0.13;
  ctx.filter = `blur(${Math.max(1, width * 0.0025 * strength)}px) hue-rotate(-24deg) saturate(1.5)`;
  ctx.drawImage(source, -distance, 0, width, height);
  ctx.filter = `blur(${Math.max(1, width * 0.002 * strength)}px) hue-rotate(145deg) saturate(1.6)`;
  ctx.drawImage(source, distance, 0, width, height);
  ctx.filter = "none";

  const spectrum = ctx.createLinearGradient(0, 0, width, height);
  spectrum.addColorStop(0, "rgba(255,60,123,0.18)");
  spectrum.addColorStop(0.28, "rgba(255,222,93,0.12)");
  spectrum.addColorStop(0.52, "rgba(90,245,220,0.18)");
  spectrum.addColorStop(0.76, "rgba(93,101,255,0.17)");
  spectrum.addColorStop(1, "rgba(255,58,157,0.14)");
  ctx.globalAlpha = strength;
  ctx.fillStyle = spectrum;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.06);
  ctx.lineTo(width * 0.68, 0);
  ctx.lineTo(width, height * 0.7);
  ctx.lineTo(width * 0.28, height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  addBloom(ctx, ctx.canvas, width, height, strength * 0.46, "#f9efff");
}

function applyHoloDream(ctx, width, height, strength) {
  if (strength <= 0.01) return;
  const source = snapshotCanvas(ctx.canvas);
  const offset = Math.max(1, width * 0.004 * strength);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.06 + strength * 0.08;
  ctx.filter = `blur(${Math.max(1, width * 0.004 * strength)}px) hue-rotate(145deg)`;
  ctx.drawImage(source, offset, -offset * 0.3, width, height);
  ctx.filter = "none";

  const pearl = ctx.createLinearGradient(0, height, width, 0);
  pearl.addColorStop(0, "rgba(180,239,255,0.34)");
  pearl.addColorStop(0.28, "rgba(202,184,255,0.3)");
  pearl.addColorStop(0.56, "rgba(255,190,226,0.28)");
  pearl.addColorStop(0.78, "rgba(183,253,241,0.28)");
  pearl.addColorStop(1, "rgba(222,201,255,0.32)");
  ctx.globalAlpha = 0.34 + strength * 0.38;
  ctx.fillStyle = pearl;
  ctx.fillRect(0, 0, width, height);

  const glowA = ctx.createRadialGradient(width * 0.2, height * 0.24, 0, width * 0.2, height * 0.24, width * 0.48);
  glowA.addColorStop(0, `rgba(135,239,255,${0.34 * strength})`);
  glowA.addColorStop(1, "rgba(135,239,255,0)");
  ctx.fillStyle = glowA;
  ctx.fillRect(0, 0, width, height);

  const glowB = ctx.createRadialGradient(width * 0.82, height * 0.74, 0, width * 0.82, height * 0.74, width * 0.5);
  glowB.addColorStop(0, `rgba(244,172,255,${0.3 * strength})`);
  glowB.addColorStop(1, "rgba(244,172,255,0)");
  ctx.fillStyle = glowB;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  addBloom(ctx, ctx.canvas, width, height, strength * 0.7, "#e9efff");
}

function samplePalette(palette, value) {
  const position = clamp(value, 0, 1) * (palette.length - 1);
  const index = Math.min(palette.length - 2, Math.floor(position));
  const mix = position - index;
  return palette[index].map((channel, channelIndex) => channel + (palette[index + 1][channelIndex] - channel) * mix);
}

function applyThermal(ctx, width, height, strength) {
  if (strength <= 0.01) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const source = new Uint8ClampedArray(data);
  const palette = [
    [18, 0, 74],
    [20, 25, 176],
    [0, 154, 230],
    [30, 224, 164],
    [237, 239, 55],
    [255, 95, 25],
    [255, 30, 142],
  ];
  const amount = 0.34 + strength * 0.66;

  for (let i = 0; i < data.length; i += 4) {
    const value = Math.round(luminance(source, i) / 255 * 6) / 6;
    const color = samplePalette(palette, value);
    data[i] = mixChannel(source[i], color[0], amount);
    data[i + 1] = mixChannel(source[i + 1], color[1], amount);
    data[i + 2] = mixChannel(source[i + 2], color[2], amount);
  }
  ctx.putImageData(imageData, 0, 0);
  addBloom(ctx, ctx.canvas, width, height, strength * 0.54, "#45f6e0");
}

function applyXerox(ctx, width, height, strength, seed) {
  if (strength <= 0.01) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const source = new Uint8ClampedArray(imageData.data);
  const data = imageData.data;
  const random = mulberry32(seed + 307);
  const threshold = 144 - strength * 28;
  const amount = 0.42 + strength * 0.58;

  for (let i = 0; i < data.length; i += 4) {
    const light = luminance(source, i);
    const grit = (random() - 0.5) * (46 + strength * 70);
    const isInk = light + grit < threshold;
    const isAcid = !isInk && light < threshold + 58 && (source[i + 1] > source[i] * 0.92 || random() < 0.08 * strength);
    const color = isInk ? [18, 19, 16] : isAcid ? [166, 255, 34] : [238, 234, 218];
    data[i] = mixChannel(source[i], color[0], amount);
    data[i + 1] = mixChannel(source[i + 1], color[1], amount);
    data[i + 2] = mixChannel(source[i + 2], color[2], amount);
  }
  ctx.putImageData(imageData, 0, 0);
}

function applyRiso(ctx, width, height, strength) {
  if (strength <= 0.01) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const source = new Uint8ClampedArray(imageData.data);
  const data = imageData.data;
  const paper = [239, 233, 218];
  const blue = [25, 75, 158];
  const red = [246, 76, 48];
  const matrix = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const offset = Math.max(1, Math.round(width * 0.005 * strength));
  const amount = 0.4 + strength * 0.6;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const target = pixelIndex(x, y, width);
      const blueSource = pixelIndex(Math.round(clamp(x - offset, 0, width - 1)), y, width);
      const redSource = pixelIndex(Math.round(clamp(x + offset, 0, width - 1)), y, width);
      const dotThreshold = (matrix[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
      const blueAmount = (1 - luminance(source, blueSource) / 255) * 0.98;
      const redBias = Math.max(0, source[redSource] - (source[redSource + 1] + source[redSource + 2]) * 0.33) / 255;
      const redAmount = Math.min(1, redBias * 1.7 + (1 - luminance(source, redSource) / 255) * 0.38);
      const blueOn = blueAmount > dotThreshold;
      const redOn = redAmount > 1 - dotThreshold * 0.82;
      let color = paper;
      if (blueOn && redOn) color = [72, 48, 103];
      else if (blueOn) color = blue;
      else if (redOn) color = red;
      data[target] = mixChannel(source[target], color[0], amount);
      data[target + 1] = mixChannel(source[target + 1], color[1], amount);
      data[target + 2] = mixChannel(source[target + 2], color[2], amount);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function applyComic(ctx, width, height, strength) {
  if (strength <= 0.01) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const source = new Uint8ClampedArray(imageData.data);
  const data = imageData.data;
  const light = new Uint8ClampedArray(width * height);
  const levels = 4 + Math.round(strength * 2);
  const step = 255 / Math.max(1, levels - 1);
  const edgeThreshold = 42 - strength * 18;
  const amount = 0.38 + strength * 0.62;

  for (let i = 0, p = 0; i < source.length; i += 4, p += 1) light[p] = luminance(source, i);

  for (let y = 0; y < height; y += 1) {
    const up = Math.max(0, y - 1);
    const down = Math.min(height - 1, y + 1);
    for (let x = 0; x < width; x += 1) {
      const left = Math.max(0, x - 1);
      const right = Math.min(width - 1, x + 1);
      const target = pixelIndex(x, y, width);
      const gx = Math.abs(light[y * width + right] - light[y * width + left]);
      const gy = Math.abs(light[down * width + x] - light[up * width + x]);
      const edge = gx + gy > edgeThreshold;
      const gray = luminance(source, target);
      let red = Math.round(source[target] / step) * step;
      let green = Math.round(source[target + 1] / step) * step;
      let blue = Math.round(source[target + 2] / step) * step;
      red = clamp(gray + (red - gray) * 1.45);
      green = clamp(gray + (green - gray) * 1.45);
      blue = clamp(gray + (blue - gray) * 1.45);
      const color = edge ? [18, 18, 24] : [red, green, blue];
      data[target] = mixChannel(source[target], color[0], amount);
      data[target + 1] = mixChannel(source[target + 1], color[1], amount);
      data[target + 2] = mixChannel(source[target + 2], color[2], amount);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function addDateStamp(ctx, width, height) {
  const now = new Date();
  const value = `${String(now.getFullYear()).slice(-2)}  ${String(now.getMonth() + 1).padStart(2, "0")}  ${String(now.getDate()).padStart(2, "0")}`;
  const size = Math.max(18, Math.round(width * 0.032));
  const x = width - Math.round(width * 0.045);
  const y = height - Math.round(height * 0.05);
  ctx.save();
  ctx.font = `700 ${size}px "Courier New", monospace`;
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.shadowColor = "rgba(65, 20, 0, 0.72)";
  ctx.shadowBlur = Math.max(2, size * 0.16);
  ctx.fillStyle = "#ff9c4a";
  ctx.fillText(value, x, y);
  ctx.restore();
}

function addPixelEffects(ctx, width, height, preset, strength, grain, seed) {
  if (grain <= 0 && preset !== "analog" && preset !== "ccd") return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const source = new Uint8ClampedArray(imageData.data);
  const data = imageData.data;
  const random = mulberry32(seed);
  const grainAmount = grain * (preset === "analog" ? 44 : 30);
  const shift = Math.max(1, Math.round(width * 0.004 * strength));

  for (let y = 0; y < height; y += 1) {
    const tvJitter = preset === "analog" && random() > 0.985 ? Math.round((random() - 0.5) * width * 0.035 * strength) : 0;
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const noise = (random() - 0.5) * grainAmount;

      if (preset === "analog") {
        const redX = clamp(x + shift + tvJitter, 0, width - 1);
        const blueX = clamp(x - shift + tvJitter, 0, width - 1);
        data[index] = clamp(source[(y * width + redX) * 4] + noise);
        data[index + 1] = clamp(source[index + 1] + noise * 0.72);
        data[index + 2] = clamp(source[(y * width + blueX) * 4 + 2] + noise);
      } else {
        data[index] = clamp(data[index] + noise);
        data[index + 1] = clamp(data[index + 1] + noise);
        data[index + 2] = clamp(data[index + 2] + noise);
      }

      if (preset === "ccd") {
        data[index] = clamp(data[index] - 7 * strength);
        data[index + 2] = clamp(data[index + 2] + 15 * strength);
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function stickerDataUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function stickerBaseScale(sticker) {
  return sticker?.group === "pixel" ? 0.2 : 0.18;
}

function initializeStickerAssets() {
  stickerCatalog.forEach((sticker) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (state.image && state.stickers.some((item) => item.assetId === sticker.id)) scheduleRender();
    };
    image.src = stickerDataUrl(sticker.svg);
    stickerAssets.set(sticker.id, image);
  });
  renderStickerTray();
  updateStickerUI();
}

function renderStickerTray() {
  elements.stickerTray.replaceChildren();
  const visibleStickers = stickerCatalog.filter((sticker) => sticker.group === state.stickerGroup);
  visibleStickers.forEach((sticker) => {
    const button = document.createElement("button");
    button.className = "sticker-choice";
    button.type = "button";
    button.dataset.sticker = sticker.id;
    button.dataset.group = sticker.group;
    button.setAttribute("aria-label", `${sticker.label} 추가`);
    button.disabled = !state.image;
    const image = document.createElement("img");
    image.src = stickerDataUrl(sticker.svg);
    image.alt = "";
    image.loading = "eager";
    button.append(image);
    button.addEventListener("click", () => addSticker(sticker.id));
    elements.stickerTray.append(button);
  });
}

function selectedSticker() {
  return state.stickers.find((sticker) => sticker.uid === state.selectedStickerId) || null;
}

function setNormalizedRangeFill(input) {
  const min = Number(input.min);
  const max = Number(input.max);
  const value = Number(input.value);
  input.style.setProperty("--range-value", `${((value - min) / (max - min)) * 100}%`);
}

function updateStickerUI() {
  const selected = selectedSticker();
  elements.randomStickers.disabled = !state.image;
  elements.clearStickers.disabled = !state.image || state.stickers.length === 0;
  $$(".sticker-choice", elements.stickerTray).forEach((button) => {
    button.disabled = !state.image;
  });
  elements.stickerTools.hidden = !selected;
  if (!selected) return;
  const definition = stickerDefinitions.get(selected.assetId);
  const percent = Math.round(selected.scale / stickerBaseScale(definition) * 100);
  const degrees = Math.round(selected.rotation * 180 / Math.PI);
  elements.stickerSize.value = String(percent);
  elements.stickerSizeValue.textContent = `${percent}%`;
  elements.stickerRotation.value = String(degrees);
  elements.stickerRotationValue.textContent = `${degrees}°`;
  setNormalizedRangeFill(elements.stickerSize);
  setNormalizedRangeFill(elements.stickerRotation);
}

function makeStickerItem(sticker, x, y, scale = stickerBaseScale(sticker), rotation = 0) {
  return {
    uid: `sticker-${++state.stickerCounter}`,
    assetId: sticker.id,
    x,
    y,
    scale,
    rotation,
  };
}

function addSticker(assetId) {
  if (!state.image) {
    showToast("사진을 먼저 불러와 주세요.");
    return;
  }
  const definition = stickerDefinitions.get(assetId);
  if (!definition) return;
  const offsetIndex = state.stickers.length % 5;
  const item = makeStickerItem(
    definition,
    0.5 + (offsetIndex - 2) * 0.035,
    0.5 + ((offsetIndex + 1) % 3 - 1) * 0.035,
    stickerBaseScale(definition),
    (offsetIndex - 2) * 0.055,
  );
  state.stickers.push(item);
  state.selectedStickerId = item.uid;
  updateStickerUI();
  scheduleRender();
}

function randomizeStickers() {
  if (!state.image) return;
  const pack = stickerCatalog.filter((sticker) => sticker.group === state.stickerGroup);
  const shuffled = [...pack].sort(() => Math.random() - 0.5).slice(0, Math.min(6, pack.length));
  const positions = [
    [0.2, 0.22], [0.5, 0.18], [0.79, 0.26],
    [0.22, 0.68], [0.54, 0.76], [0.82, 0.67],
  ];
  state.stickers = shuffled.map((sticker, index) => makeStickerItem(
    sticker,
    clamp(positions[index][0] + (Math.random() - 0.5) * 0.08, 0.1, 0.9),
    clamp(positions[index][1] + (Math.random() - 0.5) * 0.08, 0.1, 0.9),
    stickerBaseScale(sticker) * (0.78 + Math.random() * 0.55),
    (Math.random() - 0.5) * 0.48,
  ));
  state.selectedStickerId = state.stickers.at(-1)?.uid || null;
  updateStickerUI();
  scheduleRender();
  showToast(`${state.stickerGroup === "pixel" ? "픽셀" : "홀로"} 스티커를 랜덤 배치했어요.`);
}

function clearStickers() {
  if (state.stickers.length === 0) return;
  state.stickers = [];
  state.selectedStickerId = null;
  state.draggingSticker = null;
  updateStickerUI();
  scheduleRender();
  showToast("스티커를 모두 지웠어요.");
}

function deleteSelectedSticker() {
  if (!state.selectedStickerId) return;
  state.stickers = state.stickers.filter((sticker) => sticker.uid !== state.selectedStickerId);
  state.selectedStickerId = null;
  state.draggingSticker = null;
  updateStickerUI();
  scheduleRender();
}

function stickerPixelSize(sticker, width, height) {
  return Math.min(width, height) * sticker.scale;
}

function drawStickers(ctx, width, height, showSelection) {
  const previousSmoothing = ctx.imageSmoothingEnabled;
  state.stickers.forEach((sticker) => {
    const definition = stickerDefinitions.get(sticker.assetId);
    const asset = stickerAssets.get(sticker.assetId);
    if (!definition || !asset?.complete || !asset.naturalWidth) return;
    const size = stickerPixelSize(sticker, width, height);
    ctx.save();
    ctx.translate(sticker.x * width, sticker.y * height);
    ctx.rotate(sticker.rotation);
    ctx.imageSmoothingEnabled = definition.group !== "pixel";
    if (ctx.imageSmoothingEnabled) ctx.imageSmoothingQuality = "high";
    ctx.drawImage(asset, -size / 2, -size / 2, size, size);

    if (showSelection && sticker.uid === state.selectedStickerId) {
      const lineWidth = Math.max(2, Math.min(width, height) * 0.0025);
      const handle = Math.max(7, Math.min(width, height) * 0.009);
      ctx.setLineDash([lineWidth * 3, lineWidth * 2]);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = "#77d5dc";
      ctx.strokeRect(-size / 2, -size / 2, size, size);
      ctx.setLineDash([]);
      ctx.fillStyle = "#f08abc";
      ctx.strokeStyle = "#171827";
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([x, y]) => {
        ctx.fillRect(x * size / 2 - handle / 2, y * size / 2 - handle / 2, handle, handle);
        ctx.strokeRect(x * size / 2 - handle / 2, y * size / 2 - handle / 2, handle, handle);
      });
    }
    ctx.restore();
  });
  ctx.imageSmoothingEnabled = previousSmoothing;
}

function canvasPointFromEvent(event) {
  if (!elements.canvas.width || !elements.canvas.height) return null;
  const rect = elements.canvas.getBoundingClientRect();
  const scale = Math.min(rect.width / elements.canvas.width, rect.height / elements.canvas.height);
  const shownWidth = elements.canvas.width * scale;
  const shownHeight = elements.canvas.height * scale;
  const offsetX = (rect.width - shownWidth) / 2;
  const offsetY = (rect.height - shownHeight) / 2;
  const cssX = event.clientX - rect.left - offsetX;
  const cssY = event.clientY - rect.top - offsetY;
  if (cssX < 0 || cssY < 0 || cssX > shownWidth || cssY > shownHeight) return null;
  return { x: cssX / scale, y: cssY / scale };
}

function findStickerAt(point) {
  for (let index = state.stickers.length - 1; index >= 0; index -= 1) {
    const sticker = state.stickers[index];
    const size = stickerPixelSize(sticker, elements.canvas.width, elements.canvas.height);
    const dx = point.x - sticker.x * elements.canvas.width;
    const dy = point.y - sticker.y * elements.canvas.height;
    const cos = Math.cos(-sticker.rotation);
    const sin = Math.sin(-sticker.rotation);
    const localX = dx * cos - dy * sin;
    const localY = dx * sin + dy * cos;
    if (Math.abs(localX) <= size / 2 && Math.abs(localY) <= size / 2) return sticker;
  }
  return null;
}

function beginStickerDrag(event) {
  if (!state.image || event.button !== 0 || state.comparing) return;
  const point = canvasPointFromEvent(event);
  if (!point) return;
  const hit = findStickerAt(point);
  if (!hit) {
    if (state.selectedStickerId) {
      state.selectedStickerId = null;
      updateStickerUI();
      scheduleRender();
    }
    return;
  }

  const index = state.stickers.indexOf(hit);
  if (index !== state.stickers.length - 1) {
    state.stickers.splice(index, 1);
    state.stickers.push(hit);
  }
  state.selectedStickerId = hit.uid;
  state.draggingSticker = {
    pointerId: event.pointerId,
    uid: hit.uid,
    offsetX: point.x - hit.x * elements.canvas.width,
    offsetY: point.y - hit.y * elements.canvas.height,
  };
  elements.canvas.setPointerCapture(event.pointerId);
  elements.canvas.classList.add("is-dragging-sticker");
  event.preventDefault();
  updateStickerUI();
  scheduleRender();
}

function moveSticker(event) {
  const drag = state.draggingSticker;
  if (!drag || drag.pointerId !== event.pointerId) return;
  const point = canvasPointFromEvent(event);
  const sticker = state.stickers.find((item) => item.uid === drag.uid);
  if (!point || !sticker) return;
  const size = stickerPixelSize(sticker, elements.canvas.width, elements.canvas.height);
  const halfX = size / 2 / elements.canvas.width;
  const halfY = size / 2 / elements.canvas.height;
  sticker.x = clamp((point.x - drag.offsetX) / elements.canvas.width, halfX * 0.45, 1 - halfX * 0.45);
  sticker.y = clamp((point.y - drag.offsetY) / elements.canvas.height, halfY * 0.45, 1 - halfY * 0.45);
  event.preventDefault();
  scheduleRender();
}

function endStickerDrag(event) {
  if (!state.draggingSticker || state.draggingSticker.pointerId !== event.pointerId) return;
  if (elements.canvas.hasPointerCapture(event.pointerId)) elements.canvas.releasePointerCapture(event.pointerId);
  state.draggingSticker = null;
  elements.canvas.classList.remove("is-dragging-sticker");
}

function drawProcessed(targetCanvas, maxSide = 1500, originalOnly = false) {
  if (!state.image) return null;

  const crop = getCrop(state.image.naturalWidth, state.image.naturalHeight, state.ratio);
  const output = getOutputSize(crop, maxSide);
  targetCanvas.width = output.width;
  targetCanvas.height = output.height;
  const ctx = targetCanvas.getContext("2d", { willReadFrequently: true });
  ctx.clearRect(0, 0, output.width, output.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.filter = originalOnly ? "none" : presetFilter(state.filter, state.strength);
  ctx.drawImage(
    state.image,
    crop.sx,
    crop.sy,
    crop.sw,
    crop.sh,
    0,
    0,
    output.width,
    output.height,
  );
  ctx.filter = "none";

  if (!originalOnly) {
    if (state.filter === "softcam") {
      addBloom(ctx, targetCanvas, output.width, output.height, state.strength, "#ffeef5");
      addColorWash(ctx, output.width, output.height, "#f6c9d6", 0.055 * state.strength, "screen");
      addVignette(ctx, output.width, output.height, 0.12 * state.strength);
    }

    if (state.filter === "y2k") {
      addColorWash(ctx, output.width, output.height, "#d8a72d", 0.2 * state.strength, "color");
      addFlash(ctx, output.width, output.height, 0.42 * state.strength);
      addVignette(ctx, output.width, output.height, 0.32 * state.strength);
    }

    if (state.filter === "analog") {
      addColorWash(ctx, output.width, output.height, "#523c70", 0.08 * state.strength, "color");
      addVignette(ctx, output.width, output.height, 0.42 * state.strength);
    }

    if (state.filter === "disposable") {
      addFlash(ctx, output.width, output.height, state.strength);
      addColorWash(ctx, output.width, output.height, "#e77b4d", 0.07 * state.strength, "color");
      addVignette(ctx, output.width, output.height, 0.48 * state.strength);
    }

    if (state.filter === "ccd") {
      addBloom(ctx, targetCanvas, output.width, output.height, state.strength * 0.58, "#c7dcff");
      addColorWash(ctx, output.width, output.height, "#527cbe", 0.12 * state.strength, "color");
      addVignette(ctx, output.width, output.height, 0.22 * state.strength);
    }

    if (state.filter === "liquify") {
      applyNeonLiquify(ctx, output.width, output.height, state.strength, state.seed);
      addVignette(ctx, output.width, output.height, 0.34 * state.strength);
    }

    if (state.filter === "signal") {
      applySignalCrash(ctx, output.width, output.height, state.strength, state.seed);
      addVignette(ctx, output.width, output.height, 0.22 * state.strength);
    }

    if (state.filter === "frameecho") {
      applyFrameEcho(ctx, output.width, output.height, state.strength, state.seed);
      addVignette(ctx, output.width, output.height, 0.18 * state.strength);
    }

    if (state.filter === "prism") {
      applyPrismEcho(ctx, output.width, output.height, state.strength);
    }

    if (state.filter === "thermal") {
      applyThermal(ctx, output.width, output.height, state.strength);
      addVignette(ctx, output.width, output.height, 0.16 * state.strength);
    }

    if (state.filter === "xerox") applyXerox(ctx, output.width, output.height, state.strength, state.seed);
    if (state.filter === "riso") applyRiso(ctx, output.width, output.height, state.strength);
    if (state.filter === "comic") applyComic(ctx, output.width, output.height, state.strength);
    if (state.filter === "holo") applyHoloDream(ctx, output.width, output.height, state.strength);

    addPixelEffects(ctx, output.width, output.height, state.filter, state.strength, state.grain, state.seed);
    if (state.filter === "analog") addScanlines(ctx, output.width, output.height, state.strength);
    drawStickers(ctx, output.width, output.height, targetCanvas === elements.canvas);
    if (state.showDate) addDateStamp(ctx, output.width, output.height);
  }

  return output;
}

function scheduleRender() {
  if (!state.image) return;
  if (state.renderFrame) cancelAnimationFrame(state.renderFrame);
  elements.processing.hidden = false;
  state.renderFrame = requestAnimationFrame(() => {
    const output = drawProcessed(elements.canvas, 1500, state.comparing);
    elements.statusSize.textContent = `${output.width} × ${output.height} PX`;
    elements.processing.hidden = true;
    state.renderFrame = null;
  });
}

function updateLoadedUI(file) {
  elements.emptyState.hidden = true;
  elements.dropZone.classList.add("has-image");
  elements.resetButton.disabled = false;
  elements.compareButton.disabled = false;
  elements.downloadButton.disabled = false;
  const sizeMb = file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "CLIPBOARD";
  elements.fileMeta.textContent = `${state.fileName.toUpperCase()} · ${state.image.naturalWidth} × ${state.image.naturalHeight} · ${sizeMb}`;
  updateStickerUI();
}

async function loadFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    showToast("JPG, PNG 또는 WEBP 이미지를 선택해 주세요.");
    return;
  }

  if (file.size > 30 * 1024 * 1024) {
    showToast("이미지는 30MB보다 작아야 해요.");
    return;
  }

  const url = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = "async";
  image.onload = () => {
    if (state.image?.src?.startsWith("blob:")) URL.revokeObjectURL(state.image.src);
    state.image = image;
    state.fileName = file.name || "pasted-image.png";
    state.seed = Math.floor(Math.random() * 100000);
    state.stickers = [];
    state.selectedStickerId = null;
    state.draggingSticker = null;
    updateLoadedUI(file);
    scheduleRender();
    showToast("사진을 불러왔어요.");
  };
  image.onerror = () => {
    URL.revokeObjectURL(url);
    showToast("이미지를 읽지 못했어요. 다른 파일을 시도해 주세요.");
  };
  image.src = url;
}

function resetEditor() {
  if (state.image?.src?.startsWith("blob:")) URL.revokeObjectURL(state.image.src);
  state.image = null;
  state.fileName = "";
  state.stickers = [];
  state.selectedStickerId = null;
  state.draggingSticker = null;
  elements.canvas.width = 0;
  elements.canvas.height = 0;
  elements.emptyState.hidden = false;
  elements.dropZone.classList.remove("has-image");
  elements.fileInput.value = "";
  elements.fileMeta.textContent = "이미지 대기 중";
  elements.statusSize.textContent = "0 × 0 PX";
  elements.resetButton.disabled = true;
  elements.compareButton.disabled = true;
  elements.downloadButton.disabled = true;
  updateStickerUI();
  showToast("편집기를 비웠어요.");
}

function setComparing(active) {
  if (!state.image || state.comparing === active) return;
  state.comparing = active;
  elements.compareButton.setAttribute("aria-pressed", String(active));
  elements.compareButton.classList.toggle("is-active", active);
  scheduleRender();
}

function downloadImage() {
  if (!state.image) return;
  elements.downloadButton.disabled = true;
  elements.downloadButton.textContent = "렌더링 중...";
  requestAnimationFrame(() => {
    const exportCanvas = document.createElement("canvas");
    drawProcessed(exportCanvas, 3200, false);
    exportCanvas.toBlob(
      (blob) => {
        if (!blob) {
          showToast("저장에 실패했어요. 다시 시도해 주세요.");
          elements.downloadButton.disabled = false;
          elements.downloadButton.textContent = "PNG로 저장하기";
          return;
        }
        const link = document.createElement("a");
        const safeBase = state.fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9가-힣_-]+/g, "-");
        link.download = `${safeBase || "memory"}-${state.filter}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        elements.downloadButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0 5-5m-5 5-5-5M5 19h14" /></svg>PNG로 저장하기';
        elements.downloadButton.disabled = false;
        showToast(`${filterNames[state.filter]} 필터로 저장했어요.`);
      },
      "image/png",
    );
  });
}

elements.uploadButton.addEventListener("click", (event) => {
  event.stopPropagation();
  elements.fileInput.click();
});

elements.dropZone.addEventListener("click", () => {
  if (!state.image) elements.fileInput.click();
});

elements.dropZone.addEventListener("keydown", (event) => {
  if (!state.image && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    elements.fileInput.click();
  }
});

elements.fileInput.addEventListener("change", () => loadFile(elements.fileInput.files[0]));

["dragenter", "dragover"].forEach((type) => {
  elements.dropZone.addEventListener(type, (event) => {
    event.preventDefault();
    elements.dropZone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((type) => {
  elements.dropZone.addEventListener(type, (event) => {
    event.preventDefault();
    elements.dropZone.classList.remove("is-dragging");
  });
});

elements.dropZone.addEventListener("drop", (event) => loadFile(event.dataTransfer.files[0]));

window.addEventListener("paste", (event) => {
  const imageItem = [...event.clipboardData.items].find((item) => item.type.startsWith("image/"));
  if (imageItem) loadFile(imageItem.getAsFile());
});

elements.filterCards.forEach((card) => {
  card.addEventListener("click", () => {
    state.filter = card.dataset.filter;
    elements.filterCards.forEach((item) => {
      const selected = item === card;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-checked", String(selected));
    });
    scheduleRender();
  });
});

elements.strengthRange.addEventListener("input", () => {
  state.strength = Number(elements.strengthRange.value) / 100;
  elements.strengthValue.textContent = `${elements.strengthRange.value}%`;
  setRangeFill(elements.strengthRange);
  scheduleRender();
});

elements.grainRange.addEventListener("input", () => {
  state.grain = Number(elements.grainRange.value) / 100;
  elements.grainValue.textContent = `${elements.grainRange.value}%`;
  setRangeFill(elements.grainRange);
  scheduleRender();
});

elements.ratioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.ratio = button.dataset.ratio;
    elements.ratioButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    scheduleRender();
  });
});

elements.dateToggle.addEventListener("change", () => {
  state.showDate = elements.dateToggle.checked;
  scheduleRender();
});

elements.stickerTabs.forEach((button) => {
  button.addEventListener("click", () => {
    state.stickerGroup = button.dataset.stickerGroup;
    elements.stickerTabs.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-selected", String(selected));
    });
    renderStickerTray();
  });
});

elements.randomStickers.addEventListener("click", randomizeStickers);
elements.clearStickers.addEventListener("click", clearStickers);
elements.deleteSticker.addEventListener("click", deleteSelectedSticker);

elements.stickerSize.addEventListener("input", () => {
  const sticker = selectedSticker();
  if (!sticker) return;
  const definition = stickerDefinitions.get(sticker.assetId);
  sticker.scale = stickerBaseScale(definition) * Number(elements.stickerSize.value) / 100;
  elements.stickerSizeValue.textContent = `${elements.stickerSize.value}%`;
  setNormalizedRangeFill(elements.stickerSize);
  scheduleRender();
});

elements.stickerRotation.addEventListener("input", () => {
  const sticker = selectedSticker();
  if (!sticker) return;
  const degrees = Number(elements.stickerRotation.value);
  sticker.rotation = degrees * Math.PI / 180;
  elements.stickerRotationValue.textContent = `${degrees}°`;
  setNormalizedRangeFill(elements.stickerRotation);
  scheduleRender();
});

elements.canvas.addEventListener("pointerdown", beginStickerDrag);
elements.canvas.addEventListener("pointermove", moveSticker);
elements.canvas.addEventListener("pointerup", endStickerDrag);
elements.canvas.addEventListener("pointercancel", endStickerDrag);

window.addEventListener("keydown", (event) => {
  if (!["Delete", "Backspace"].includes(event.key) || !state.selectedStickerId) return;
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  event.preventDefault();
  deleteSelectedSticker();
});

["pointerdown", "keydown"].forEach((type) => {
  elements.compareButton.addEventListener(type, (event) => {
    if (type === "keydown" && ![" ", "Enter"].includes(event.key)) return;
    if (type === "keydown") event.preventDefault();
    setComparing(true);
  });
});

["pointerup", "pointerleave", "blur", "keyup"].forEach((type) => {
  elements.compareButton.addEventListener(type, () => setComparing(false));
});

elements.resetButton.addEventListener("click", resetEditor);
elements.downloadButton.addEventListener("click", downloadImage);

setRangeFill(elements.strengthRange);
setRangeFill(elements.grainRange);
initializeStickerAssets();
