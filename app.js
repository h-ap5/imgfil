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
  liquifyControls: $("#liquify-controls"),
  liquifyModeButtons: $$('[data-liquify-mode]'),
  liquifyBrushTools: $("#liquify-brush-tools"),
  liquifyBrushSize: $("#liquify-brush-size"),
  liquifyBrushSizeValue: $("#liquify-brush-size-value"),
  undoLiquify: $("#undo-liquify"),
  clearLiquify: $("#clear-liquify"),
  patternControls: $("#pattern-controls"),
  patternPhase: $("#pattern-phase"),
  patternPhaseValue: $("#pattern-phase-value"),
  randomizePattern: $("#randomize-pattern"),
  ratioButtons: $$("[data-ratio]"),
  formatButtons: $$('[data-format]'),
  dateToggle: $("#date-toggle"),
  dateInput: $("#date-input"),
  fileMeta: $("#file-meta"),
  statusSize: $("#status-size"),
  processing: $("#processing-indicator"),
  toast: $("#toast"),
  stickerTray: $("#sticker-tray"),
  stickerTabs: $$('[data-sticker-group]'),
  uploadSticker: $("#upload-sticker"),
  stickerFileInput: $("#sticker-file-input"),
  randomStickers: $("#random-stickers"),
  clearStickers: $("#clear-stickers"),
  stickerTools: $("#sticker-tools"),
  stickerSize: $("#sticker-size"),
  stickerSizeValue: $("#sticker-size-value"),
  stickerRotation: $("#sticker-rotation"),
  stickerRotationValue: $("#sticker-rotation-value"),
  deleteSticker: $("#delete-sticker"),
  cameraOverlayButtons: $$('[data-camera-overlay]'),
  rotateCameraLeft: $("#rotate-camera-left"),
  rotateCameraRight: $("#rotate-camera-right"),
  cameraRotationValue: $("#camera-rotation-value"),
  filmStripButtons: $$('[data-film-strip]'),
  filmStripTools: $("#film-strip-tools"),
  filmFrameCount: $("#film-frame-count"),
  filmFrameCountValue: $("#film-frame-count-value"),
  filmFrameInput: $("#film-frame-input"),
  filmSlotInput: $("#film-slot-input"),
  uploadFilmFrames: $("#upload-film-frames"),
  clearFilmFrames: $("#clear-film-frames"),
  filmFrameStatus: $("#film-frame-status"),
  filmSlotList: $("#film-slot-list"),
};

const state = {
  image: null,
  fileName: "",
  filter: "softcam",
  strength: 0.72,
  grain: 0.24,
  ratio: "original",
  showDate: false,
  dateValue: formatDateInputValue(new Date()),
  comparing: false,
  renderFrame: null,
  seed: Math.floor(Math.random() * 100000),
  stickerGroup: "holo",
  stickers: [],
  selectedStickerId: null,
  draggingSticker: null,
  stickerCounter: 0,
  customStickerCounter: 0,
  liquifyMode: "global",
  liquifyBrushSize: 0.18,
  liquifyStrokes: [],
  paintingLiquify: null,
  patternPhase: 0,
  exportFormat: "png",
  cameraOverlay: "off",
  cameraRotation: 0,
  filmStrip: false,
  filmFrameCount: 2,
  filmFrameImages: [],
  pendingFilmSlot: null,
};

const stickerCatalog = window.STICKER_CATALOG || [];
const customStickerCatalog = [];
const stickerDefinitions = new Map(stickerCatalog.map((sticker) => [sticker.id, sticker]));
const stickerAssets = new Map();
const customStickerUrls = new Set();
const filmFrameUrls = new Set();

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
  comic: "흑백 만화",
  holo: "홀로 드림",
  pixel: "픽셀 블록",
  summerfilm: "청량 필름",
  faded: "빛바랜 기억",
  softglow: "크림 뽀샤시",
  heartbokeh: "하트 보케",
};

function formatDateInputValue(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function clamp(value, min = 0, max = 255) {
  return Math.max(min, Math.min(max, value));
}

function softenedLiquifyStrength(strength) {
  if (strength <= 0.5) return strength;
  return 0.5 + (strength - 0.5) * 0.36;
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
  const liquid = softenedLiquifyStrength(strength);
  const filters = {
    softcam: `brightness(${1 + 0.09 * s}) contrast(${1 - 0.18 * s}) saturate(${1 - 0.25 * s}) sepia(${0.08 * s}) blur(${0.65 * s}px)`,
    y2k: `brightness(${1 + 0.03 * s}) contrast(${1 + 0.08 * s}) saturate(${1 - 0.3 * s}) sepia(${0.46 * s}) hue-rotate(${-8 * s}deg)`,
    analog: `brightness(${1 - 0.04 * s}) contrast(${1 + 0.25 * s}) saturate(${1 - 0.42 * s})`,
    disposable: `brightness(${1 + 0.02 * s}) contrast(${1 + 0.26 * s}) saturate(${1 - 0.12 * s}) sepia(${0.1 * s})`,
    ccd: `brightness(${1 - 0.02 * s}) contrast(${1 - 0.06 * s}) saturate(${1 - 0.16 * s}) hue-rotate(${4 * s}deg)`,
    liquify: `brightness(${1 - 0.05 * liquid}) contrast(${1 + 0.22 * liquid}) saturate(${1 + 0.42 * liquid})`,
    liquifybrush: "none",
    signal: `brightness(${1 - 0.04 * s}) contrast(${1 + 0.2 * s}) saturate(${1 + 0.28 * s})`,
    frameecho: `brightness(${1 - 0.03 * s}) contrast(${1 + 0.12 * s}) saturate(${1 + 0.18 * s})`,
    prism: `brightness(${1 + 0.08 * s}) contrast(${1 - 0.12 * s}) saturate(${1 + 0.12 * s})`,
    comic: `brightness(${1 + 0.02 * s}) contrast(${1 + 0.16 * s}) grayscale(1)`,
    holo: `brightness(${1 + 0.05 * s}) contrast(${1 + 0.03 * s}) saturate(${1 - 0.06 * s})`,
    pixel: `brightness(${1 + 0.015 * s}) contrast(${1 + 0.08 * s}) saturate(${1 + 0.12 * s})`,
    summerfilm: `brightness(${1 + 0.08 * s}) contrast(${1 + 0.09 * s}) saturate(${1 + 0.34 * s}) hue-rotate(${-3 * s}deg)`,
    faded: `brightness(${1 - 0.08 * s}) contrast(${1 - 0.24 * s}) saturate(${1 - 0.48 * s}) sepia(${0.08 * s})`,
    softglow: `brightness(${1 + 0.08 * s}) contrast(${1 - 0.2 * s}) saturate(${1 - 0.05 * s}) sepia(${0.04 * s})`,
    heartbokeh: `brightness(${1 - 0.03 * s}) contrast(${1 + 0.08 * s}) saturate(${1 + 0.12 * s})`,
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

function applyNeonLiquify(ctx, width, height, strength, seed, phaseOffset = 0) {
  strength = softenedLiquifyStrength(strength);
  if (strength <= 0.01) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const source = new Uint8ClampedArray(imageData.data);
  const data = imageData.data;
  const phase = (seed % 997) / 997 * Math.PI * 2 + phaseOffset;
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

function applyNeonBrush(ctx, width, height, strength, strokes, seed, phaseOffset = 0) {
  if (strength <= 0.01 || strokes.length === 0) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const source = new Uint8ClampedArray(imageData.data);
  const data = imageData.data;
  const minSide = Math.min(width, height);
  const basePhase = (seed % 991) / 991 * Math.PI * 2 + phaseOffset;
  const effectStrength = 0.38 + softenedLiquifyStrength(strength) * 0.62;

  strokes.forEach((stroke, strokeIndex) => {
    stroke.points.forEach((point, pointIndex) => {
      const centerX = point.x * width;
      const centerY = point.y * height;
      const radius = Math.max(8, point.radius * minSide);
      const startX = Math.max(0, Math.floor(centerX - radius));
      const endX = Math.min(width - 1, Math.ceil(centerX + radius));
      const startY = Math.max(0, Math.floor(centerY - radius));
      const endY = Math.min(height - 1, Math.ceil(centerY + radius));
      const motionX = point.dx * width;
      const motionY = point.dy * height;
      const motionLength = Math.hypot(motionX, motionY);
      const hasMotion = motionLength > 0.5;
      const pointKind = point.kind || (hasMotion ? "drag" : "wave");
      const directionX = hasMotion ? motionX / motionLength : 0;
      const directionY = hasMotion ? motionY / motionLength : 0;
      const normalX = -directionY;
      const normalY = directionX;
      const dragScale = 2.2 + effectStrength * 2.4;
      const phase = basePhase + strokeIndex * 0.83 + pointIndex * 0.27;
      const channelShift = Math.max(1, Math.round(
        radius * (pointKind === "twirl" ? 0.035 : 0.07) * effectStrength,
      ));

      for (let y = startY; y <= endY; y += 1) {
        const relativeY = y - centerY;
        for (let x = startX; x <= endX; x += 1) {
          const relativeX = x - centerX;
          const distance = Math.hypot(relativeX, relativeY);
          if (distance > radius) continue;
          const normalized = distance / radius;
          const falloff = Math.pow(1 - normalized, 2.15);
          let offsetX;
          let offsetY;
          if (pointKind === "twirl") {
            const hold = Math.min(3.2, Math.max(0.28, point.hold || 0.28));
            const angle = (0.16 + hold * 0.68) * effectStrength * Math.pow(falloff, 0.72);
            const cosine = Math.cos(angle);
            const sine = Math.sin(angle);
            const rotatedX = relativeX * cosine - relativeY * sine;
            const rotatedY = relativeX * sine + relativeY * cosine;
            offsetX = rotatedX - relativeX;
            offsetY = rotatedY - relativeY;
          } else if (hasMotion) {
            const along = relativeX * directionX + relativeY * directionY;
            const wave = Math.sin(along / radius * Math.PI * 3.8 + phase)
              * radius * 0.072 * effectStrength * falloff;
            offsetX = -motionX * dragScale * falloff + normalX * wave;
            offsetY = -motionY * dragScale * falloff + normalY * wave;
          } else {
            const inverseDistance = distance > 0.5 ? 1 / distance : 0;
            const radialX = relativeX * inverseDistance;
            const radialY = relativeY * inverseDistance;
            const ripple = Math.sin(normalized * Math.PI * 6.5 + phase)
              * radius * 0.11 * effectStrength * falloff;
            const sidestep = Math.cos(normalized * Math.PI * 4.5 + phase)
              * radius * 0.035 * effectStrength * falloff;
            offsetX = radialX * ripple - radialY * sidestep;
            offsetY = radialY * ripple + radialX * sidestep;
          }
          const sourceX = Math.round(clamp(
            x + offsetX,
            0,
            width - 1,
          ));
          const sourceY = Math.round(clamp(
            y + offsetY,
            0,
            height - 1,
          ));
          const redX = Math.round(clamp(sourceX + channelShift * falloff, 0, width - 1));
          const blueX = Math.round(clamp(sourceX - channelShift * falloff, 0, width - 1));
          const target = pixelIndex(x, y, width);
          const centerSource = pixelIndex(sourceX, sourceY, width);
          const redSource = pixelIndex(redX, sourceY, width);
          const blueSource = pixelIndex(blueX, sourceY, width);
          const mix = falloff * (pointKind === "twirl" ? 0.78 : 0.48 + effectStrength * 0.42);
          const red = clamp(source[redSource] * 1.18 + source[blueSource + 2] * 0.07);
          const green = clamp(source[centerSource + 1] * 0.72 + Math.min(red, source[blueSource + 2]) * 0.08);
          const blue = clamp(source[blueSource + 2] * 1.24 + source[redSource] * 0.08);
          // Always blend from the untouched frame. Re-blending already processed
          // pixels made overlapping brush samples look like stacked circular stamps.
          data[target] = mixChannel(source[target], red, mix);
          data[target + 1] = mixChannel(source[target + 1], green, mix);
          data[target + 2] = mixChannel(source[target + 2], blue, mix);
        }
      }
    });
  });
  ctx.putImageData(imageData, 0, 0);
}

function applySignalCrash(ctx, width, height, strength, seed, phaseOffset = 0) {
  if (strength <= 0.01) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const source = new Uint8ClampedArray(imageData.data);
  const data = imageData.data;
  const shift = Math.max(1, Math.round(width * (0.006 + strength * 0.022)));
  const random = mulberry32(seed + 71);

  for (let y = 0; y < height; y += 1) {
    const waveKick = Math.sin(y / Math.max(1, height) * Math.PI * 18 + phaseOffset) * shift * strength * 1.4;
    const lineKick = random() > 0.985 - strength * 0.008 ? Math.round((random() - 0.5) * shift * 6 + waveKick) : Math.round(waveKick);
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

function applyFrameEcho(ctx, width, height, strength, seed, phaseOffset = 0) {
  if (strength <= 0.01) return;
  const source = snapshotCanvas(ctx.canvas);
  const random = mulberry32(seed + 191);
  const phaseScale = 0.64 + (Math.sin(phaseOffset) + 1) * 0.28;
  const distance = width * (0.018 + strength * 0.13) * phaseScale;

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  for (let i = 4; i >= 1; i -= 1) {
    const direction = i % 2 === 0 ? 1 : -1;
    ctx.globalAlpha = (0.055 + strength * 0.045) * (5 - i);
    ctx.filter = `hue-rotate(${direction > 0 ? 165 : -18}deg) saturate(2.1) contrast(1.08)`;
    const lift = Math.cos(phaseOffset + i * 0.72) * height * 0.018 * strength;
    ctx.drawImage(source, direction * distance * i * 0.56, lift, width, height);
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
  const imageData = ctx.getImageData(0, 0, width, height);
  const source = new Uint8ClampedArray(imageData.data);
  const data = imageData.data;
  const amount = 0.08 + strength * 0.18;

  for (let y = 0; y < height; y += 1) {
    const ny = y / Math.max(1, height - 1);
    for (let x = 0; x < width; x += 1) {
      const index = pixelIndex(x, y, width);
      const nx = x / Math.max(1, width - 1);
      const light = luminance(source, index) / 255;
      const rose = 0.5 + 0.5 * Math.sin((nx * 1.2 + ny * 0.72) * Math.PI);
      const tint = [
        196 + rose * 48,
        224 - rose * 20 + light * 18,
        244 + rose * 8,
      ];
      const tintAmount = amount * (0.72 + light * 0.28);
      data[index] = mixChannel(source[index], tint[0], tintAmount);
      data[index + 1] = mixChannel(source[index + 1], tint[1], tintAmount);
      data[index + 2] = mixChannel(source[index + 2], tint[2], tintAmount);
    }
  }
  ctx.putImageData(imageData, 0, 0);

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const skyGlow = ctx.createRadialGradient(width * 0.16, height * 0.22, 0, width * 0.16, height * 0.22, Math.max(width, height) * 0.58);
  skyGlow.addColorStop(0, `rgba(108,232,255,${0.3 * strength})`);
  skyGlow.addColorStop(0.48, `rgba(170,212,255,${0.12 * strength})`);
  skyGlow.addColorStop(1, "rgba(170,212,255,0)");
  ctx.fillStyle = skyGlow;
  ctx.fillRect(0, 0, width, height);

  const roseGlow = ctx.createRadialGradient(width * 0.86, height * 0.72, 0, width * 0.86, height * 0.72, Math.max(width, height) * 0.52);
  roseGlow.addColorStop(0, `rgba(255,157,211,${0.25 * strength})`);
  roseGlow.addColorStop(0.52, `rgba(219,183,255,${0.11 * strength})`);
  roseGlow.addColorStop(1, "rgba(219,183,255,0)");
  ctx.fillStyle = roseGlow;
  ctx.fillRect(0, 0, width, height);

  const beam = ctx.createLinearGradient(0, height, width, 0);
  beam.addColorStop(0, "rgba(123,242,255,0)");
  beam.addColorStop(0.34, `rgba(197,247,255,${0.14 * strength})`);
  beam.addColorStop(0.48, `rgba(255,238,251,${0.34 * strength})`);
  beam.addColorStop(0.61, `rgba(221,191,255,${0.13 * strength})`);
  beam.addColorStop(1, "rgba(255,183,223,0)");
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(-width * 0.08, height * 0.66);
  ctx.lineTo(width * 0.72, -height * 0.08);
  ctx.lineTo(width * 1.04, height * 0.2);
  ctx.lineTo(width * 0.2, height * 0.94);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const sourceCanvas = snapshotCanvas(ctx.canvas);
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.035 + strength * 0.045;
  ctx.filter = `blur(${Math.max(1, width * 0.0022 * strength)}px) brightness(1.14)`;
  ctx.drawImage(sourceCanvas, 0, 0, width, height);
  ctx.restore();
}

function applyFadedMemory(ctx, width, height, strength) {
  if (strength <= 0.01) return;
  const imageData = ctx.getImageData(0, 0, width, height);
  const source = new Uint8ClampedArray(imageData.data);
  const data = imageData.data;
  const amount = 0.24 + strength * 0.54;

  for (let index = 0; index < data.length; index += 4) {
    const light = luminance(source, index);
    const target = [
      source[index] * 0.63 + light * 0.08 + 37,
      source[index + 1] * 0.65 + light * 0.07 + 42,
      source[index + 2] * 0.69 + light * 0.06 + 49,
    ];
    data[index] = mixChannel(source[index], target[0], amount);
    data[index + 1] = mixChannel(source[index + 1], target[1], amount);
    data[index + 2] = mixChannel(source[index + 2], target[2], amount);
  }
  ctx.putImageData(imageData, 0, 0);
  addColorWash(ctx, width, height, "#53666a", 0.1 * strength, "multiply");
  addColorWash(ctx, width, height, "#d8cabd", 0.04 * strength, "screen");
  addVignette(ctx, width, height, 0.16 * strength);
}

function applySoftGlow(ctx, width, height, strength) {
  if (strength <= 0.01) return;
  const source = snapshotCanvas(ctx.canvas);
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.12 + strength * 0.2;
  ctx.filter = `blur(${Math.max(4, Math.min(width, height) * (0.008 + strength * 0.012))}px) brightness(1.12)`;
  ctx.drawImage(source, 0, 0, width, height);
  ctx.filter = "none";

  const glow = ctx.createRadialGradient(
    width * 0.48,
    height * 0.42,
    0,
    width * 0.48,
    height * 0.42,
    Math.max(width, height) * 0.62,
  );
  glow.addColorStop(0, `rgba(255,250,239,${0.19 * strength})`);
  glow.addColorStop(0.48, `rgba(255,217,231,${0.1 * strength})`);
  glow.addColorStop(1, "rgba(222,205,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
  addColorWash(ctx, width, height, "#fff1e7", 0.045 * strength, "screen");
}

function addHeartPath(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.38);
  ctx.bezierCurveTo(x - size * 0.58, y + size * 0.02, x - size * 0.5, y - size * 0.42, x - size * 0.2, y - size * 0.42);
  ctx.bezierCurveTo(x, y - size * 0.42, x, y - size * 0.2, x, y - size * 0.12);
  ctx.bezierCurveTo(x, y - size * 0.2, x, y - size * 0.42, x + size * 0.2, y - size * 0.42);
  ctx.bezierCurveTo(x + size * 0.5, y - size * 0.42, x + size * 0.58, y + size * 0.02, x, y + size * 0.38);
  ctx.closePath();
}

function applyHeartBokeh(ctx, width, height, strength, seed) {
  if (strength <= 0.01) return;
  const source = snapshotCanvas(ctx.canvas);
  const sample = document.createElement("canvas");
  sample.width = Math.max(30, Math.min(64, Math.round(width / 20)));
  sample.height = Math.max(24, Math.round(sample.width * height / width));
  const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
  sampleCtx.drawImage(source, 0, 0, sample.width, sample.height);
  const pixels = sampleCtx.getImageData(0, 0, sample.width, sample.height).data;
  const candidates = [];
  const threshold = 198 - strength * 14;

  for (let y = 1; y < sample.height * 0.88; y += 1) {
    for (let x = 1; x < sample.width - 1; x += 1) {
      const index = pixelIndex(x, y, sample.width);
      const light = luminance(pixels, index);
      if (light < threshold) continue;
      let localPeak = true;
      for (let offsetY = -1; offsetY <= 1 && localPeak; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          if (offsetX === 0 && offsetY === 0) continue;
          if (luminance(pixels, pixelIndex(x + offsetX, y + offsetY, sample.width)) > light + 5) {
            localPeak = false;
            break;
          }
        }
      }
      if (localPeak) candidates.push({ x, y, light });
    }
  }

  candidates.sort((left, right) => right.light - left.light);
  const chosen = [];
  const limit = Math.round(7 + strength * 15);
  for (const candidate of candidates) {
    if (chosen.length >= limit) break;
    if (chosen.some((item) => Math.hypot(item.x - candidate.x, item.y - candidate.y) < 3.2)) continue;
    chosen.push(candidate);
  }

  addBloom(ctx, ctx.canvas, width, height, strength * 0.56, "#fff0d2");
  const random = mulberry32(seed + 887);
  const minSide = Math.min(width, height);
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  chosen.forEach((point, index) => {
    const x = (point.x + 0.5) / sample.width * width;
    const y = (point.y + 0.5) / sample.height * height;
    const brightness = (point.light - threshold) / Math.max(1, 255 - threshold);
    const size = minSide * (0.025 + strength * 0.034) * (0.74 + brightness * 0.52 + random() * 0.34);
    const lineWidth = Math.max(1.5, size * 0.1);
    const offsets = [
      { x: -lineWidth * 0.72, color: "rgba(255,36,68,0.78)" },
      { x: lineWidth * 0.72, color: "rgba(51,245,222,0.72)" },
      { x: 0, color: "rgba(255,244,176,0.9)" },
    ];
    offsets.forEach((edge, edgeIndex) => {
      ctx.save();
      ctx.translate(edge.x, edgeIndex === 1 ? lineWidth * 0.18 : 0);
      ctx.strokeStyle = edge.color;
      ctx.lineWidth = edgeIndex === 2 ? lineWidth * 0.7 : lineWidth;
      ctx.shadowColor = edge.color;
      ctx.shadowBlur = size * (0.22 + strength * 0.22);
      addHeartPath(ctx, x, y, size);
      ctx.stroke();
      ctx.restore();
    });
    if (index < 4) {
      const core = ctx.createRadialGradient(x, y, 0, x, y, size * 0.25);
      core.addColorStop(0, `rgba(255,255,235,${0.34 + brightness * 0.4})`);
      core.addColorStop(1, "rgba(255,235,184,0)");
      ctx.fillStyle = core;
      ctx.fillRect(x - size * 0.3, y - size * 0.3, size * 0.6, size * 0.6);
    }
  });
  ctx.restore();
  addVignette(ctx, width, height, 0.12 * strength);
}

function applyPixelate(ctx, width, height, strength) {
  if (strength <= 0.01) return;
  const blockSize = 2 + Math.round(strength * 22);
  const small = document.createElement("canvas");
  small.width = Math.max(1, Math.ceil(width / blockSize));
  small.height = Math.max(1, Math.ceil(height / blockSize));
  const smallCtx = small.getContext("2d");
  smallCtx.imageSmoothingEnabled = false;
  smallCtx.drawImage(ctx.canvas, 0, 0, small.width, small.height);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(small, 0, 0, small.width, small.height, 0, 0, width, height);
  ctx.restore();

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const levels = Math.max(3, 8 - Math.round(strength * 4));
  const step = 255 / (levels - 1);
  for (let index = 0; index < data.length; index += 4) {
    data[index] = Math.round(data[index] / step) * step;
    data[index + 1] = Math.round(data[index + 1] / step) * step;
    data[index + 2] = Math.round(data[index + 2] / step) * step;
  }
  ctx.putImageData(imageData, 0, 0);
}

function selectedDateParts() {
  const fallback = formatDateInputValue(new Date());
  const [year, month, day] = (state.dateValue || fallback).split("-");
  return { year, month, day };
}

function addVerticalFilmDate(ctx, width, height, strength) {
  const { year, month, day } = selectedDateParts();
  const date = `${year.slice(-2)}.${month}.${day}`;
  const size = Math.max(12, Math.round(Math.min(width, height) * 0.022));
  ctx.save();
  ctx.translate(width * 0.055, height * 0.86);
  ctx.rotate(-Math.PI / 2);
  ctx.font = `700 ${size}px "Courier New", monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = `rgba(255,92,35,${0.62 + strength * 0.32})`;
  ctx.shadowColor = "rgba(111,21,0,0.45)";
  ctx.shadowBlur = Math.max(1, size * 0.08);
  ctx.fillText(date, 0, 0);
  ctx.restore();
}

function applySummerFilm(ctx, width, height, strength) {
  if (strength <= 0.01) return;
  addColorWash(ctx, width, height, "#8ce7ee", 0.05 * strength, "screen");
  const leak = ctx.createLinearGradient(width * 0.58, 0, width, 0);
  leak.addColorStop(0, "rgba(255,70,28,0)");
  leak.addColorStop(0.55, `rgba(255,126,40,${0.08 * strength})`);
  leak.addColorStop(0.82, `rgba(255,52,29,${0.28 * strength})`);
  leak.addColorStop(1, `rgba(158,12,12,${0.38 * strength})`);
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = leak;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  const printFade = ctx.createLinearGradient(0, 0, 0, height);
  printFade.addColorStop(0, `rgba(15,20,22,${0.13 * strength})`);
  printFade.addColorStop(0.12, "rgba(15,20,22,0)");
  printFade.addColorStop(0.86, "rgba(15,20,22,0)");
  printFade.addColorStop(1, `rgba(15,20,22,${0.16 * strength})`);
  ctx.fillStyle = printFade;
  ctx.fillRect(0, 0, width, height);
  addVerticalFilmDate(ctx, width, height, strength);
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
  const edgeThreshold = 82 - strength * 12;
  const inkThreshold = 38 + strength * 10;
  const matrix = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

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
      const gray = clamp((light[y * width + x] - 128) * (1 + strength * 0.42) + 162);
      const screenThreshold = (matrix[(y % 4) * 4 + (x % 4)] + 0.5) / 16 * 255;
      const shadowInk = gray < inkThreshold;
      const toneInk = gray < 174 - strength * 8 && screenThreshold > gray + 92;
      const value = edge || shadowInk || toneInk ? 0 : 255;
      data[target] = value;
      data[target + 1] = value;
      data[target + 2] = value;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function addDateStamp(ctx, width, height) {
  const { year, month, day } = selectedDateParts();
  const value = `${year.slice(-2)}  ${month}  ${day}`;
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
  const grainAmount = grain * (preset === "analog" ? 64 : 46);
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

function allStickerDefinitions() {
  return [...stickerCatalog, ...customStickerCatalog];
}

function stickerBaseScale(sticker) {
  if (sticker?.group === "custom") return 0.24;
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
  const visibleStickers = allStickerDefinitions().filter((sticker) => sticker.group === state.stickerGroup);
  if (visibleStickers.length === 0) {
    const empty = document.createElement("p");
    empty.className = "sticker-empty";
    empty.textContent = "내 이미지를 추가하세요";
    elements.stickerTray.append(empty);
    updateStickerUI();
    return;
  }
  visibleStickers.forEach((sticker) => {
    const button = document.createElement("button");
    button.className = "sticker-choice";
    button.type = "button";
    button.dataset.sticker = sticker.id;
    button.dataset.group = sticker.group;
    button.setAttribute("aria-label", `${sticker.label} 추가`);
    button.disabled = !state.image;
    const image = document.createElement("img");
    image.src = sticker.src || stickerDataUrl(sticker.svg);
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
  const groupHasStickers = allStickerDefinitions().some((sticker) => sticker.group === state.stickerGroup);
  elements.uploadSticker.disabled = !state.image;
  elements.randomStickers.disabled = !state.image || !groupHasStickers;
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

function selectStickerGroup(group) {
  state.stickerGroup = group;
  elements.stickerTabs.forEach((button) => {
    const selected = button.dataset.stickerGroup === group;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-selected", String(selected));
  });
  renderStickerTray();
}

function loadCustomSticker(file) {
  if (!state.image) {
    showToast("사진을 먼저 불러와 주세요.");
    return;
  }
  if (!file || !file.type.startsWith("image/")) {
    showToast("PNG, WEBP, JPG 또는 SVG 이미지를 선택해 주세요.");
    return;
  }
  if (file.size > 15 * 1024 * 1024) {
    showToast("스티커 이미지는 15MB보다 작아야 해요.");
    return;
  }

  const url = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = "async";
  image.onload = () => {
    const id = `custom-${++state.customStickerCounter}`;
    const label = file.name.replace(/\.[^/.]+$/, "") || `내 스티커 ${state.customStickerCounter}`;
    const definition = {
      id,
      label,
      group: "custom",
      src: url,
      aspect: image.naturalWidth / image.naturalHeight,
    };
    customStickerUrls.add(url);
    customStickerCatalog.push(definition);
    stickerDefinitions.set(id, definition);
    stickerAssets.set(id, image);
    selectStickerGroup("custom");
    addSticker(id);
    elements.stickerFileInput.value = "";
    showToast("내 이미지를 스티커로 추가했어요.");
  };
  image.onerror = () => {
    URL.revokeObjectURL(url);
    elements.stickerFileInput.value = "";
    showToast("스티커 이미지를 읽지 못했어요.");
  };
  image.src = url;
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
  const pack = allStickerDefinitions().filter((sticker) => sticker.group === state.stickerGroup);
  if (pack.length === 0) return;
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
  elements.canvas.classList.remove("is-dragging-sticker", "is-resizing-sticker");
  updateStickerUI();
  scheduleRender();
  showToast("스티커를 모두 지웠어요.");
}

function deleteSelectedSticker() {
  if (!state.selectedStickerId) return;
  state.stickers = state.stickers.filter((sticker) => sticker.uid !== state.selectedStickerId);
  state.selectedStickerId = null;
  state.draggingSticker = null;
  elements.canvas.classList.remove("is-dragging-sticker", "is-resizing-sticker");
  updateStickerUI();
  scheduleRender();
}

function stickerPixelDimensions(sticker, width, height) {
  const definition = stickerDefinitions.get(sticker.assetId);
  const aspect = Math.max(0.08, Math.min(12, definition?.aspect || 1));
  const maxSize = Math.min(width, height) * sticker.scale;
  if (aspect >= 1) return { width: maxSize, height: maxSize / aspect };
  return { width: maxSize * aspect, height: maxSize };
}

function drawStickers(ctx, width, height, showSelection) {
  const previousSmoothing = ctx.imageSmoothingEnabled;
  state.stickers.forEach((sticker) => {
    const definition = stickerDefinitions.get(sticker.assetId);
    const asset = stickerAssets.get(sticker.assetId);
    if (!definition || !asset?.complete || !asset.naturalWidth) return;
    const dimensions = stickerPixelDimensions(sticker, width, height);
    ctx.save();
    ctx.translate(sticker.x * width, sticker.y * height);
    ctx.rotate(sticker.rotation);
    ctx.imageSmoothingEnabled = definition.group !== "pixel";
    if (ctx.imageSmoothingEnabled) ctx.imageSmoothingQuality = "high";
    ctx.drawImage(asset, -dimensions.width / 2, -dimensions.height / 2, dimensions.width, dimensions.height);

    if (showSelection && sticker.uid === state.selectedStickerId) {
      const lineWidth = Math.max(2, Math.min(width, height) * 0.0025);
      const handle = Math.max(7, Math.min(width, height) * 0.009);
      const deleteHandle = Math.max(20, Math.min(width, height) * 0.03);
      ctx.setLineDash([lineWidth * 3, lineWidth * 2]);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = "#77d5dc";
      ctx.strokeRect(-dimensions.width / 2, -dimensions.height / 2, dimensions.width, dimensions.height);
      ctx.setLineDash([]);
      ctx.fillStyle = "#f08abc";
      ctx.strokeStyle = "#171827";
      [[-1, -1], [-1, 1]].forEach(([x, y]) => {
        const handleX = x * dimensions.width / 2;
        const handleY = y * dimensions.height / 2;
        ctx.fillRect(handleX - handle / 2, handleY - handle / 2, handle, handle);
        ctx.strokeRect(handleX - handle / 2, handleY - handle / 2, handle, handle);
      });
      const resizeX = dimensions.width / 2;
      const resizeY = dimensions.height / 2;
      const resizeHandle = Math.max(handle * 1.65, Math.min(width, height) * 0.024);
      ctx.fillStyle = "#77d5dc";
      ctx.fillRect(resizeX - resizeHandle / 2, resizeY - resizeHandle / 2, resizeHandle, resizeHandle);
      ctx.strokeRect(resizeX - resizeHandle / 2, resizeY - resizeHandle / 2, resizeHandle, resizeHandle);
      ctx.strokeStyle = "#171827";
      ctx.lineWidth = Math.max(2, lineWidth);
      ctx.beginPath();
      ctx.moveTo(resizeX - resizeHandle * 0.2, resizeY + resizeHandle * 0.32);
      ctx.lineTo(resizeX + resizeHandle * 0.32, resizeY - resizeHandle * 0.2);
      ctx.moveTo(resizeX + resizeHandle * 0.02, resizeY + resizeHandle * 0.32);
      ctx.lineTo(resizeX + resizeHandle * 0.32, resizeY + resizeHandle * 0.02);
      ctx.stroke();
      const deleteX = dimensions.width / 2;
      const deleteY = -dimensions.height / 2;
      ctx.fillStyle = "#ef6b67";
      ctx.fillRect(deleteX - deleteHandle / 2, deleteY - deleteHandle / 2, deleteHandle, deleteHandle);
      ctx.strokeRect(deleteX - deleteHandle / 2, deleteY - deleteHandle / 2, deleteHandle, deleteHandle);
      ctx.strokeStyle = "#171827";
      ctx.lineWidth = Math.max(2, lineWidth * 1.25);
      ctx.beginPath();
      ctx.moveTo(deleteX - deleteHandle * 0.22, deleteY - deleteHandle * 0.22);
      ctx.lineTo(deleteX + deleteHandle * 0.22, deleteY + deleteHandle * 0.22);
      ctx.moveTo(deleteX + deleteHandle * 0.22, deleteY - deleteHandle * 0.22);
      ctx.lineTo(deleteX - deleteHandle * 0.22, deleteY + deleteHandle * 0.22);
      ctx.stroke();
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
    const dimensions = stickerPixelDimensions(sticker, elements.canvas.width, elements.canvas.height);
    const dx = point.x - sticker.x * elements.canvas.width;
    const dy = point.y - sticker.y * elements.canvas.height;
    const cos = Math.cos(-sticker.rotation);
    const sin = Math.sin(-sticker.rotation);
    const localX = dx * cos - dy * sin;
    const localY = dx * sin + dy * cos;
    if (Math.abs(localX) <= dimensions.width / 2 && Math.abs(localY) <= dimensions.height / 2) return sticker;
  }
  return null;
}

function isDeleteHandleHit(point) {
  const sticker = selectedSticker();
  if (!sticker) return false;
  const dimensions = stickerPixelDimensions(sticker, elements.canvas.width, elements.canvas.height);
  const localX = dimensions.width / 2;
  const localY = -dimensions.height / 2;
  const cos = Math.cos(sticker.rotation);
  const sin = Math.sin(sticker.rotation);
  const handleX = sticker.x * elements.canvas.width + localX * cos - localY * sin;
  const handleY = sticker.y * elements.canvas.height + localX * sin + localY * cos;
  const radius = Math.max(16, Math.min(elements.canvas.width, elements.canvas.height) * 0.022);
  return Math.hypot(point.x - handleX, point.y - handleY) <= radius;
}

function isResizeHandleHit(point) {
  const sticker = selectedSticker();
  if (!sticker) return false;
  const dimensions = stickerPixelDimensions(sticker, elements.canvas.width, elements.canvas.height);
  const localX = dimensions.width / 2;
  const localY = dimensions.height / 2;
  const cos = Math.cos(sticker.rotation);
  const sin = Math.sin(sticker.rotation);
  const handleX = sticker.x * elements.canvas.width + localX * cos - localY * sin;
  const handleY = sticker.y * elements.canvas.height + localX * sin + localY * cos;
  const radius = Math.max(16, Math.min(elements.canvas.width, elements.canvas.height) * 0.026);
  return Math.hypot(point.x - handleX, point.y - handleY) <= radius;
}

function beginStickerDrag(event) {
  if (!state.image || event.button !== 0 || state.comparing) return;
  const point = canvasPointFromEvent(event);
  if (!point) return;
  if (isResizeHandleHit(point)) {
    const sticker = selectedSticker();
    const centerX = sticker.x * elements.canvas.width;
    const centerY = sticker.y * elements.canvas.height;
    state.draggingSticker = {
      mode: "resize",
      pointerId: event.pointerId,
      uid: sticker.uid,
      startDistance: Math.max(1, Math.hypot(point.x - centerX, point.y - centerY)),
      startScale: sticker.scale,
    };
    elements.canvas.setPointerCapture(event.pointerId);
    elements.canvas.classList.add("is-resizing-sticker");
    event.preventDefault();
    return;
  }
  if (isDeleteHandleHit(point)) {
    event.preventDefault();
    deleteSelectedSticker();
    return;
  }
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
    mode: "move",
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
  if (drag.mode === "resize") {
    const definition = stickerDefinitions.get(sticker.assetId);
    const centerX = sticker.x * elements.canvas.width;
    const centerY = sticker.y * elements.canvas.height;
    const distance = Math.max(1, Math.hypot(point.x - centerX, point.y - centerY));
    const baseScale = stickerBaseScale(definition);
    sticker.scale = clamp(drag.startScale * distance / drag.startDistance, baseScale * 0.45, baseScale * 1.9);
    event.preventDefault();
    updateStickerUI();
    scheduleRender();
    return;
  }
  const dimensions = stickerPixelDimensions(sticker, elements.canvas.width, elements.canvas.height);
  const halfX = dimensions.width / 2 / elements.canvas.width;
  const halfY = dimensions.height / 2 / elements.canvas.height;
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
  elements.canvas.classList.remove("is-resizing-sticker");
}

function liquifyPointCount() {
  return state.liquifyStrokes.reduce((total, stroke) => total + stroke.points.length, 0);
}

function updateLiquifyUI() {
  const isLiquify = state.filter === "liquify";
  const isBrush = isLiquify && state.liquifyMode === "brush";
  elements.liquifyControls.hidden = !isLiquify;
  elements.liquifyBrushTools.hidden = !isBrush;
  elements.undoLiquify.disabled = state.liquifyStrokes.length === 0;
  elements.clearLiquify.disabled = state.liquifyStrokes.length === 0;
  elements.canvas.classList.toggle("is-liquify-brush", isBrush && Boolean(state.image));
}

function updatePatternUI() {
  const supportsPattern = ["liquify", "signal", "frameecho"].includes(state.filter);
  elements.patternControls.hidden = !supportsPattern;
  elements.patternPhase.value = String(state.patternPhase);
  elements.patternPhaseValue.textContent = `${state.patternPhase}°`;
  setNormalizedRangeFill(elements.patternPhase);
}

function updateOverlayUI() {
  const cameraEnabled = state.cameraOverlay !== "off";
  elements.rotateCameraLeft.disabled = !cameraEnabled;
  elements.rotateCameraRight.disabled = !cameraEnabled;
  elements.cameraRotationValue.textContent = `${state.cameraRotation}°`;
  elements.filmStripTools.hidden = !state.filmStrip;
  elements.uploadFilmFrames.disabled = !state.image;
  const activeFrames = state.filmFrameImages.slice(0, state.filmFrameCount).filter(Boolean).length;
  elements.clearFilmFrames.disabled = activeFrames === 0;
  elements.filmFrameCount.value = String(state.filmFrameCount);
  elements.filmFrameCountValue.textContent = `${state.filmFrameCount}칸`;
  elements.filmFrameStatus.textContent = activeFrames > 0
    ? `${activeFrames}장 지정 · 빈 칸은 현재 사진`
    : "현재 사진 반복";
  setNormalizedRangeFill(elements.filmFrameCount);
  renderFilmSlotList();
}

function clearFilmFrameImages() {
  filmFrameUrls.forEach((url) => URL.revokeObjectURL(url));
  filmFrameUrls.clear();
  state.filmFrameImages = [];
  state.pendingFilmSlot = null;
  elements.filmFrameInput.value = "";
  elements.filmSlotInput.value = "";
  updateOverlayUI();
}

function releaseFilmFrame(frame) {
  if (!frame) return;
  URL.revokeObjectURL(frame.url);
  filmFrameUrls.delete(frame.url);
}

function renderFilmSlotList() {
  elements.filmSlotList.replaceChildren();
  if (!state.filmStrip) return;
  for (let index = 0; index < state.filmFrameCount; index += 1) {
    const frame = state.filmFrameImages[index] || null;
    const row = document.createElement("div");
    row.className = "film-slot";

    const slotIndex = document.createElement("span");
    slotIndex.className = "film-slot-index";
    slotIndex.textContent = String(index + 1).padStart(2, "0");

    const picker = document.createElement("button");
    picker.className = "film-slot-pick";
    picker.type = "button";
    picker.disabled = !state.image;
    picker.setAttribute("aria-label", `${index + 1}번 칸 사진 선택`);
    const thumbnail = document.createElement("img");
    thumbnail.className = "film-slot-thumb";
    thumbnail.src = frame?.url || state.image?.src || "";
    thumbnail.alt = "";
    if (!frame) thumbnail.style.opacity = "0.48";
    picker.append(thumbnail);
    picker.addEventListener("click", () => {
      state.pendingFilmSlot = index;
      elements.filmSlotInput.click();
    });

    const name = document.createElement("span");
    name.className = "film-slot-name";
    name.textContent = frame?.name || "현재 사진";

    const moveLeft = document.createElement("button");
    moveLeft.type = "button";
    moveLeft.textContent = "←";
    moveLeft.disabled = !frame || index === 0;
    moveLeft.setAttribute("aria-label", `${index + 1}번 사진 왼쪽으로`);
    moveLeft.addEventListener("click", () => moveFilmFrame(index, index - 1));

    const moveRight = document.createElement("button");
    moveRight.type = "button";
    moveRight.textContent = "→";
    moveRight.disabled = !frame || index === state.filmFrameCount - 1;
    moveRight.setAttribute("aria-label", `${index + 1}번 사진 오른쪽으로`);
    moveRight.addEventListener("click", () => moveFilmFrame(index, index + 1));

    const clear = document.createElement("button");
    clear.type = "button";
    clear.textContent = "×";
    clear.disabled = !frame;
    clear.setAttribute("aria-label", `${index + 1}번 사진 비우기`);
    clear.addEventListener("click", () => clearFilmSlot(index));

    row.append(slotIndex, picker, name, moveLeft, moveRight, clear);
    elements.filmSlotList.append(row);
  }
}

function moveFilmFrame(from, to) {
  if (to < 0 || to >= state.filmFrameCount) return;
  [state.filmFrameImages[from], state.filmFrameImages[to]] = [state.filmFrameImages[to], state.filmFrameImages[from]];
  updateOverlayUI();
  scheduleRender();
}

function clearFilmSlot(index) {
  releaseFilmFrame(state.filmFrameImages[index]);
  state.filmFrameImages[index] = null;
  updateOverlayUI();
  scheduleRender();
}

function decodeFilmFrame(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    filmFrameUrls.add(url);
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve({ image, name: file.name, url });
    image.onerror = () => {
      URL.revokeObjectURL(url);
      filmFrameUrls.delete(url);
      reject(new Error(`Could not load ${file.name}`));
    };
    image.src = url;
  });
}

function loadFilmFrameImages(fileList) {
  if (!state.image) {
    showToast("사진을 먼저 불러와 주세요.");
    return;
  }
  const files = [...fileList].filter((file) => file.type.startsWith("image/")).slice(0, 6);
  if (files.length === 0 || files.some((file) => file.size > 30 * 1024 * 1024)) {
    showToast("30MB 이하 이미지 파일을 선택해 주세요.");
    return;
  }
  clearFilmFrameImages();
  Promise.all(files.map(decodeFilmFrame)).then((frames) => {
    state.filmFrameImages = frames;
    state.filmFrameCount = Math.max(state.filmFrameCount, frames.length);
    updateOverlayUI();
    scheduleRender();
    showToast(`${frames.length}장을 필름 칸에 넣었어요.`);
  }).catch(() => {
    clearFilmFrameImages();
    showToast("칸별 사진을 읽지 못했어요.");
  });
}

function loadFilmSlotImage(file, index) {
  if (!file || !file.type.startsWith("image/") || file.size > 30 * 1024 * 1024) {
    state.pendingFilmSlot = null;
    elements.filmSlotInput.value = "";
    showToast("30MB 이하 이미지 파일을 선택해 주세요.");
    return;
  }
  decodeFilmFrame(file).then((frame) => {
    releaseFilmFrame(state.filmFrameImages[index]);
    state.filmFrameImages[index] = frame;
    state.pendingFilmSlot = null;
    elements.filmSlotInput.value = "";
    updateOverlayUI();
    scheduleRender();
  }).catch(() => {
    state.pendingFilmSlot = null;
    elements.filmSlotInput.value = "";
    showToast("칸 사진을 읽지 못했어요.");
  });
}

function addLiquifyPoint(stroke, point, deltaX, deltaY, kind = "drag") {
  if (liquifyPointCount() >= 96) return false;
  const brushPoint = {
    x: point.x / elements.canvas.width,
    y: point.y / elements.canvas.height,
    dx: deltaX / elements.canvas.width,
    dy: deltaY / elements.canvas.height,
    radius: state.liquifyBrushSize,
    kind,
    hold: 0,
  };
  stroke.points.push(brushPoint);
  return brushPoint;
}

function stopLiquifyHold(painting) {
  if (!painting) return;
  window.clearTimeout(painting.holdTimeout);
  window.clearInterval(painting.holdInterval);
  painting.holdTimeout = null;
  painting.holdInterval = null;
}

function cancelActiveLiquifyPaint() {
  const painting = state.paintingLiquify;
  if (!painting) return;
  stopLiquifyHold(painting);
  if (elements.canvas.hasPointerCapture?.(painting.pointerId)) {
    elements.canvas.releasePointerCapture(painting.pointerId);
  }
  state.paintingLiquify = null;
  elements.canvas.classList.remove("is-painting-liquify");
}

function beginLiquifyPaint(event) {
  if (
    !state.image
    || state.filter !== "liquify"
    || state.liquifyMode !== "brush"
    || state.comparing
    || event.button !== 0
  ) return false;
  const point = canvasPointFromEvent(event);
  if (!point) return true;
  const stroke = { points: [] };
  if (liquifyPointCount() >= 96) {
    event.preventDefault();
    return true;
  }
  state.liquifyStrokes.push(stroke);
  const painting = {
    pointerId: event.pointerId,
    stroke,
    lastX: point.x,
    lastY: point.y,
    startX: point.x,
    startY: point.y,
    moved: false,
    holdPoint: null,
    holdTimeout: null,
    holdInterval: null,
  };
  state.paintingLiquify = painting;
  painting.holdTimeout = window.setTimeout(() => {
    if (state.paintingLiquify !== painting || painting.moved) return;
    const holdPoint = addLiquifyPoint(
      painting.stroke,
      { x: painting.startX, y: painting.startY },
      0,
      0,
      "twirl",
    );
    if (!holdPoint) return;
    painting.holdPoint = holdPoint;
    holdPoint.hold = 0.34;
    scheduleRender();
    painting.holdInterval = window.setInterval(() => {
      if (state.paintingLiquify !== painting || painting.moved) {
        stopLiquifyHold(painting);
        return;
      }
      holdPoint.hold = Math.min(3.2, holdPoint.hold + 0.16);
      scheduleRender();
    }, 90);
  }, 220);
  elements.canvas.setPointerCapture(event.pointerId);
  elements.canvas.classList.add("is-painting-liquify");
  event.preventDefault();
  updateLiquifyUI();
  return true;
}

function moveLiquifyPaint(event) {
  const painting = state.paintingLiquify;
  if (!painting || painting.pointerId !== event.pointerId) return false;
  const point = canvasPointFromEvent(event);
  if (!point) return true;
  const deltaX = point.x - painting.lastX;
  const deltaY = point.y - painting.lastY;
  const distance = Math.hypot(deltaX, deltaY);
  const spacing = Math.min(elements.canvas.width, elements.canvas.height)
    * Math.max(0.005, state.liquifyBrushSize * 0.08);
  if (distance < spacing) return true;
  stopLiquifyHold(painting);
  const steps = Math.min(10, Math.max(1, Math.ceil(distance / spacing)));
  let added = false;
  let previousX = painting.lastX;
  let previousY = painting.lastY;
  for (let step = 1; step <= steps; step += 1) {
    const nextPoint = {
      x: painting.lastX + deltaX * step / steps,
      y: painting.lastY + deltaY * step / steps,
    };
    if (!addLiquifyPoint(painting.stroke, nextPoint, nextPoint.x - previousX, nextPoint.y - previousY, "drag")) break;
    previousX = nextPoint.x;
    previousY = nextPoint.y;
    added = true;
  }
  if (added) {
    painting.lastX = point.x;
    painting.lastY = point.y;
    painting.moved = true;
    scheduleRender();
  }
  event.preventDefault();
  return true;
}

function endLiquifyPaint(event) {
  if (!state.paintingLiquify || state.paintingLiquify.pointerId !== event.pointerId) return false;
  const painting = state.paintingLiquify;
  stopLiquifyHold(painting);
  if (!painting.moved && !painting.holdPoint) {
    addLiquifyPoint(
      painting.stroke,
      { x: painting.startX, y: painting.startY },
      0,
      0,
      "wave",
    );
  }
  if (elements.canvas.hasPointerCapture(event.pointerId)) elements.canvas.releasePointerCapture(event.pointerId);
  state.paintingLiquify = null;
  elements.canvas.classList.remove("is-painting-liquify");
  updateLiquifyUI();
  scheduleRender();
  return true;
}

function handleCanvasPointerDown(event) {
  if (!beginLiquifyPaint(event)) beginStickerDrag(event);
}

function handleCanvasPointerMove(event) {
  if (!moveLiquifyPaint(event)) moveSticker(event);
}

function handleCanvasPointerEnd(event) {
  if (!endLiquifyPaint(event)) endStickerDrag(event);
}

function patternPhaseRadians() {
  return state.patternPhase * Math.PI / 180;
}

function applySelectedFilter(ctx, canvas, width, height, seed = state.seed) {
  const phase = patternPhaseRadians();

  if (state.filter === "softcam") {
    addBloom(ctx, canvas, width, height, state.strength, "#ffeef5");
    addColorWash(ctx, width, height, "#f6c9d6", 0.055 * state.strength, "screen");
    addVignette(ctx, width, height, 0.12 * state.strength);
  }

  if (state.filter === "y2k") {
    addColorWash(ctx, width, height, "#d8a72d", 0.2 * state.strength, "color");
    addFlash(ctx, width, height, 0.42 * state.strength);
    addVignette(ctx, width, height, 0.32 * state.strength);
  }

  if (state.filter === "analog") {
    addColorWash(ctx, width, height, "#523c70", 0.08 * state.strength, "color");
    addVignette(ctx, width, height, 0.42 * state.strength);
  }

  if (state.filter === "disposable") {
    addFlash(ctx, width, height, state.strength);
    addColorWash(ctx, width, height, "#e77b4d", 0.07 * state.strength, "color");
    addVignette(ctx, width, height, 0.48 * state.strength);
  }

  if (state.filter === "ccd") {
    addBloom(ctx, canvas, width, height, state.strength * 0.58, "#c7dcff");
    addColorWash(ctx, width, height, "#527cbe", 0.12 * state.strength, "color");
    addVignette(ctx, width, height, 0.22 * state.strength);
  }

  if (state.filter === "liquify") {
    if (state.liquifyMode === "brush") {
      applyNeonBrush(ctx, width, height, state.strength, state.liquifyStrokes, seed, phase);
    } else {
      applyNeonLiquify(ctx, width, height, state.strength, seed, phase);
      addVignette(ctx, width, height, 0.34 * softenedLiquifyStrength(state.strength));
    }
  }

  if (state.filter === "signal") {
    applySignalCrash(ctx, width, height, state.strength, seed, phase);
    addVignette(ctx, width, height, 0.22 * state.strength);
  }

  if (state.filter === "frameecho") {
    applyFrameEcho(ctx, width, height, state.strength, seed, phase);
    addVignette(ctx, width, height, 0.18 * state.strength);
  }

  if (state.filter === "prism") applyPrismEcho(ctx, width, height, state.strength);
  if (state.filter === "thermal") {
    applyThermal(ctx, width, height, state.strength);
    addVignette(ctx, width, height, 0.16 * state.strength);
  }
  if (state.filter === "xerox") applyXerox(ctx, width, height, state.strength, seed);
  if (state.filter === "riso") applyRiso(ctx, width, height, state.strength);
  if (state.filter === "comic") applyComic(ctx, width, height, state.strength);
  if (state.filter === "holo") applyHoloDream(ctx, width, height, state.strength);
  if (state.filter === "pixel") applyPixelate(ctx, width, height, state.strength);
  if (state.filter === "summerfilm") applySummerFilm(ctx, width, height, state.strength);
  if (state.filter === "faded") applyFadedMemory(ctx, width, height, state.strength);
  if (state.filter === "softglow") applySoftGlow(ctx, width, height, state.strength);
  if (state.filter === "heartbokeh") applyHeartBokeh(ctx, width, height, state.strength, seed);

  if (state.filter !== "comic") {
    addPixelEffects(ctx, width, height, state.filter, state.strength, state.grain, seed);
  }
  if (state.filter === "analog") addScanlines(ctx, width, height, state.strength);
}

function drawImageCover(ctx, image, x, y, width, height) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const sourceAspect = sourceWidth / sourceHeight;
  const targetAspect = width / height;
  let sw = sourceWidth;
  let sh = sourceHeight;
  if (sourceAspect > targetAspect) sw = sourceHeight * targetAspect;
  else sh = sourceWidth / targetAspect;
  ctx.drawImage(image, (sourceWidth - sw) / 2, (sourceHeight - sh) / 2, sw, sh, x, y, width, height);
}

function renderFilmFrame(image, width, height, seed, originalOnly = false) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const presetName = state.filter === "liquify" && state.liquifyMode === "brush" ? "liquifybrush" : state.filter;
  ctx.filter = originalOnly ? "none" : presetFilter(presetName, state.strength);
  drawImageCover(ctx, image, 0, 0, width, height);
  ctx.filter = "none";
  if (!originalOnly) applySelectedFilter(ctx, canvas, width, height, seed);
  return canvas;
}

function composeFilmStrip(targetCanvas, maxSide, originalOnly = false) {
  const baseFrame = snapshotCanvas(targetCanvas);
  const count = state.filmFrameCount;
  const aspect = baseFrame.width / baseFrame.height;
  const edgeUnits = 0.07;
  const gapUnits = 0.045;
  const bandUnits = 0.2;
  const totalWidthUnits = edgeUnits * 2 + aspect * count + gapUnits * (count - 1);
  const totalHeightUnits = 1 + bandUnits * 2;
  const unit = Math.min(baseFrame.height, maxSide / Math.max(totalWidthUnits, totalHeightUnits));
  const frameWidth = Math.max(1, Math.round(aspect * unit));
  const frameHeight = Math.max(1, Math.round(unit));
  const gap = Math.max(2, Math.round(gapUnits * unit));
  const edge = Math.max(6, Math.round(edgeUnits * unit));
  const band = Math.max(18, Math.round(bandUnits * unit));
  const width = edge * 2 + frameWidth * count + gap * (count - 1);
  const height = frameHeight + band * 2;

  targetCanvas.width = width;
  targetCanvas.height = height;
  const ctx = targetCanvas.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#111014";
  ctx.fillRect(0, 0, width, height);

  const aged = ctx.createLinearGradient(0, 0, width, height);
  aged.addColorStop(0, "rgba(98,52,21,0.2)");
  aged.addColorStop(0.5, "rgba(255,242,190,0.02)");
  aged.addColorStop(1, "rgba(123,28,9,0.18)");
  ctx.fillStyle = aged;
  ctx.fillRect(0, 0, width, height);

  const holeWidth = Math.max(8, Math.round(unit * 0.085));
  const holeHeight = Math.max(6, Math.round(band * 0.46));
  const holeGap = Math.max(5, Math.round(holeWidth * 0.62));
  ctx.fillStyle = "#f0e8cc";
  for (let x = edge * 0.45; x < width - holeWidth; x += holeWidth + holeGap) {
    ctx.fillRect(x, (band - holeHeight) / 2, holeWidth, holeHeight);
    ctx.fillRect(x, height - band + (band - holeHeight) / 2, holeWidth, holeHeight);
  }

  for (let index = 0; index < count; index += 1) {
    const x = edge + index * (frameWidth + gap);
    const y = band;
    const custom = state.filmFrameImages[index];
    const frame = custom
      ? renderFilmFrame(custom.image, frameWidth, frameHeight, state.seed + index * 131, originalOnly)
      : baseFrame;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, frameWidth, frameHeight);
    ctx.clip();
    drawImageCover(ctx, frame, x, y, frameWidth, frameHeight);
    ctx.restore();
    ctx.strokeStyle = "rgba(246,224,179,0.28)";
    ctx.lineWidth = Math.max(1, unit * 0.008);
    ctx.strokeRect(x + 0.5, y + 0.5, frameWidth - 1, frameHeight - 1);
  }

  const random = mulberry32(state.seed + count * 41);
  ctx.save();
  for (let index = 0; index < Math.round(5 + count * 1.5); index += 1) {
    ctx.globalAlpha = 0.08 + random() * 0.14;
    ctx.fillStyle = random() > 0.5 ? "#fff4cf" : "#bd3a18";
    ctx.fillRect(random() * width, 0, Math.max(1, unit * 0.006), height);
  }
  ctx.globalAlpha = 0.72;
  ctx.fillStyle = "#e9622f";
  ctx.font = `700 ${Math.max(9, Math.round(band * 0.34))}px "Courier New", monospace`;
  ctx.textBaseline = "middle";
  for (let index = 0; index < count; index += 1) {
    const x = edge + index * (frameWidth + gap) + frameWidth * 0.08;
    ctx.fillText(String(22 + index), x, band * 0.5);
  }
  ctx.restore();
  return { width, height };
}

function drawCameraUiLayer(ctx, width, height, language) {
  const top = height * 0.15;
  const bottom = height * 0.25;
  const viewportBottom = height - bottom;
  const lineWidth = Math.max(1, Math.min(width, height) * 0.0022);
  ctx.save();
  ctx.fillStyle = "rgba(2,3,6,0.7)";
  ctx.fillRect(0, 0, width, top);
  ctx.fillRect(0, viewportBottom, width, bottom);
  ctx.strokeStyle = "rgba(235,239,243,0.38)";
  ctx.lineWidth = lineWidth;
  for (let index = 1; index < 3; index += 1) {
    const x = width * index / 3;
    const y = top + (viewportBottom - top) * index / 3;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, viewportBottom);
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const uiSize = Math.max(11, Math.round(Math.min(width, height) * 0.026));
  ctx.font = `700 ${uiSize}px Arial, sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText("⚡", width * 0.05, top * 0.48);
  ctx.fillText("HDR", width * 0.18, top * 0.48);
  ctx.textAlign = "right";
  ctx.fillText("AUTO", width * 0.95, top * 0.48);

  const focusX = width * 0.5;
  const focusY = top + (viewportBottom - top) * 0.5;
  const focusSize = Math.min(width, height) * 0.045;
  ctx.strokeStyle = "rgba(245,209,91,0.9)";
  ctx.lineWidth = Math.max(1.5, lineWidth * 1.4);
  ctx.beginPath();
  ctx.moveTo(focusX - focusSize, focusY);
  ctx.lineTo(focusX + focusSize, focusY);
  ctx.moveTo(focusX, focusY - focusSize);
  ctx.lineTo(focusX, focusY + focusSize);
  ctx.stroke();

  const labels = language === "ko"
    ? ["슬로모션", "비디오", "사진", "인물", "파노라마"]
    : ["SLO-MO", "VIDEO", "PHOTO", "PORTRAIT", "PANO"];
  const selectedIndex = 2;
  ctx.font = `700 ${Math.max(9, Math.round(uiSize * 0.72))}px Arial, sans-serif`;
  ctx.textAlign = "center";
  labels.forEach((label, index) => {
    const x = width * (0.1 + index * 0.2);
    ctx.fillStyle = index === selectedIndex ? "#f1ca57" : "rgba(255,255,255,0.78)";
    ctx.fillText(label, x, viewportBottom + bottom * 0.24);
  });

  const shutterY = viewportBottom + bottom * 0.68;
  const shutterRadius = Math.min(width, height) * 0.074;
  ctx.fillStyle = "#f7f7f7";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = Math.max(3, lineWidth * 2.4);
  ctx.beginPath();
  ctx.arc(width * 0.5, shutterY, shutterRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "#101116";
  ctx.lineWidth = Math.max(1, lineWidth);
  ctx.beginPath();
  ctx.arc(width * 0.5, shutterY, shutterRadius * 0.84, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.86)";
  ctx.beginPath();
  ctx.arc(width * 0.86, shutterY, shutterRadius * 0.72, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.86)";
  ctx.font = `700 ${Math.max(12, Math.round(uiSize * 1.1))}px Arial, sans-serif`;
  ctx.fillText("↻", width * 0.86, shutterY);
  ctx.restore();
}

function drawCameraOverlay(ctx, width, height) {
  if (state.cameraOverlay === "off") return;
  const radians = state.cameraRotation * Math.PI / 180;
  const quarterTurn = state.cameraRotation % 180 !== 0;
  const logicalWidth = quarterTurn ? height : width;
  const logicalHeight = quarterTurn ? width : height;
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(radians);
  ctx.translate(-logicalWidth / 2, -logicalHeight / 2);
  drawCameraUiLayer(ctx, logicalWidth, logicalHeight, state.cameraOverlay);
  ctx.restore();
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
  const presetName = state.filter === "liquify" && state.liquifyMode === "brush"
    ? "liquifybrush"
    : state.filter;
  ctx.filter = originalOnly ? "none" : presetFilter(presetName, state.strength);
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

  if (!originalOnly) applySelectedFilter(ctx, targetCanvas, output.width, output.height, state.seed);
  let finalOutput = output;
  if (state.filmStrip) finalOutput = composeFilmStrip(targetCanvas, maxSide, originalOnly);
  if (originalOnly) return finalOutput;
  const finalCtx = targetCanvas.getContext("2d", { willReadFrequently: true });
  const showStickerSelection = targetCanvas === elements.canvas
    && !(state.filter === "liquify" && state.liquifyMode === "brush");
  drawStickers(finalCtx, finalOutput.width, finalOutput.height, showStickerSelection);
  if (state.showDate) addDateStamp(finalCtx, finalOutput.width, finalOutput.height);
  drawCameraOverlay(finalCtx, finalOutput.width, finalOutput.height);

  return finalOutput;
}

function scheduleRender() {
  if (!state.image) return;
  if (state.renderFrame) cancelAnimationFrame(state.renderFrame);
  elements.processing.hidden = false;
  state.renderFrame = requestAnimationFrame(() => {
    const previewMaxSide = state.paintingLiquify ? 680 : 1500;
    const output = drawProcessed(elements.canvas, previewMaxSide, state.comparing);
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
  updateOverlayUI();
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
    state.liquifyStrokes = [];
    cancelActiveLiquifyPaint();
    clearFilmFrameImages();
    updateLoadedUI(file);
    updateLiquifyUI();
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
  state.liquifyStrokes = [];
  cancelActiveLiquifyPaint();
  clearFilmFrameImages();
  elements.canvas.classList.remove("is-dragging-sticker", "is-resizing-sticker", "is-painting-liquify");
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
  updateLiquifyUI();
  updatePatternUI();
  updateOverlayUI();
  showToast("편집기를 비웠어요.");
}

function setComparing(active) {
  if (!state.image || state.comparing === active) return;
  state.comparing = active;
  elements.compareButton.setAttribute("aria-pressed", String(active));
  elements.compareButton.classList.toggle("is-active", active);
  if (active) {
    if (state.renderFrame) cancelAnimationFrame(state.renderFrame);
    state.renderFrame = null;
    const output = drawProcessed(elements.canvas, 1500, true);
    elements.statusSize.textContent = `${output.width} × ${output.height} PX`;
    elements.processing.hidden = true;
    return;
  }
  scheduleRender();
}

function updateDownloadButtonLabel(rendering = false) {
  if (rendering) {
    elements.downloadButton.textContent = "렌더링 중...";
    return;
  }
  const label = state.exportFormat.toUpperCase();
  elements.downloadButton.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0 5-5m-5 5-5-5M5 19h14" /></svg>${label}로 저장하기`;
}

function downloadImage() {
  if (!state.image) return;
  elements.downloadButton.disabled = true;
  updateDownloadButtonLabel(true);
  requestAnimationFrame(() => {
    const exportCanvas = document.createElement("canvas");
    drawProcessed(exportCanvas, 3200, false);
    const mimeType = state.exportFormat === "webp" ? "image/webp" : "image/png";
    const quality = state.exportFormat === "webp" ? 0.92 : undefined;
    exportCanvas.toBlob(
      (blob) => {
        if (!blob) {
          showToast("저장에 실패했어요. 다시 시도해 주세요.");
          elements.downloadButton.disabled = false;
          updateDownloadButtonLabel();
          return;
        }
        const link = document.createElement("a");
        const safeBase = state.fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9가-힣_-]+/g, "-");
        const actualFormat = blob.type === "image/webp" ? "webp" : "png";
        link.download = `${safeBase || "memory"}-${state.filter}.${actualFormat}`;
        link.href = URL.createObjectURL(blob);
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        updateDownloadButtonLabel();
        elements.downloadButton.disabled = false;
        const label = actualFormat.toUpperCase();
        showToast(`${filterNames[state.filter]} · ${label}로 저장했어요.`);
      },
      mimeType,
      quality,
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
    cancelActiveLiquifyPaint();
    state.filter = card.dataset.filter;
    elements.filterCards.forEach((item) => {
      const selected = item === card;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-checked", String(selected));
    });
    updateLiquifyUI();
    updatePatternUI();
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

elements.liquifyModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.liquifyMode = button.dataset.liquifyMode;
    cancelActiveLiquifyPaint();
    elements.liquifyModeButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    updateLiquifyUI();
    scheduleRender();
  });
});

elements.liquifyBrushSize.addEventListener("input", () => {
  state.liquifyBrushSize = Number(elements.liquifyBrushSize.value) / 100;
  elements.liquifyBrushSizeValue.textContent = `${elements.liquifyBrushSize.value}%`;
  setNormalizedRangeFill(elements.liquifyBrushSize);
});

elements.undoLiquify.addEventListener("click", () => {
  state.liquifyStrokes.pop();
  updateLiquifyUI();
  scheduleRender();
});

elements.clearLiquify.addEventListener("click", () => {
  state.liquifyStrokes = [];
  updateLiquifyUI();
  scheduleRender();
});

elements.patternPhase.addEventListener("input", () => {
  state.patternPhase = Number(elements.patternPhase.value);
  elements.patternPhaseValue.textContent = `${state.patternPhase}°`;
  setNormalizedRangeFill(elements.patternPhase);
  scheduleRender();
});

elements.randomizePattern.addEventListener("click", () => {
  state.seed = Math.floor(Math.random() * 100000);
  state.patternPhase = Math.floor(Math.random() * 361);
  updatePatternUI();
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

elements.formatButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.exportFormat = button.dataset.format;
    elements.formatButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    updateDownloadButtonLabel();
  });
});

elements.dateToggle.addEventListener("change", () => {
  state.showDate = elements.dateToggle.checked;
  scheduleRender();
});

elements.dateInput.addEventListener("input", () => {
  state.dateValue = elements.dateInput.value || formatDateInputValue(new Date());
  elements.dateInput.value = state.dateValue;
  scheduleRender();
});

elements.cameraOverlayButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.cameraOverlay = button.dataset.cameraOverlay;
    elements.cameraOverlayButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    updateOverlayUI();
    scheduleRender();
  });
});

elements.rotateCameraLeft.addEventListener("click", () => {
  state.cameraRotation = (state.cameraRotation + 270) % 360;
  updateOverlayUI();
  scheduleRender();
});

elements.rotateCameraRight.addEventListener("click", () => {
  state.cameraRotation = (state.cameraRotation + 90) % 360;
  updateOverlayUI();
  scheduleRender();
});

elements.filmStripButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.filmStrip = button.dataset.filmStrip === "on";
    elements.filmStripButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    updateOverlayUI();
    scheduleRender();
  });
});

elements.filmFrameCount.addEventListener("input", () => {
  state.filmFrameCount = Number(elements.filmFrameCount.value);
  updateOverlayUI();
  scheduleRender();
});

elements.uploadFilmFrames.addEventListener("click", () => elements.filmFrameInput.click());
elements.filmFrameInput.addEventListener("change", () => loadFilmFrameImages(elements.filmFrameInput.files));
elements.filmSlotInput.addEventListener("change", () => {
  if (state.pendingFilmSlot === null) return;
  loadFilmSlotImage(elements.filmSlotInput.files[0], state.pendingFilmSlot);
});
elements.clearFilmFrames.addEventListener("click", () => {
  clearFilmFrameImages();
  scheduleRender();
});

elements.stickerTabs.forEach((button) => {
  button.addEventListener("click", () => {
    selectStickerGroup(button.dataset.stickerGroup);
  });
});

elements.uploadSticker.addEventListener("click", () => elements.stickerFileInput.click());
elements.stickerFileInput.addEventListener("change", () => loadCustomSticker(elements.stickerFileInput.files[0]));
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

elements.canvas.addEventListener("pointerdown", handleCanvasPointerDown);
elements.canvas.addEventListener("pointermove", handleCanvasPointerMove);
elements.canvas.addEventListener("pointerup", handleCanvasPointerEnd);
elements.canvas.addEventListener("pointercancel", handleCanvasPointerEnd);

window.addEventListener("keydown", (event) => {
  if (!["Delete", "Backspace"].includes(event.key) || !state.selectedStickerId) return;
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  event.preventDefault();
  deleteSelectedSticker();
});

window.addEventListener("beforeunload", () => {
  customStickerUrls.forEach((url) => URL.revokeObjectURL(url));
  filmFrameUrls.forEach((url) => URL.revokeObjectURL(url));
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
elements.dateInput.value = state.dateValue;
setNormalizedRangeFill(elements.liquifyBrushSize);
setNormalizedRangeFill(elements.patternPhase);
setNormalizedRangeFill(elements.filmFrameCount);
updateLiquifyUI();
updatePatternUI();
updateOverlayUI();
updateDownloadButtonLabel();
initializeStickerAssets();
