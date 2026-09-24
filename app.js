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
  xpOverlayButtons: $$('[data-xp-overlay]'),
  digicamFrameButtons: $$('[data-digicam-frame]'),
  paintFrameButtons: $$('[data-paint-frame]'),
  streamFrameButtons: $$('[data-stream-frame]'),
  streamTools: $("#stream-tools"),
  streamThemeControl: $("#stream-theme-control"),
  streamThemeButtons: $$('[data-stream-theme]'),
  streamTitle: $("#stream-title"),
  streamChannel: $("#stream-channel"),
  streamViewers: $("#stream-viewers"),
  streamDuration: $("#stream-duration"),
  streamShowTitle: $("#stream-show-title"),
  streamShowChannel: $("#stream-show-channel"),
  streamShowViewers: $("#stream-show-viewers"),
  streamShowDuration: $("#stream-show-duration"),
  streamFitButtons: $$('[data-stream-fit]'),
  streamZoom: $("#stream-zoom"),
  streamZoomValue: $("#stream-zoom-value"),
  streamPositionX: $("#stream-position-x"),
  streamPositionXValue: $("#stream-position-x-value"),
  streamPositionY: $("#stream-position-y"),
  streamPositionYValue: $("#stream-position-y-value"),
  vnModeButtons: $$('[data-vn-mode]'),
  vnStyleButtons: $$('[data-vn-style]'),
  vnFontButtons: $$('[data-vn-font]'),
  vnTools: $("#vn-tools"),
  vnSceneTools: $("#vn-scene-tools"),
  vnName: $("#vn-name"),
  vnDialogue: $("#vn-dialogue"),
  vnBoxColor: $("#vn-box-color"),
  vnNameColor: $("#vn-name-color"),
  resetVnColors: $("#reset-vn-colors"),
  vnBackgroundInput: $("#vn-background-input"),
  vnCharacterInput: $("#vn-character-input"),
  uploadVnBackground: $("#upload-vn-background"),
  uploadVnCharacter: $("#upload-vn-character"),
  vnBackgroundStatus: $("#vn-background-status"),
  vnCharacterStatus: $("#vn-character-status"),
  vnCharacterSize: $("#vn-character-size"),
  vnCharacterSizeValue: $("#vn-character-size-value"),
  vnCharacterX: $("#vn-character-x"),
  vnCharacterXValue: $("#vn-character-x-value"),
  clearVnAssets: $("#clear-vn-assets"),
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
  xpOverlay: false,
  digicamFrame: "off",
  paintFrame: false,
  streamFrame: "off",
  streamTheme: "dark",
  streamTitle: "방송제목을 입력해주세요",
  streamChannel: "채널 이름",
  streamViewers: "1,458",
  streamDuration: "2:26:16",
  streamShowTitle: true,
  streamShowChannel: true,
  streamShowViewers: true,
  streamShowDuration: true,
  streamFit: "cover",
  streamZoom: 1,
  streamPositionX: 0.5,
  streamPositionY: 0.5,
  previewContentSize: null,
  vnMode: "off",
  vnStyle: "classic",
  vnFont: "pixel",
  vnName: "이름",
  vnDialogue: "대사를 입력하세요.",
  vnBoxColor: null,
  vnNameColor: null,
  vnBackground: null,
  vnCharacter: null,
  vnCharacterScale: 0.78,
  vnCharacterX: 0.68,
};

const stickerCatalog = window.STICKER_CATALOG || [];
const assetVersion = "20260924-stream1";
const customStickerCatalog = [];
const stickerDefinitions = new Map(stickerCatalog.map((sticker) => [sticker.id, sticker]));
const stickerAssets = new Map();
const customStickerUrls = new Set();
const filmFrameUrls = new Set();
const vnAssetUrls = new Set();
const heartTunnelTexture = new Image();
heartTunnelTexture.decoding = "async";
heartTunnelTexture.onload = () => {
  if (state.image && state.filter === "hearttunnel") scheduleRender();
};
heartTunnelTexture.src = `assets/heart-tunnel.png?v=${assetVersion}`;

const rasterFrameDefinitions = {
  horizontal: {
    src: "assets/digicam-horizontal-hq.png",
    crop: { x: 0, y: 0, width: 1, height: 1 },
    screen: { x: 0.067, y: 0.08, width: 0.677, height: 0.825 },
    radius: 0.002,
  },
  portrait: {
    src: "assets/digicam-portrait.png",
    crop: { x: 0, y: 0, width: 1, height: 1 },
    screen: { x: 0.076, y: 0.204, width: 0.704, height: 0.417 },
    radius: 0.03,
  },
  paint: {
    src: "assets/paint-frame-hq.svg",
    crop: { x: 0, y: 0, width: 1, height: 1 },
    screen: { x: 176 / 1200, y: 142 / 1128, width: 948 / 1200, height: 632 / 1128 },
    radius: 0,
  },
};

function loadRasterFrameAsset(definition, retry = false) {
  const image = new Image();
  image.decoding = "async";
  definition.loadError = false;
  image.onload = () => {
    definition.image = image;
    definition.loadError = false;
    if (state.image) scheduleRender();
  };
  image.onerror = () => {
    definition.image = null;
    definition.loadError = true;
    if (getActiveRasterFrameDefinition() === definition) {
      showToast(`프레임 파일을 찾지 못했어요: ${definition.src}`);
    }
  };
  const retryToken = retry ? `&retry=${Date.now()}` : "";
  image.src = `${definition.src}?v=${assetVersion}${retryToken}`;
}

Object.values(rasterFrameDefinitions).forEach((definition) => loadRasterFrameAsset(definition));

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
  milkyveil: "밀키 포트레이트",
  hearttunnel: "핑크 하트 터널",
};

const vnThemes = {
  classic: {
    box: "rgba(17,22,52,.86)",
    boxInput: "#111634",
    border: "rgba(218,228,255,.94)",
    accent: "#8fb5ff",
    text: "#fffdf7",
    shadow: "rgba(5,8,24,.48)",
  },
  pink: {
    box: "rgba(255,232,242,.9)",
    boxInput: "#ffe8f2",
    border: "rgba(255,255,255,.96)",
    accent: "#e46a9f",
    text: "#48273b",
    shadow: "rgba(126,54,91,.28)",
  },
  cyber: {
    box: "rgba(10,12,24,.9)",
    boxInput: "#0a0c18",
    border: "#76f7ee",
    accent: "#ff6fca",
    text: "#efffff",
    shadow: "rgba(0,237,255,.26)",
  },
};

function hexColorToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red},${green},${blue},${alpha})`;
}

function readableTextColor(hex) {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 255000;
  return luminance > 0.58 ? "#171827" : "#fffdf7";
}

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
    milkyveil: `brightness(${1 + 0.13 * s}) contrast(${1 - 0.3 * s}) saturate(${1 - 0.24 * s}) sepia(${0.035 * s}) blur(${0.48 * s}px)`,
    hearttunnel: `brightness(${1 + 0.035 * s}) contrast(${1 - 0.08 * s}) saturate(${1 + 0.06 * s})`,
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
  const pixelCount = width * height;
  const offsetFieldX = new Float32Array(pixelCount);
  const offsetFieldY = new Float32Array(pixelCount);
  const influenceField = new Float32Array(pixelCount);
  const chromaField = new Float32Array(pixelCount);
  const radiusField = new Float32Array(pixelCount);
  const accumulatedField = new Float32Array(pixelCount);

  strokes.forEach((stroke, strokeIndex) => {
    stroke.points.forEach((point, pointIndex) => {
      const pointWeight = Math.max(1, point.weight || 1);
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
      const channelShift = Math.max(0.7, radius * (pointKind === "twirl" ? 0.022 : 0.045) * effectStrength);

      for (let y = startY; y <= endY; y += 1) {
        const relativeY = y - centerY;
        for (let x = startX; x <= endX; x += 1) {
          const relativeX = x - centerX;
          const distance = Math.hypot(relativeX, relativeY);
          if (distance > radius) continue;
          const normalized = distance / radius;
          const falloff = Math.pow(1 - normalized, 1.55);
          let offsetX;
          let offsetY;
          if (pointKind === "twirl") {
            const hold = Math.min(3.2, Math.max(0.28, point.hold || 0.28));
            const animationPulse = 1 + Math.sin(phaseOffset + pointIndex * 0.7) * 0.08;
            const angle = (0.18 + hold * 0.72) * effectStrength * Math.pow(falloff, 0.68) * animationPulse;
            const cosine = Math.cos(angle);
            const sine = Math.sin(angle);
            const rotatedX = relativeX * cosine - relativeY * sine;
            const rotatedY = relativeX * sine + relativeY * cosine;
            offsetX = rotatedX - relativeX;
            offsetY = rotatedY - relativeY;
          } else if (hasMotion) {
            const along = relativeX * directionX + relativeY * directionY;
            const wave = Math.sin(along / radius * Math.PI * 3.8 + phase)
              * radius * 0.1 * effectStrength * falloff;
            offsetX = -motionX * dragScale * falloff + normalX * wave;
            offsetY = -motionY * dragScale * falloff + normalY * wave;
          } else {
            const inverseDistance = distance > 0.5 ? 1 / distance : 0;
            const radialX = relativeX * inverseDistance;
            const radialY = relativeY * inverseDistance;
            const ripple = Math.sin(normalized * Math.PI * 6.5 + phase)
              * radius * 0.2 * effectStrength * falloff;
            const sidestep = Math.cos(normalized * Math.PI * 4.5 + phase)
              * radius * 0.065 * effectStrength * falloff;
            offsetX = radialX * ripple - radialY * sidestep;
            offsetY = radialY * ripple + radialX * sidestep;
          }
          const fieldIndex = y * width + x;
          offsetFieldX[fieldIndex] += offsetX * pointWeight;
          offsetFieldY[fieldIndex] += offsetY * pointWeight;
          const weightedFalloff = 1 - Math.pow(1 - falloff, Math.min(8, pointWeight));
          influenceField[fieldIndex] = Math.max(influenceField[fieldIndex], weightedFalloff);
          chromaField[fieldIndex] = Math.max(
            chromaField[fieldIndex],
            channelShift * falloff * Math.min(2, Math.sqrt(pointWeight)),
          );
          radiusField[fieldIndex] = Math.max(radiusField[fieldIndex], radius);
          accumulatedField[fieldIndex] += falloff * pointWeight;
        }
      }
    });
  });

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const fieldIndex = y * width + x;
      const influence = influenceField[fieldIndex];
      if (influence <= 0) continue;
      let offsetX = offsetFieldX[fieldIndex];
      let offsetY = offsetFieldY[fieldIndex];
      const offsetLength = Math.hypot(offsetX, offsetY);
      const maxOffset = radiusField[fieldIndex] * (
        0.72 + Math.min(0.55, Math.log2(1 + accumulatedField[fieldIndex]) * 0.12)
      );
      if (offsetLength > maxOffset && maxOffset > 0) {
        const scale = maxOffset / offsetLength;
        offsetX *= scale;
        offsetY *= scale;
      }
      const sourceX = Math.round(clamp(x + offsetX, 0, width - 1));
      const sourceY = Math.round(clamp(y + offsetY, 0, height - 1));
      const channelShift = chromaField[fieldIndex];
      const redX = Math.round(clamp(sourceX + channelShift, 0, width - 1));
      const blueX = Math.round(clamp(sourceX - channelShift, 0, width - 1));
      const target = pixelIndex(x, y, width);
      const centerSource = pixelIndex(sourceX, sourceY, width);
      const redSource = pixelIndex(redX, sourceY, width);
      const blueSource = pixelIndex(blueX, sourceY, width);
      const mix = Math.min(0.96, 0.28 + influence * (0.52 + effectStrength * 0.18));
      const red = clamp(source[redSource] * 1.1 + source[blueSource + 2] * 0.035);
      const green = clamp(source[centerSource + 1] * 0.9 + Math.min(red, source[blueSource + 2]) * 0.035);
      const blue = clamp(source[blueSource + 2] * 1.12 + source[redSource] * 0.04);
      data[target] = mixChannel(source[target], red, mix);
      data[target + 1] = mixChannel(source[target + 1], green, mix);
      data[target + 2] = mixChannel(source[target + 2], blue, mix);
    }
  }
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
  addOrangeLightLeak(ctx, width, height, strength);
}

function applySoftGlow(ctx, width, height, strength, animationPhase = 0) {
  if (strength <= 0.01) return;
  const source = snapshotCanvas(ctx.canvas);
  const breath = 1 + Math.sin(animationPhase) * 0.07 * strength;
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = (0.12 + strength * 0.2) * breath;
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

function applyMilkyVeil(ctx, width, height, strength) {
  if (strength <= 0.01) return;
  const source = snapshotCanvas(ctx.canvas);
  const minSide = Math.min(width, height);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 0.08 + strength * 0.2;
  ctx.filter = `blur(${Math.max(4, minSide * (0.009 + strength * 0.012))}px) brightness(1.08)`;
  ctx.drawImage(source, 0, 0, width, height);
  ctx.filter = "none";

  const veil = ctx.createLinearGradient(0, 0, width, height);
  veil.addColorStop(0, `rgba(255,246,250,${0.19 * strength})`);
  veil.addColorStop(0.5, `rgba(247,249,255,${0.11 * strength})`);
  veil.addColorStop(1, `rgba(240,229,239,${0.16 * strength})`);
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, width, height);

  const faceLight = ctx.createRadialGradient(
    width * 0.48,
    height * 0.34,
    0,
    width * 0.48,
    height * 0.34,
    Math.max(width, height) * 0.68,
  );
  faceLight.addColorStop(0, `rgba(255,255,255,${0.14 * strength})`);
  faceLight.addColorStop(0.5, `rgba(255,233,240,${0.06 * strength})`);
  faceLight.addColorStop(1, "rgba(232,235,247,0)");
  ctx.fillStyle = faceLight;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
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

function applyHeartTunnel(ctx, width, height, strength) {
  if (strength <= 0.01 || !heartTunnelTexture.complete || !heartTunnelTexture.naturalWidth) return;
  ctx.save();
  ctx.globalAlpha = 0.05 + Math.pow(strength, 1.1) * 0.77;
  drawImageCover(ctx, heartTunnelTexture, 0, 0, width, height);
  ctx.restore();
}

function applyHeartBokeh(ctx, width, height, strength, seed, animationPhase = 0) {
  if (strength <= 0.01) return;
  const source = snapshotCanvas(ctx.canvas);
  const sample = document.createElement("canvas");
  sample.width = Math.max(30, Math.min(64, Math.round(width / 20)));
  sample.height = Math.max(24, Math.round(sample.width * height / width));
  const sampleCtx = sample.getContext("2d", { willReadFrequently: true });
  sampleCtx.drawImage(source, 0, 0, sample.width, sample.height);
  const pixels = sampleCtx.getImageData(0, 0, sample.width, sample.height).data;
  const candidates = [];
  const threshold = 176 - strength * 12;

  for (let y = 1; y < sample.height * 0.88; y += 1) {
    for (let x = 1; x < sample.width - 1; x += 1) {
      const index = pixelIndex(x, y, sample.width);
      const light = luminance(pixels, index);
      const score = Math.max(pixels[index], pixels[index + 1], pixels[index + 2]) * 0.6 + light * 0.4;
      if (score < threshold) continue;
      let localPeak = true;
      for (let offsetY = -1; offsetY <= 1 && localPeak; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          if (offsetX === 0 && offsetY === 0) continue;
          const neighborIndex = pixelIndex(x + offsetX, y + offsetY, sample.width);
          const neighborLight = luminance(pixels, neighborIndex);
          const neighborScore = Math.max(
            pixels[neighborIndex],
            pixels[neighborIndex + 1],
            pixels[neighborIndex + 2],
          ) * 0.6 + neighborLight * 0.4;
          if (neighborScore > score + 5) {
            localPeak = false;
            break;
          }
        }
      }
      if (localPeak) candidates.push({
        x,
        y,
        light,
        score,
        red: pixels[index],
        green: pixels[index + 1],
        blue: pixels[index + 2],
      });
    }
  }

  candidates.sort((left, right) => right.score - left.score);
  const chosen = [];
  const limit = Math.round(6 + strength * 11);
  for (const candidate of candidates) {
    if (chosen.length >= limit) break;
    if (chosen.some((item) => Math.hypot(item.x - candidate.x, item.y - candidate.y) < 4)) continue;
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
    const brightness = (point.score - threshold) / Math.max(1, 255 - threshold);
    const depth = random();
    const pulse = 1 + Math.sin(animationPhase + index * 0.83) * 0.08 * strength;
    const size = minSide * (0.042 + strength * 0.052)
      * (0.8 + brightness * 0.62 + depth * 0.56) * pulse;
    const lineWidth = Math.max(1.5, size * 0.1);

    const halo = ctx.createRadialGradient(x, y, 0, x, y, size * 0.88);
    halo.addColorStop(0, `rgba(${point.red},${point.green},${point.blue},${0.28 + brightness * 0.25})`);
    halo.addColorStop(0.34, `rgba(255,214,126,${0.12 + strength * 0.08})`);
    halo.addColorStop(1, "rgba(255,70,55,0)");
    ctx.fillStyle = halo;
    ctx.fillRect(x - size, y - size, size * 2, size * 2);

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 0.1 + strength * 0.08;
    ctx.fillStyle = "#16131f";
    addHeartPath(ctx, x, y, size * 0.76);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.34 + depth * 0.22;
    ctx.filter = `blur(${Math.max(1, size * (0.12 + depth * 0.12))}px)`;
    ctx.strokeStyle = "rgba(255,238,174,0.72)";
    ctx.lineWidth = lineWidth * (2.1 + depth * 1.3);
    ctx.shadowColor = "rgba(255,64,42,0.82)";
    ctx.shadowBlur = size * 0.48;
    addHeartPath(ctx, x, y, size * 1.04);
    ctx.stroke();
    ctx.restore();

    const offsets = [
      { x: -lineWidth * 1.35, y: lineWidth * 0.08, scale: 1.12, color: "rgba(255,31,65,0.9)" },
      { x: lineWidth * 1.28, y: lineWidth * 0.2, scale: 1.07, color: "rgba(21,245,224,0.88)" },
      { x: 0, y: -lineWidth * 0.62, scale: 1.02, color: "rgba(255,170,32,0.9)" },
      { x: 0, y: 0, scale: 0.94, color: "rgba(255,249,190,0.94)" },
    ];
    offsets.forEach((edge, edgeIndex) => {
      ctx.save();
      ctx.translate(edge.x, edge.y);
      ctx.strokeStyle = edge.color;
      ctx.lineWidth = edgeIndex === 3 ? lineWidth * 0.72 : lineWidth * 1.15;
      ctx.shadowColor = edge.color;
      ctx.shadowBlur = size * (0.2 + strength * 0.24 + depth * 0.16);
      addHeartPath(ctx, x, y, size * edge.scale);
      ctx.stroke();
      ctx.restore();
    });

    ctx.save();
    ctx.globalAlpha = 0.46 + brightness * 0.38;
    ctx.strokeStyle = "rgba(255,255,241,0.9)";
    ctx.lineWidth = Math.max(1, lineWidth * 0.46);
    addHeartPath(ctx, x, y, size * 0.72);
    ctx.stroke();
    ctx.restore();
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

function addOrangeLightLeak(ctx, width, height, strength) {
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
}

function applySummerFilm(ctx, width, height, strength) {
  if (strength <= 0.01) return;
  addColorWash(ctx, width, height, "#8ce7ee", 0.05 * strength, "screen");
  addOrangeLightLeak(ctx, width, height, strength);

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
  const threshold = 140 - strength * 14;
  const amount = 0.28 + strength * 0.38;

  for (let i = 0; i < data.length; i += 4) {
    const light = luminance(source, i);
    const grit = (random() - 0.5) * (10 + strength * 17);
    const isInk = light + grit < threshold;
    const isAcid = !isInk && light < threshold + 52 && (source[i + 1] > source[i] * 0.94 || random() < 0.035 * strength);
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
      const shadowInk = gray < inkThreshold;
      const diagonalHatch = (x + y * 2) % 11 === 0;
      const crossHatch = (x * 2 - y + width * 2) % 13 === 0;
      const toneInk = (gray < 150 - strength * 6 && diagonalHatch)
        || (gray < 104 - strength * 4 && crossHatch);
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
  const groupNames = { holo: "홀로", y2k: "Y2K", pixel: "픽셀", custom: "내" };
  showToast(`${groupNames[state.stickerGroup] || "선택한"} 스티커를 랜덤 배치했어요.`);
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

function getEditorContentSize() {
  return state.previewContentSize || {
    width: elements.canvas.width,
    height: elements.canvas.height,
  };
}

function getActiveRasterFrameDefinition() {
  if (state.paintFrame) return rasterFrameDefinitions.paint;
  if (state.digicamFrame !== "off") return rasterFrameDefinitions[state.digicamFrame] || null;
  return null;
}

function prepareRasterFrame(definition) {
  if (!definition) return;
  if (definition.loadError) {
    showToast("프레임 이미지를 다시 불러오는 중이에요.");
    loadRasterFrameAsset(definition, true);
    return;
  }
  if (!definition.image?.complete || !definition.image.naturalWidth) {
    showToast("프레임 이미지를 불러오는 중이에요. 잠시 후 자동 적용됩니다.");
  }
}

function getRasterFrameScreenRect(width, height, definition) {
  if (!definition) return null;
  return {
    x: definition.screen.x * width,
    y: definition.screen.y * height,
    width: definition.screen.width * width,
    height: definition.screen.height * height,
  };
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
  const point = { x: cssX / scale, y: cssY / scale };
  const contentSize = getEditorContentSize();
  let contentRect = null;
  const rasterFrame = getActiveRasterFrameDefinition();
  if (rasterFrame?.image?.complete && rasterFrame.image.naturalWidth) {
    contentRect = getRasterFrameScreenRect(elements.canvas.width, elements.canvas.height, rasterFrame);
  }
  else if (state.streamFrame !== "off") {
    contentRect = getStreamImageRect(elements.canvas.width, elements.canvas.height, state.streamFrame);
  }
  else if (state.xpOverlay) contentRect = getXpImageRect(elements.canvas.width, elements.canvas.height);
  if (!contentRect) {
    if (contentSize.width === elements.canvas.width && contentSize.height === elements.canvas.height) return point;
    return {
      x: point.x / elements.canvas.width * contentSize.width,
      y: point.y / elements.canvas.height * contentSize.height,
    };
  }
  if (
    point.x < contentRect.x
    || point.y < contentRect.y
    || point.x > contentRect.x + contentRect.width
    || point.y > contentRect.y + contentRect.height
  ) return null;
  return {
    x: (point.x - contentRect.x) / contentRect.width * contentSize.width,
    y: (point.y - contentRect.y) / contentRect.height * contentSize.height,
  };
}

function findStickerAt(point) {
  const contentSize = getEditorContentSize();
  for (let index = state.stickers.length - 1; index >= 0; index -= 1) {
    const sticker = state.stickers[index];
    const dimensions = stickerPixelDimensions(sticker, contentSize.width, contentSize.height);
    const dx = point.x - sticker.x * contentSize.width;
    const dy = point.y - sticker.y * contentSize.height;
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
  const contentSize = getEditorContentSize();
  const dimensions = stickerPixelDimensions(sticker, contentSize.width, contentSize.height);
  const localX = dimensions.width / 2;
  const localY = -dimensions.height / 2;
  const cos = Math.cos(sticker.rotation);
  const sin = Math.sin(sticker.rotation);
  const handleX = sticker.x * contentSize.width + localX * cos - localY * sin;
  const handleY = sticker.y * contentSize.height + localX * sin + localY * cos;
  const radius = Math.max(16, Math.min(contentSize.width, contentSize.height) * 0.022);
  return Math.hypot(point.x - handleX, point.y - handleY) <= radius;
}

function isResizeHandleHit(point) {
  const sticker = selectedSticker();
  if (!sticker) return false;
  const contentSize = getEditorContentSize();
  const dimensions = stickerPixelDimensions(sticker, contentSize.width, contentSize.height);
  const localX = dimensions.width / 2;
  const localY = dimensions.height / 2;
  const cos = Math.cos(sticker.rotation);
  const sin = Math.sin(sticker.rotation);
  const handleX = sticker.x * contentSize.width + localX * cos - localY * sin;
  const handleY = sticker.y * contentSize.height + localX * sin + localY * cos;
  const radius = Math.max(16, Math.min(contentSize.width, contentSize.height) * 0.026);
  return Math.hypot(point.x - handleX, point.y - handleY) <= radius;
}

function beginStickerDrag(event) {
  if (!state.image || event.button !== 0 || state.comparing) return;
  const point = canvasPointFromEvent(event);
  if (!point) return;
  if (isResizeHandleHit(point)) {
    const sticker = selectedSticker();
    const contentSize = getEditorContentSize();
    const centerX = sticker.x * contentSize.width;
    const centerY = sticker.y * contentSize.height;
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
  const contentSize = getEditorContentSize();
  state.draggingSticker = {
    mode: "move",
    pointerId: event.pointerId,
    uid: hit.uid,
    offsetX: point.x - hit.x * contentSize.width,
    offsetY: point.y - hit.y * contentSize.height,
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
  const contentSize = getEditorContentSize();
  if (drag.mode === "resize") {
    const definition = stickerDefinitions.get(sticker.assetId);
    const centerX = sticker.x * contentSize.width;
    const centerY = sticker.y * contentSize.height;
    const distance = Math.max(1, Math.hypot(point.x - centerX, point.y - centerY));
    const baseScale = stickerBaseScale(definition);
    sticker.scale = clamp(drag.startScale * distance / drag.startDistance, baseScale * 0.45, baseScale * 1.9);
    event.preventDefault();
    updateStickerUI();
    scheduleRender();
    return;
  }
  const dimensions = stickerPixelDimensions(sticker, contentSize.width, contentSize.height);
  const halfX = dimensions.width / 2 / contentSize.width;
  const halfY = dimensions.height / 2 / contentSize.height;
  sticker.x = clamp((point.x - drag.offsetX) / contentSize.width, halfX * 0.45, 1 - halfX * 0.45);
  sticker.y = clamp((point.y - drag.offsetY) / contentSize.height, halfY * 0.45, 1 - halfY * 0.45);
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
  const streamEnabled = state.streamFrame !== "off";
  elements.streamTools.hidden = !streamEnabled;
  elements.streamThemeControl.hidden = state.streamFrame !== "youtube";
  elements.streamTitle.value = state.streamTitle;
  elements.streamChannel.value = state.streamChannel;
  elements.streamViewers.value = state.streamViewers;
  elements.streamDuration.value = state.streamDuration;
  elements.streamShowTitle.checked = state.streamShowTitle;
  elements.streamShowChannel.checked = state.streamShowChannel;
  elements.streamShowViewers.checked = state.streamShowViewers;
  elements.streamShowDuration.checked = state.streamShowDuration;
  elements.streamZoom.value = String(Math.round(state.streamZoom * 100));
  elements.streamZoomValue.textContent = `${Math.round(state.streamZoom * 100)}%`;
  elements.streamPositionX.value = String(Math.round(state.streamPositionX * 100));
  elements.streamPositionXValue.textContent = `${Math.round(state.streamPositionX * 100)}%`;
  elements.streamPositionY.value = String(Math.round(state.streamPositionY * 100));
  elements.streamPositionYValue.textContent = `${Math.round(state.streamPositionY * 100)}%`;
  elements.streamThemeButtons.forEach((item) => {
    const selected = item.dataset.streamTheme === state.streamTheme;
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  elements.streamFitButtons.forEach((item) => {
    const selected = item.dataset.streamFit === state.streamFit;
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  setNormalizedRangeFill(elements.filmFrameCount);
  setNormalizedRangeFill(elements.streamZoom);
  setNormalizedRangeFill(elements.streamPositionX);
  setNormalizedRangeFill(elements.streamPositionY);
  renderFilmSlotList();
}

function syncCompositeOverlayButtons() {
  elements.xpOverlayButtons.forEach((item) => {
    const selected = item.dataset.xpOverlay === (state.xpOverlay ? "on" : "off");
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  elements.digicamFrameButtons.forEach((item) => {
    const selected = item.dataset.digicamFrame === state.digicamFrame;
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  elements.paintFrameButtons.forEach((item) => {
    const selected = item.dataset.paintFrame === (state.paintFrame ? "on" : "off");
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  elements.streamFrameButtons.forEach((item) => {
    const selected = item.dataset.streamFrame === state.streamFrame;
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
}

function updateVnUI() {
  const enabled = state.vnMode !== "off";
  const sceneMode = state.vnMode === "scene";
  const theme = vnThemes[state.vnStyle] || vnThemes.classic;
  elements.vnTools.hidden = !enabled;
  elements.vnSceneTools.hidden = !sceneMode;
  elements.uploadVnBackground.disabled = false;
  elements.uploadVnCharacter.disabled = !state.image && !state.vnBackground;
  elements.clearVnAssets.disabled = !state.vnBackground && !state.vnCharacter;
  elements.vnCharacterSize.disabled = !state.vnCharacter;
  elements.vnCharacterX.disabled = !state.vnCharacter;
  elements.vnBackgroundStatus.textContent = state.vnBackground
    ? `배경: ${state.vnBackground.name}`
    : "기본 사진을 배경으로 사용";
  elements.vnCharacterStatus.textContent = state.vnCharacter
    ? `캐릭터: ${state.vnCharacter.name}`
    : "캐릭터 없음";
  elements.vnCharacterSize.value = String(Math.round(state.vnCharacterScale * 100));
  elements.vnCharacterSizeValue.textContent = `${Math.round(state.vnCharacterScale * 100)}%`;
  elements.vnCharacterX.value = String(Math.round(state.vnCharacterX * 100));
  elements.vnCharacterXValue.textContent = `${Math.round(state.vnCharacterX * 100)}%`;
  elements.vnBoxColor.value = state.vnBoxColor || theme.boxInput;
  elements.vnNameColor.value = state.vnNameColor || theme.accent;
  elements.resetVnColors.disabled = !state.vnBoxColor && !state.vnNameColor;
  setNormalizedRangeFill(elements.vnCharacterSize);
  setNormalizedRangeFill(elements.vnCharacterX);
}

function releaseVnAsset(asset) {
  if (!asset) return;
  URL.revokeObjectURL(asset.url);
  vnAssetUrls.delete(asset.url);
}

function clearVnAssets() {
  releaseVnAsset(state.vnBackground);
  releaseVnAsset(state.vnCharacter);
  state.vnBackground = null;
  state.vnCharacter = null;
  elements.vnBackgroundInput.value = "";
  elements.vnCharacterInput.value = "";
  updateVnUI();
}

function loadVnAsset(file, kind) {
  if (kind === "character" && !state.image && !state.vnBackground) {
    showToast("배경 이미지를 먼저 불러와 주세요.");
    return;
  }
  if (!file || !file.type.startsWith("image/") || file.size > 30 * 1024 * 1024) {
    showToast("30MB 이하의 이미지 파일을 선택해 주세요.");
    return;
  }
  if (kind === "character" && !["image/png", "image/webp"].includes(file.type)) {
    showToast("누끼 캐릭터는 투명 PNG 또는 WEBP를 사용해 주세요.");
    return;
  }

  const url = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = "async";
  image.onload = () => {
    const key = kind === "background" ? "vnBackground" : "vnCharacter";
    releaseVnAsset(state[key]);
    state[key] = { image, url, name: file.name };
    vnAssetUrls.add(url);
    if (kind === "background" && !state.image) {
      state.image = image;
      state.fileName = file.name;
      state.seed = Math.floor(Math.random() * 100000);
      updateLoadedUI(file);
    }
    updateVnUI();
    scheduleRender();
    showToast(kind === "background" ? "미연시 배경을 불러왔어요." : "누끼 캐릭터를 불러왔어요.");
  };
  image.onerror = () => {
    URL.revokeObjectURL(url);
    showToast("이미지를 읽지 못했어요.");
  };
  image.src = url;
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

function liquifyPointWeight(point) {
  return Math.max(1, point.weight || 1);
}

function mergeLiquifyPoints(first, second) {
  const firstWeight = liquifyPointWeight(first);
  const secondWeight = liquifyPointWeight(second);
  const weight = firstWeight + secondWeight;
  return {
    x: (first.x * firstWeight + second.x * secondWeight) / weight,
    y: (first.y * firstWeight + second.y * secondWeight) / weight,
    dx: (first.dx * firstWeight + second.dx * secondWeight) / weight,
    dy: (first.dy * firstWeight + second.dy * secondWeight) / weight,
    radius: (first.radius * firstWeight + second.radius * secondWeight) / weight,
    kind: first.kind,
    hold: Math.max(first.hold || 0, second.hold || 0),
    weight,
  };
}

function compactLiquifyStroke(stroke) {
  if (stroke.points.length <= 96) return;
  const compacted = [];
  for (let index = 0; index < stroke.points.length; index += 1) {
    const first = stroke.points[index];
    const second = stroke.points[index + 1];
    if (second && first.kind === second.kind && first.kind === "drag") {
      compacted.push(mergeLiquifyPoints(first, second));
      index += 1;
    } else {
      compacted.push(first);
    }
  }
  stroke.points = compacted;
}

function bucketLiquifyHistory(strokes, cellSize) {
  const buckets = new Map();
  strokes.forEach((stroke) => {
    stroke.points.forEach((point) => {
      const direction = point.kind === "drag"
        ? Math.round((Math.atan2(point.dy, point.dx) + Math.PI) / (Math.PI / 4)) % 8
        : 0;
      const key = [
        point.kind,
        Math.floor(point.x / cellSize),
        Math.floor(point.y / cellSize),
        direction,
      ].join(":");
      const existing = buckets.get(key);
      buckets.set(key, existing ? mergeLiquifyPoints(existing, point) : { ...point });
    });
  });
  return [...buckets.values()];
}

function compactLiquifyHistory(activeStroke = null) {
  state.liquifyStrokes.forEach(compactLiquifyStroke);
  if (liquifyPointCount() <= 240 || state.liquifyStrokes.length <= 24) return;

  const keepCount = 24;
  const splitAt = Math.max(1, state.liquifyStrokes.length - keepCount);
  const older = state.liquifyStrokes.slice(0, splitAt).filter((stroke) => stroke !== activeStroke);
  const recent = state.liquifyStrokes.slice(splitAt);
  if (older.length === 0) return;

  let cellSize = 0.026;
  let compactedPoints = bucketLiquifyHistory(older, cellSize);
  while (compactedPoints.length + recent.reduce((sum, stroke) => sum + stroke.points.length, 0) > 190
    && cellSize < 0.09) {
    cellSize += 0.014;
    compactedPoints = bucketLiquifyHistory(older, cellSize);
  }
  state.liquifyStrokes = [{ points: compactedPoints, compacted: true }, ...recent];
}

function addLiquifyPoint(stroke, point, deltaX, deltaY, kind = "drag") {
  const contentSize = getEditorContentSize();
  const brushPoint = {
    x: point.x / contentSize.width,
    y: point.y / contentSize.height,
    dx: deltaX / contentSize.width,
    dy: deltaY / contentSize.height,
    radius: state.liquifyBrushSize,
    kind,
    hold: 0,
    weight: 1,
  };
  stroke.points.push(brushPoint);
  compactLiquifyStroke(stroke);
  compactLiquifyHistory(stroke);
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
  state.liquifyStrokes.push(stroke);
  const anchorPoint = addLiquifyPoint(stroke, point, 0, 0, "wave");
  if (!anchorPoint) {
    state.liquifyStrokes.pop();
    event.preventDefault();
    return true;
  }
  const painting = {
    pointerId: event.pointerId,
    stroke,
    lastX: point.x,
    lastY: point.y,
    startX: point.x,
    startY: point.y,
    moved: false,
    anchorPoint,
    holdPoint: null,
    holdTimeout: null,
    holdInterval: null,
  };
  state.paintingLiquify = painting;
  scheduleRender();
  painting.holdTimeout = window.setTimeout(() => {
    if (state.paintingLiquify !== painting || painting.moved) return;
    const holdPoint = painting.anchorPoint;
    holdPoint.kind = "twirl";
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
  const contentSize = getEditorContentSize();
  const spacing = Math.min(contentSize.width, contentSize.height)
    * Math.max(0.0035, state.liquifyBrushSize * 0.045);
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
  if (!painting.moved && !painting.holdPoint && !painting.anchorPoint) {
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

function applySelectedFilter(ctx, canvas, width, height, seed = state.seed, animationPhase = 0) {
  const phase = patternPhaseRadians() + animationPhase;

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
  if (state.filter === "softglow") applySoftGlow(ctx, width, height, state.strength, animationPhase);
  if (state.filter === "heartbokeh") applyHeartBokeh(ctx, width, height, state.strength, seed, animationPhase);
  if (state.filter === "milkyveil") applyMilkyVeil(ctx, width, height, state.strength);
  if (state.filter === "hearttunnel") applyHeartTunnel(ctx, width, height, state.strength);

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

function fillRoundedRect(ctx, x, y, width, height, radius, fillStyle) {
  ctx.save();
  roundedRectPath(ctx, x, y, width, height, radius);
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.restore();
}

function drawStreamImage(ctx, image, rect) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  if (!sourceWidth || !sourceHeight) return;
  const targetAspect = rect.width / rect.height;
  const sourceAspect = sourceWidth / sourceHeight;
  const baseScale = state.streamFit === "contain"
    ? Math.min(rect.width / sourceWidth, rect.height / sourceHeight)
    : Math.max(rect.width / sourceWidth, rect.height / sourceHeight);
  const scale = baseScale * state.streamZoom;
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const overflowX = Math.max(0, drawWidth - rect.width);
  const overflowY = Math.max(0, drawHeight - rect.height);
  const x = rect.x + (rect.width - drawWidth) / 2 - overflowX * (state.streamPositionX - 0.5);
  const y = rect.y + (rect.height - drawHeight) / 2 - overflowY * (state.streamPositionY - 0.5);

  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.width, rect.height);
  ctx.clip();
  ctx.fillStyle = "#09090b";
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, x, y, drawWidth, drawHeight);
  ctx.restore();
}

function fitCanvasFont(ctx, text, maxWidth, preferredSize, minimumSize, weight, family) {
  let size = preferredSize;
  const safeText = text || "";
  while (size > minimumSize) {
    ctx.font = `${weight} ${Math.round(size)}px ${family}`;
    if (ctx.measureText(safeText).width <= maxWidth) break;
    size -= 1;
  }
  return size;
}

function ellipsizeCanvasText(ctx, text, maxWidth) {
  const characters = [...String(text || "")];
  if (ctx.measureText(characters.join("")).width <= maxWidth) return characters.join("");
  while (characters.length && ctx.measureText(`${characters.join("")}…`).width > maxWidth) characters.pop();
  return `${characters.join("")}…`;
}

function wrapStreamTitle(ctx, text, maxWidth, maxLines = 2) {
  const source = String(text || "").trim();
  if (!source) return [];
  const lines = [];
  let line = "";
  for (const character of [...source]) {
    const candidate = line + character;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line.trimEnd());
      line = character.trimStart();
      if (lines.length === maxLines) break;
    } else {
      line = candidate;
    }
  }
  if (lines.length < maxLines && line) lines.push(line.trimEnd());
  if (lines.length === maxLines) lines[maxLines - 1] = ellipsizeCanvasText(ctx, lines[maxLines - 1], maxWidth);
  return lines;
}

function drawYoutubeMark(ctx, x, y, size) {
  const width = size * 1.5;
  const height = size;
  fillRoundedRect(ctx, x, y, width, height, height * 0.24, "#ff0033");
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(x + width * 0.43, y + height * 0.27);
  ctx.lineTo(x + width * 0.43, y + height * 0.73);
  ctx.lineTo(x + width * 0.72, y + height * 0.5);
  ctx.closePath();
  ctx.fill();
}

function drawTwitchMark(ctx, x, y, size) {
  ctx.save();
  ctx.fillStyle = "#9147ff";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x + size, y + size * 0.72);
  ctx.lineTo(x + size * 0.68, y + size);
  ctx.lineTo(x + size * 0.45, y + size);
  ctx.lineTo(x + size * 0.27, y + size * 1.18);
  ctx.lineTo(x + size * 0.27, y + size);
  ctx.lineTo(x, y + size);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.fillRect(x + size * 0.28, y + size * 0.2, size * 0.16, size * 0.46);
  ctx.fillRect(x + size * 0.6, y + size * 0.2, size * 0.16, size * 0.46);
  ctx.restore();
}

function drawStreamAvatar(ctx, x, y, radius, color, label) {
  const initial = [...String(label || "S").trim()][0] || "S";
  ctx.save();
  const glow = ctx.createLinearGradient(x - radius, y - radius, x + radius, y + radius);
  glow.addColorStop(0, color);
  glow.addColorStop(1, "#78dce8");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.9)";
  ctx.lineWidth = Math.max(2, radius * 0.08);
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round(radius * 0.92)}px Arial, sans-serif`;
  ctx.fillText(initial.toUpperCase(), x, y + radius * 0.06);
  ctx.restore();
}

function drawLiveBadge(ctx, x, y, height) {
  const width = height * 2.1;
  fillRoundedRect(ctx, x, y, width, height, height * 0.18, "#e91916");
  ctx.fillStyle = "#fff";
  ctx.font = `700 ${Math.round(height * 0.5)}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("LIVE", x + width / 2, y + height * 0.53);
}

function drawPlayerControls(ctx, rect, options = {}) {
  const unit = Math.max(1, Math.min(rect.width, rect.height) * 0.006);
  const barHeight = rect.height * 0.13;
  const gradient = ctx.createLinearGradient(0, rect.y + rect.height - barHeight, 0, rect.y + rect.height);
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,.82)");
  ctx.fillStyle = gradient;
  ctx.fillRect(rect.x, rect.y + rect.height - barHeight, rect.width, barHeight);

  const progressY = rect.y + rect.height - barHeight * 0.48;
  ctx.fillStyle = "rgba(255,255,255,.34)";
  ctx.fillRect(rect.x + rect.width * 0.025, progressY, rect.width * 0.95, unit);
  ctx.fillStyle = options.accent || "#f00";
  ctx.fillRect(rect.x + rect.width * 0.025, progressY, rect.width * 0.38, unit);

  const iconY = rect.y + rect.height - barHeight * 0.24;
  const icon = barHeight * 0.22;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(rect.x + rect.width * 0.03, iconY - icon * 0.65);
  ctx.lineTo(rect.x + rect.width * 0.03, iconY + icon * 0.65);
  ctx.lineTo(rect.x + rect.width * 0.03 + icon, iconY);
  ctx.closePath();
  ctx.fill();

  const speakerX = rect.x + rect.width * 0.065;
  ctx.fillRect(speakerX, iconY - icon * 0.25, icon * 0.32, icon * 0.5);
  ctx.beginPath();
  ctx.moveTo(speakerX + icon * 0.32, iconY - icon * 0.25);
  ctx.lineTo(speakerX + icon * 0.78, iconY - icon * 0.63);
  ctx.lineTo(speakerX + icon * 0.78, iconY + icon * 0.63);
  ctx.lineTo(speakerX + icon * 0.32, iconY + icon * 0.25);
  ctx.closePath();
  ctx.fill();

  if (state.streamShowDuration && state.streamDuration.trim()) {
    ctx.font = `600 ${Math.max(10, Math.round(barHeight * 0.2))}px Arial, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(state.streamDuration.trim(), rect.x + rect.width * 0.105, iconY);
  }

  const right = rect.x + rect.width * 0.965;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = unit * 0.75;
  ctx.strokeRect(right - icon * 1.05, iconY - icon * 0.6, icon * 1.05, icon * 1.2);
  ctx.beginPath();
  ctx.arc(right - icon * 2.35, iconY, icon * 0.55, 0, Math.PI * 2);
  ctx.stroke();
}

function getStreamOutputSize(maxSide, platform = state.streamFrame) {
  const aspect = platform === "twitch" ? 3 / 2 : 4 / 3;
  return {
    width: Math.max(1, Math.round(maxSide)),
    height: Math.max(1, Math.round(maxSide / aspect)),
  };
}

function getStreamImageRect(width, height, platform = state.streamFrame) {
  if (platform === "twitch") {
    const top = height * 0.07;
    const left = width * 0.06;
    const playerWidth = width - left;
    return { x: left, y: top, width: playerWidth, height: playerWidth * 9 / 16 };
  }
  const playerWidth = width * 0.92;
  return { x: width * 0.04, y: height * 0.08, width: playerWidth, height: playerWidth * 9 / 16 };
}

function drawYoutubeStreamFrame(ctx, width, height, source) {
  const dark = state.streamTheme === "dark";
  const colors = dark
    ? { page: "#0f0f0f", panel: "#181818", text: "#f1f1f1", muted: "#aaa", pill: "#2a2a2a", border: "#303030" }
    : { page: "#fff", panel: "#fff", text: "#0f0f0f", muted: "#606060", pill: "#f2f2f2", border: "#dedede" };
  const rect = getStreamImageRect(width, height, "youtube");
  const unit = Math.max(1, Math.min(width, height) * 0.004);
  const pad = width * 0.04;
  const headerHeight = height * 0.065;

  ctx.fillStyle = colors.page;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = colors.panel;
  ctx.fillRect(0, 0, width, headerHeight);
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = unit * 0.6;
  ctx.beginPath();
  ctx.moveTo(0, headerHeight);
  ctx.lineTo(width, headerHeight);
  ctx.stroke();

  drawYoutubeMark(ctx, pad, headerHeight * 0.29, headerHeight * 0.38);
  ctx.fillStyle = colors.text;
  ctx.font = `700 ${Math.round(headerHeight * 0.27)}px Arial, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("YouTube", pad + headerHeight * 0.66, headerHeight * 0.49);
  fillRoundedRect(ctx, width * 0.34, headerHeight * 0.2, width * 0.32, headerHeight * 0.58, headerHeight * 0.29, colors.pill);
  ctx.fillStyle = colors.muted;
  ctx.font = `400 ${Math.round(headerHeight * 0.21)}px Arial, sans-serif`;
  ctx.fillText("검색", width * 0.36, headerHeight * 0.5);
  ctx.strokeStyle = colors.muted;
  ctx.lineWidth = unit * 0.6;
  ctx.beginPath();
  ctx.arc(width * 0.69, headerHeight * 0.45, headerHeight * 0.12, 0, Math.PI * 2);
  ctx.moveTo(width * 0.69 + headerHeight * 0.085, headerHeight * 0.535);
  ctx.lineTo(width * 0.69 + headerHeight * 0.17, headerHeight * 0.62);
  ctx.stroke();

  drawStreamImage(ctx, source, rect);
  drawLiveBadge(ctx, rect.x + rect.width * 0.018, rect.y + rect.height * 0.025, rect.height * 0.052);
  drawPlayerControls(ctx, rect, { accent: "#ff0033" });

  const infoY = rect.y + rect.height + height * 0.025;
  const avatarRadius = height * 0.037;
  drawStreamAvatar(ctx, pad + avatarRadius, infoY + avatarRadius, avatarRadius, "#ff416c", state.streamChannel);
  const textX = pad + avatarRadius * 2.45;
  const rightReserve = width * 0.28;
  const maxTextWidth = width - textX - rightReserve;
  let cursorY = infoY;

  if (state.streamShowTitle && state.streamTitle.trim()) {
    const titleSize = fitCanvasFont(ctx, state.streamTitle.trim(), maxTextWidth * 1.8, height * 0.03, height * 0.021, 700, "Arial, sans-serif");
    ctx.font = `700 ${Math.round(titleSize)}px Arial, sans-serif`;
    ctx.fillStyle = colors.text;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const titleLines = wrapStreamTitle(ctx, state.streamTitle.trim(), maxTextWidth, 2);
    titleLines.forEach((line, index) => ctx.fillText(line, textX, cursorY + index * titleSize * 1.24));
    cursorY += Math.max(titleSize * 1.3, titleLines.length * titleSize * 1.24);
  }

  if (state.streamShowChannel && state.streamChannel.trim()) {
    ctx.fillStyle = colors.text;
    ctx.font = `600 ${Math.round(height * 0.02)}px Arial, sans-serif`;
    ctx.fillText(ellipsizeCanvasText(ctx, state.streamChannel.trim(), maxTextWidth * 0.68), textX, cursorY);
    cursorY += height * 0.03;
  }
  if (state.streamShowViewers && state.streamViewers.trim()) {
    ctx.fillStyle = colors.muted;
    ctx.font = `400 ${Math.round(height * 0.017)}px Arial, sans-serif`;
    ctx.fillText(`시청자 ${state.streamViewers.trim()}명`, textX, cursorY);
  }

  const subscribeW = width * 0.105;
  const subscribeH = height * 0.046;
  const subscribeX = width - pad - subscribeW;
  const subscribeY = infoY + height * 0.012;
  fillRoundedRect(ctx, subscribeX, subscribeY, subscribeW, subscribeH, subscribeH / 2, dark ? "#f1f1f1" : "#0f0f0f");
  ctx.fillStyle = dark ? "#0f0f0f" : "#fff";
  ctx.font = `700 ${Math.round(subscribeH * 0.36)}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("구독", subscribeX + subscribeW / 2, subscribeY + subscribeH / 2);
  ctx.textAlign = "left";
}

function drawTwitchStreamFrame(ctx, width, height, source) {
  const topHeight = height * 0.07;
  const sideWidth = width * 0.06;
  const rect = getStreamImageRect(width, height, "twitch");
  const infoY = rect.y + rect.height;
  const unit = Math.max(1, Math.min(width, height) * 0.004);

  ctx.fillStyle = "#f7f7f8";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, topHeight);
  ctx.shadowColor = "rgba(0,0,0,.12)";
  ctx.shadowBlur = unit * 2;
  ctx.shadowOffsetY = unit;
  ctx.fillRect(0, topHeight - unit, width, unit);
  ctx.shadowColor = "transparent";

  const markSize = topHeight * 0.42;
  drawTwitchMark(ctx, topHeight * 0.24, topHeight * 0.2, markSize);
  ctx.fillStyle = "#18181b";
  ctx.font = `700 ${Math.round(topHeight * 0.25)}px Arial, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText("탐색", topHeight * 0.24 + markSize * 1.55, topHeight * 0.5);
  ctx.fillText("⋮", width * 0.09, topHeight * 0.49);

  const searchW = width * 0.34;
  const searchH = topHeight * 0.64;
  const searchX = width * 0.3;
  fillRoundedRect(ctx, searchX, topHeight * 0.18, searchW, searchH, searchH * 0.12, "#efeff1");
  ctx.strokeStyle = "#8e8e93";
  ctx.lineWidth = unit * 0.45;
  roundedRectPath(ctx, searchX, topHeight * 0.18, searchW, searchH, searchH * 0.12);
  ctx.stroke();
  ctx.fillStyle = "#53535f";
  ctx.font = `400 ${Math.round(topHeight * 0.22)}px Arial, sans-serif`;
  ctx.fillText("검색", searchX + searchH * 0.35, topHeight * 0.5);
  fillRoundedRect(ctx, width * 0.825, topHeight * 0.22, width * 0.06, topHeight * 0.56, topHeight * 0.28, "#efeff1");
  fillRoundedRect(ctx, width * 0.892, topHeight * 0.22, width * 0.075, topHeight * 0.56, topHeight * 0.28, "#9147ff");
  ctx.fillStyle = "#18181b";
  ctx.font = `700 ${Math.round(topHeight * 0.19)}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("로그인", width * 0.855, topHeight * 0.5);
  ctx.fillStyle = "#fff";
  ctx.fillText("회원가입", width * 0.9295, topHeight * 0.5);

  ctx.fillStyle = "#efeff1";
  ctx.fillRect(0, topHeight, sideWidth, height - topHeight);
  const avatarRadius = sideWidth * 0.25;
  const avatarColors = ["#9147ff", "#e91916", "#18a558", "#477cff", "#ff7b54", "#6b4eff", "#1f9d8b"];
  avatarColors.forEach((color, index) => {
    const x = sideWidth / 2;
    const y = topHeight + sideWidth * (0.48 + index * 0.72);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, avatarRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.78)";
    ctx.beginPath();
    ctx.arc(x, y - avatarRadius * 0.18, avatarRadius * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y + avatarRadius * 0.58, avatarRadius * 0.6, Math.PI, Math.PI * 2);
    ctx.fill();
  });

  drawStreamImage(ctx, source, rect);
  drawLiveBadge(ctx, rect.x + rect.width * 0.012, rect.y + rect.height * 0.022, rect.height * 0.05);
  drawPlayerControls(ctx, rect, { accent: "#9147ff" });

  ctx.fillStyle = "#fff";
  ctx.fillRect(sideWidth, infoY, width - sideWidth, height - infoY);
  const infoHeight = height - infoY;
  const channelAvatar = Math.min(infoHeight * 0.32, width * 0.033);
  const avatarX = sideWidth + width * 0.028 + channelAvatar;
  const avatarY = infoY + infoHeight * 0.45;
  drawStreamAvatar(ctx, avatarX, avatarY, channelAvatar, "#9147ff", state.streamChannel);

  const textX = avatarX + channelAvatar * 1.48;
  const textMax = width * 0.48;
  let cursorY = infoY + infoHeight * 0.18;
  if (state.streamShowTitle && state.streamTitle.trim()) {
    const preferred = Math.max(15, infoHeight * 0.17);
    const size = fitCanvasFont(ctx, state.streamTitle.trim(), textMax, preferred, Math.max(12, infoHeight * 0.11), 700, "Arial, sans-serif");
    ctx.font = `700 ${Math.round(size)}px Arial, sans-serif`;
    ctx.fillStyle = "#18181b";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(ellipsizeCanvasText(ctx, state.streamTitle.trim(), textMax), textX, cursorY);
    cursorY += size * 1.55;
  }
  if (state.streamShowChannel && state.streamChannel.trim()) {
    ctx.fillStyle = "#772ce8";
    ctx.font = `700 ${Math.max(12, Math.round(infoHeight * 0.13))}px Arial, sans-serif`;
    ctx.fillText(ellipsizeCanvasText(ctx, state.streamChannel.trim(), textMax * 0.72), textX, cursorY);
  }

  const buttonH = infoHeight * 0.3;
  fillRoundedRect(ctx, width * 0.625, infoY + infoHeight * 0.19, width * 0.085, buttonH, buttonH * 0.2, "#9147ff");
  fillRoundedRect(ctx, width * 0.72, infoY + infoHeight * 0.19, width * 0.115, buttonH, buttonH * 0.2, "#efeff1");
  ctx.font = `700 ${Math.max(11, Math.round(buttonH * 0.36))}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText("팔로우", width * 0.6675, infoY + infoHeight * 0.34);
  ctx.fillStyle = "#18181b";
  ctx.fillText("구독하기", width * 0.7775, infoY + infoHeight * 0.34);

  ctx.textAlign = "right";
  ctx.fillStyle = "#e91916";
  ctx.font = `700 ${Math.max(11, Math.round(infoHeight * 0.13))}px Arial, sans-serif`;
  const metaParts = [];
  if (state.streamShowViewers && state.streamViewers.trim()) metaParts.push(`● ${state.streamViewers.trim()}`);
  if (state.streamShowDuration && state.streamDuration.trim()) metaParts.push(state.streamDuration.trim());
  ctx.fillText(metaParts.join("   "), width * 0.965, infoY + infoHeight * 0.5);
}

function composeStreamFrame(canvas, maxSide) {
  const platform = state.streamFrame;
  if (platform === "off") return { width: canvas.width, height: canvas.height };
  const source = snapshotCanvas(canvas);
  const output = getStreamOutputSize(maxSide, platform);
  canvas.width = output.width;
  canvas.height = output.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  if (platform === "twitch") drawTwitchStreamFrame(ctx, output.width, output.height, source);
  else drawYoutubeStreamFrame(ctx, output.width, output.height, source);
  return output;
}

function renderFilmFrame(image, width, height, seed, originalOnly = false, animationPhase = 0) {
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
  if (!originalOnly) applySelectedFilter(ctx, canvas, width, height, seed, animationPhase);
  return canvas;
}

function drawVnCharacter(ctx, width, height) {
  const asset = state.vnCharacter?.image;
  if (!asset?.naturalWidth) return;
  const aspect = asset.naturalWidth / asset.naturalHeight;
  let targetHeight = height * state.vnCharacterScale;
  let targetWidth = targetHeight * aspect;
  if (targetWidth > width * 0.92) {
    const correction = width * 0.92 / targetWidth;
    targetWidth *= correction;
    targetHeight *= correction;
  }
  const x = width * state.vnCharacterX - targetWidth / 2;
  const y = height - targetHeight;
  ctx.save();
  ctx.shadowColor = "rgba(12,14,30,.34)";
  ctx.shadowBlur = Math.max(4, Math.min(width, height) * 0.018);
  ctx.shadowOffsetX = -Math.min(width, height) * 0.006;
  ctx.drawImage(asset, x, y, targetWidth, targetHeight);
  ctx.restore();
}

function wrapVnText(ctx, text, maxWidth, maxLines) {
  const lines = [];
  let line = "";
  for (const character of [...text]) {
    if (character === "\n") {
      lines.push(line);
      line = "";
      if (lines.length >= maxLines) break;
      continue;
    }
    const candidate = line + character;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = character.trimStart();
      if (lines.length >= maxLines) break;
    } else {
      line = candidate;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines && ctx.measureText(lines.at(-1)).width > maxWidth * 0.96) {
    lines[lines.length - 1] = `${lines.at(-1).slice(0, -1)}…`;
  }
  return lines;
}

function drawVnDialogue(ctx, width, height) {
  if (state.vnMode === "off") return;
  const minSide = Math.min(width, height);
  const margin = Math.max(12, minSide * 0.038);
  const boxHeight = Math.max(minSide * 0.25, height * 0.23);
  const x = margin;
  const y = height - boxHeight - margin;
  const boxWidth = width - margin * 2;
  const lineWidth = Math.max(2, minSide * 0.004);
  const nameHeight = Math.max(30, boxHeight * 0.25);
  const nameSize = Math.max(12, Math.round(minSide * 0.026));
  const bodySize = Math.max(14, Math.round(minSide * 0.031));
  const fontFamily = state.vnFont === "serif"
    ? '"Batang", "Times New Roman", serif'
    : '"Mona12", "Dotum", sans-serif';
  const theme = vnThemes[state.vnStyle] || vnThemes.classic;
  const boxColor = state.vnBoxColor ? hexColorToRgba(state.vnBoxColor, 0.9) : theme.box;
  const accentColor = state.vnNameColor || theme.accent;
  const bodyTextColor = state.vnBoxColor ? readableTextColor(state.vnBoxColor) : theme.text;
  const nameTextColor = state.vnNameColor
    ? readableTextColor(state.vnNameColor)
    : (state.vnStyle === "pink" ? "#fffdf7" : theme.text);
  const displayName = state.vnName.trim() || "이름";
  const nameX = x + margin * 0.55;
  const nameY = y - nameHeight * 0.38;
  const namePaddingX = Math.max(margin * 0.72, nameHeight * 0.3);
  const maxNameWidth = boxWidth - margin * 1.1;

  ctx.save();
  ctx.font = `700 ${nameSize}px ${fontFamily}`;
  const measuredNameWidth = ctx.measureText(displayName).width;
  const nameWidth = Math.min(
    maxNameWidth,
    Math.max(boxWidth * 0.2, measuredNameWidth + namePaddingX * 2),
  );
  const availableNameTextWidth = Math.max(1, nameWidth - namePaddingX * 2);
  const fittedNameSize = measuredNameWidth > availableNameTextWidth
    ? Math.max(6, Math.floor(nameSize * availableNameTextWidth / measuredNameWidth))
    : nameSize;

  ctx.shadowColor = theme.shadow;
  ctx.shadowBlur = minSide * 0.022;
  ctx.shadowOffsetY = minSide * 0.008;
  ctx.fillStyle = boxColor;
  ctx.fillRect(x, y, boxWidth, boxHeight);
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(x + lineWidth / 2, y + lineWidth / 2, boxWidth - lineWidth, boxHeight - lineWidth);
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = lineWidth * 0.65;
  ctx.strokeRect(x + lineWidth * 2.4, y + lineWidth * 2.4, boxWidth - lineWidth * 4.8, boxHeight - lineWidth * 4.8);

  ctx.fillStyle = accentColor;
  ctx.fillRect(nameX, nameY, nameWidth, nameHeight);
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(nameX, nameY, nameWidth, nameHeight);

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = nameTextColor;
  ctx.font = `700 ${fittedNameSize}px ${fontFamily}`;
  ctx.fillText(displayName, nameX + nameWidth / 2, nameY + nameHeight / 2);

  const contentPadding = Math.max(margin * 1.15, nameHeight * 1.08);
  const marker = Math.max(11, minSide * 0.017);
  ctx.fillStyle = bodyTextColor;
  ctx.font = `400 ${bodySize}px ${fontFamily}`;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  const textX = x + contentPadding;
  const textY = y + contentPadding;
  const maxWidth = Math.max(bodySize * 4, boxWidth - contentPadding * 2 - marker * 1.35);
  const lineHeight = bodySize * 1.55;
  wrapVnText(ctx, state.vnDialogue || "대사를 입력하세요.", maxWidth, 3).forEach((line, index) => {
    ctx.fillText(line, textX, textY + index * lineHeight);
  });

  ctx.fillStyle = accentColor;
  const markerX = x + boxWidth - contentPadding - marker;
  const markerY = y + boxHeight - contentPadding - marker;
  ctx.beginPath();
  ctx.moveTo(markerX, markerY);
  ctx.lineTo(markerX + marker, markerY);
  ctx.lineTo(markerX + marker * 0.5, markerY + marker);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function composeFilmStrip(
  targetCanvas,
  maxSide,
  originalOnly = false,
  animationPhase = 0,
  renderSeed = state.seed,
) {
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
      ? renderFilmFrame(custom.image, frameWidth, frameHeight, renderSeed + index * 131, originalOnly, animationPhase)
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

  const random = mulberry32(renderSeed + count * 41);
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

function getXpImageRect(width, height) {
  const minSide = Math.min(width, height);
  const unit = Math.max(1, minSide * 0.003);
  const titleHeight = Math.max(24, height * 0.052);
  const windowX = width * 0.13;
  const windowY = height * 0.12;
  const windowW = width * 0.72;
  const windowH = height * 0.7;
  const menuHeight = Math.max(18, height * 0.04);
  return {
    x: windowX + windowW * 0.025,
    y: windowY + titleHeight + menuHeight + windowH * 0.025,
    width: windowW * 0.95,
    height: windowH - titleHeight - menuHeight - windowH * 0.065,
    unit,
  };
}

function composeXpDesktop(canvas, width, height) {
  const source = snapshotCanvas(canvas);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const minSide = Math.min(width, height);
  const unit = Math.max(1, minSide * 0.003);
  const taskbarHeight = Math.max(32, height * 0.09);
  const fontSize = Math.max(9, Math.round(minSide * 0.022));
  const titleHeight = Math.max(24, height * 0.052);
  ctx.clearRect(0, 0, width, height);

  const desktop = ctx.createLinearGradient(0, 0, width, height);
  desktop.addColorStop(0, "#5a76df");
  desktop.addColorStop(0.46, "#b8eafa");
  desktop.addColorStop(0.72, "#8ca6f2");
  desktop.addColorStop(1, "#4fc8e6");
  ctx.fillStyle = desktop;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  [[0.15, 0.17, 0.25], [0.78, 0.22, 0.32], [0.43, 0.72, 0.38], [0.94, 0.78, 0.23]]
    .forEach(([x, y, radius]) => {
      const cloud = ctx.createRadialGradient(width * x, height * y, 0, width * x, height * y, minSide * radius);
      cloud.addColorStop(0, "rgba(255,255,255,.72)");
      cloud.addColorStop(0.38, "rgba(231,250,255,.34)");
      cloud.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = cloud;
      ctx.fillRect(0, 0, width, height - taskbarHeight);
    });
  ctx.restore();

  ctx.font = `700 ${fontSize}px "Mona12", "Courier New", monospace`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  const iconX = width * 0.055;
  const iconSize = minSide * 0.052;
  [[0.16, "PC", "#d8e5f4"], [0.34, "PIX", "#f4da62"], [0.52, "NET", "#8ee2ff"]]
    .forEach(([y, label, color]) => {
      const top = height * y;
      ctx.fillStyle = "rgba(0,0,72,.28)";
      ctx.fillRect(iconX - iconSize * 0.42 + unit, top - iconSize * 0.42 + unit, iconSize * 0.84, iconSize * 0.72);
      ctx.fillStyle = color;
      ctx.fillRect(iconX - iconSize * 0.42, top - iconSize * 0.42, iconSize * 0.84, iconSize * 0.72);
      ctx.strokeStyle = "rgba(255,255,255,.86)";
      ctx.lineWidth = unit;
      ctx.strokeRect(iconX - iconSize * 0.42, top - iconSize * 0.42, iconSize * 0.84, iconSize * 0.72);
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "#18327f";
      ctx.shadowBlur = unit * 2;
      ctx.fillText(label, iconX, top + iconSize * 0.62);
      ctx.shadowBlur = 0;
    });

  const backX = width * 0.34;
  const backY = height * 0.045;
  const backW = width * 0.55;
  const backH = height * 0.43;
  ctx.fillStyle = "#d7d7d0";
  ctx.strokeStyle = "#17317e";
  ctx.lineWidth = unit * 1.4;
  ctx.fillRect(backX, backY, backW, backH);
  ctx.strokeRect(backX, backY, backW, backH);
  const backTitle = ctx.createLinearGradient(backX, 0, backX + backW, 0);
  backTitle.addColorStop(0, "#17278e");
  backTitle.addColorStop(1, "#238fd9");
  ctx.fillStyle = backTitle;
  ctx.fillRect(backX + unit, backY + unit, backW - unit * 2, titleHeight);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.fillText("dream_folder", backX + titleHeight * 0.35, backY + titleHeight * 0.54);

  const windowX = width * 0.13;
  const windowY = height * 0.12;
  const windowW = width * 0.72;
  const windowH = height * 0.7;
  const menuHeight = Math.max(18, height * 0.04);
  ctx.fillStyle = "#d4d3cb";
  ctx.strokeStyle = "#102672";
  ctx.lineWidth = unit * 1.8;
  ctx.fillRect(windowX, windowY, windowW, windowH);
  ctx.strokeRect(windowX, windowY, windowW, windowH);
  const title = ctx.createLinearGradient(windowX, 0, windowX + windowW, 0);
  title.addColorStop(0, "#151a86");
  title.addColorStop(0.58, "#116bd0");
  title.addColorStop(1, "#28a6de");
  ctx.fillStyle = title;
  ctx.fillRect(windowX + unit, windowY + unit, windowW - unit * 2, titleHeight);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.fillText("memory_viewer.exe", windowX + titleHeight * 0.34, windowY + titleHeight * 0.54);

  const buttonSize = titleHeight * 0.64;
  ["_", "□", "×"].forEach((label, index) => {
    const x = windowX + windowW - (3 - index) * (buttonSize + unit * 1.5);
    ctx.fillStyle = index === 2 ? "#ef684c" : "#d7e2ef";
    ctx.fillRect(x, windowY + titleHeight * 0.18, buttonSize, buttonSize);
    ctx.strokeStyle = "#f7fbff";
    ctx.lineWidth = unit;
    ctx.strokeRect(x, windowY + titleHeight * 0.18, buttonSize, buttonSize);
    ctx.fillStyle = index === 2 ? "#fff" : "#0e245d";
    ctx.textAlign = "center";
    ctx.fillText(label, x + buttonSize * 0.5, windowY + titleHeight * 0.5);
  });

  ctx.fillStyle = "#eeede7";
  ctx.fillRect(windowX + unit * 2, windowY + titleHeight + unit, windowW - unit * 4, menuHeight);
  ctx.fillStyle = "#252525";
  ctx.textAlign = "left";
  ctx.font = `400 ${Math.max(8, Math.round(fontSize * 0.84))}px "Mona12", "Courier New", monospace`;
  ctx.fillText("File   Edit   View   Image   Help", windowX + menuHeight * 0.35, windowY + titleHeight + menuHeight * 0.52);

  const imageRect = getXpImageRect(width, height);
  const imageX = imageRect.x;
  const imageY = imageRect.y;
  const imageW = imageRect.width;
  const imageH = imageRect.height;
  ctx.fillStyle = "#121722";
  ctx.fillRect(imageX - unit * 2, imageY - unit * 2, imageW + unit * 4, imageH + unit * 4);
  ctx.save();
  ctx.beginPath();
  ctx.rect(imageX, imageY, imageW, imageH);
  ctx.clip();
  drawImageCover(ctx, source, imageX, imageY, imageW, imageH);
  ctx.restore();

  const popupW = width * 0.3;
  const popupH = height * 0.17;
  const popupX = width * 0.64;
  const popupY = height * 0.67;
  ctx.fillStyle = "rgba(224,223,214,.96)";
  ctx.strokeStyle = "#17317e";
  ctx.lineWidth = unit * 1.4;
  ctx.fillRect(popupX, popupY, popupW, popupH);
  ctx.strokeRect(popupX, popupY, popupW, popupH);
  ctx.fillStyle = "#1972c8";
  ctx.fillRect(popupX + unit, popupY + unit, popupW - unit * 2, titleHeight * 0.78);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.fillText("FILTER_2000", popupX + titleHeight * 0.25, popupY + titleHeight * 0.4);
  ctx.fillStyle = "#242424";
  ctx.textAlign = "center";
  ctx.fillText("MEMORY LOADED", popupX + popupW * 0.5, popupY + popupH * 0.62);

  const taskbarY = height - taskbarHeight;
  const bar = ctx.createLinearGradient(0, taskbarY, 0, height);
  bar.addColorStop(0, "#3687e9");
  bar.addColorStop(0.42, "#1e63ce");
  bar.addColorStop(1, "#164aa8");
  ctx.fillStyle = bar;
  ctx.fillRect(0, taskbarY, width, taskbarHeight);
  ctx.fillStyle = "#42a83d";
  ctx.fillRect(0, taskbarY, width * 0.14, taskbarHeight);
  ctx.fillStyle = "#fff";
  ctx.font = `700 ${Math.max(9, Math.round(fontSize * 1.05))}px "Mona12", "Courier New", monospace`;
  ctx.textAlign = "center";
  ctx.fillText("START", width * 0.07, taskbarY + taskbarHeight * 0.52);
  ctx.fillStyle = "#2098d5";
  ctx.fillRect(width * 0.86, taskbarY, width * 0.14, taskbarHeight);
  ctx.fillStyle = "#fff";
  ctx.font = `400 ${Math.max(8, Math.round(fontSize * 0.82))}px "Mona12", "Courier New", monospace`;
  ctx.fillText("8:52 PM", width * 0.93, taskbarY + taskbarHeight * 0.52);
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

function drawDigicamUiLayer(ctx, width, height) {
  const minSide = Math.min(width, height);
  const inset = minSide * 0.044;
  const unit = Math.max(1.5, minSide * 0.0032);
  const typeSize = Math.max(11, Math.round(minSide * 0.03));
  ctx.save();
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";
  ctx.lineWidth = unit;
  ctx.strokeStyle = "rgba(255,255,255,.96)";
  ctx.fillStyle = "rgba(255,255,255,.96)";
  ctx.shadowColor = "rgba(0,0,0,.78)";
  ctx.shadowBlur = unit * 1.6;
  ctx.shadowOffsetX = unit * 0.65;
  ctx.shadowOffsetY = unit * 0.65;
  ctx.font = `700 ${typeSize}px "Mona12", "Courier New", monospace`;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  ctx.fillText("3M", inset, inset);
  ctx.font = `400 ${Math.max(9, Math.round(typeSize * 0.68))}px "Mona12", "Courier New", monospace`;
  ctx.fillText("FINE", inset, inset + typeSize * 1.15);
  ctx.fillText("ISO AUTO", inset, inset + typeSize * 2.05);

  const batteryWidth = minSide * 0.1;
  const batteryHeight = batteryWidth * 0.42;
  const batteryX = width - inset - batteryWidth;
  const batteryY = inset;
  ctx.strokeRect(batteryX, batteryY, batteryWidth, batteryHeight);
  ctx.fillRect(batteryX + batteryWidth, batteryY + batteryHeight * 0.27, unit * 2, batteryHeight * 0.46);
  ctx.fillRect(batteryX + unit * 1.4, batteryY + unit * 1.4, batteryWidth * 0.68, batteryHeight - unit * 2.8);

  ctx.textAlign = "right";
  ctx.fillText("100-0024", width - inset, batteryY + batteryHeight + typeSize * 0.42);
  ctx.fillText("SD", width - inset, height - inset - typeSize);

  const focusWidth = width * 0.22;
  const focusHeight = height * 0.2;
  const focusX = width * 0.5 - focusWidth * 0.5;
  const focusY = height * 0.5 - focusHeight * 0.5;
  const corner = Math.min(focusWidth, focusHeight) * 0.24;
  ctx.beginPath();
  ctx.moveTo(focusX, focusY + corner);
  ctx.lineTo(focusX, focusY);
  ctx.lineTo(focusX + corner, focusY);
  ctx.moveTo(focusX + focusWidth - corner, focusY);
  ctx.lineTo(focusX + focusWidth, focusY);
  ctx.lineTo(focusX + focusWidth, focusY + corner);
  ctx.moveTo(focusX + focusWidth, focusY + focusHeight - corner);
  ctx.lineTo(focusX + focusWidth, focusY + focusHeight);
  ctx.lineTo(focusX + focusWidth - corner, focusY + focusHeight);
  ctx.moveTo(focusX + corner, focusY + focusHeight);
  ctx.lineTo(focusX, focusY + focusHeight);
  ctx.lineTo(focusX, focusY + focusHeight - corner);
  ctx.stroke();

  ctx.fillStyle = "rgba(145,255,91,.96)";
  ctx.fillRect(focusX + focusWidth * 0.47, focusY + focusHeight * 0.45, focusWidth * 0.06, focusHeight * 0.1);
  ctx.fillStyle = "rgba(255,255,255,.96)";
  ctx.textAlign = "left";
  ctx.fillText("⚡ AUTO", inset, height - inset - typeSize);
  ctx.textAlign = "center";
  ctx.fillText("W  ━━━━━  T", width * 0.5, height - inset - typeSize);

  const dateText = state.dateValue.replaceAll("-", ".");
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,214,91,.96)";
  ctx.fillText(dateText, width - inset, height - inset - typeSize * 2.15);
  ctx.restore();
}

function getDigicamLayout(width, height) {
  const quarterTurn = state.cameraRotation % 180 !== 0;
  const reverse = state.cameraRotation === 180 || state.cameraRotation === 270;
  if (quarterTurn) {
    const body = { x: width * 0.09, y: height * 0.025, width: width * 0.82, height: height * 0.95 };
    const railHeight = body.height * 0.18;
    const gap = body.height * 0.045;
    return {
      quarterTurn,
      reverse,
      body,
      rail: {
        x: body.x,
        y: reverse ? body.y : body.y + body.height - railHeight,
        width: body.width,
        height: railHeight,
      },
      screen: {
        x: body.x + body.width * 0.075,
        y: reverse ? body.y + railHeight + gap : body.y + gap,
        width: body.width * 0.85,
        height: body.height - railHeight - gap * 1.55,
      },
    };
  }

  const body = { x: width * 0.025, y: height * 0.09, width: width * 0.95, height: height * 0.82 };
  const railWidth = body.width * 0.18;
  const gap = body.width * 0.04;
  return {
    quarterTurn,
    reverse,
    body,
    rail: {
      x: reverse ? body.x : body.x + body.width - railWidth,
      y: body.y,
      width: railWidth,
      height: body.height,
    },
    screen: {
      x: reverse ? body.x + railWidth + gap : body.x + gap,
      y: body.y + body.height * 0.09,
      width: body.width - railWidth - gap * 1.55,
      height: body.height * 0.78,
    },
  };
}

function composeDigicamFrame(canvas, width, height) {
  const source = snapshotCanvas(canvas);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const { body, screen, rail, quarterTurn } = getDigicamLayout(width, height);
  const minSide = Math.min(width, height);
  const unit = Math.max(1, minSide * 0.004);
  ctx.clearRect(0, 0, width, height);

  const backdrop = ctx.createRadialGradient(width * 0.48, height * 0.46, 0, width * 0.48, height * 0.46, Math.max(width, height) * 0.7);
  backdrop.addColorStop(0, "#343640");
  backdrop.addColorStop(0.72, "#111219");
  backdrop.addColorStop(1, "#07080d");
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.72)";
  ctx.shadowBlur = minSide * 0.05;
  ctx.shadowOffsetY = minSide * 0.022;
  const shell = ctx.createLinearGradient(body.x, body.y, body.x + body.width, body.y + body.height);
  shell.addColorStop(0, "#5b5d66");
  shell.addColorStop(0.18, "#20222b");
  shell.addColorStop(0.72, "#101117");
  shell.addColorStop(1, "#464852");
  ctx.fillStyle = shell;
  ctx.fillRect(body.x, body.y, body.width, body.height);
  ctx.restore();
  ctx.strokeStyle = "#777a84";
  ctx.lineWidth = unit * 1.2;
  ctx.strokeRect(body.x + unit, body.y + unit, body.width - unit * 2, body.height - unit * 2);
  ctx.strokeStyle = "#06070b";
  ctx.lineWidth = unit * 2;
  ctx.strokeRect(screen.x - unit * 2, screen.y - unit * 2, screen.width + unit * 4, screen.height + unit * 4);

  ctx.save();
  ctx.beginPath();
  ctx.rect(screen.x, screen.y, screen.width, screen.height);
  ctx.clip();
  drawImageCover(ctx, source, screen.x, screen.y, screen.width, screen.height);
  ctx.translate(screen.x, screen.y);
  drawDigicamUiLayer(ctx, screen.width, screen.height);
  const glare = ctx.createLinearGradient(0, 0, screen.width, screen.height);
  glare.addColorStop(0, "rgba(255,255,255,.09)");
  glare.addColorStop(0.34, "rgba(255,255,255,0)");
  glare.addColorStop(1, "rgba(135,190,255,.04)");
  ctx.fillStyle = glare;
  ctx.fillRect(0, 0, screen.width, screen.height);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "#090a0f";
  ctx.fillRect(rail.x, rail.y, rail.width, rail.height);
  ctx.strokeStyle = "#565965";
  ctx.lineWidth = unit;
  ctx.strokeRect(rail.x + unit, rail.y + unit, rail.width - unit * 2, rail.height - unit * 2);
  const centerX = rail.x + rail.width * 0.5;
  const centerY = rail.y + rail.height * 0.48;
  const dialRadius = Math.min(rail.width, rail.height) * (quarterTurn ? 0.16 : 0.25);
  ctx.fillStyle = "#2f323b";
  ctx.strokeStyle = "#8a8d97";
  ctx.lineWidth = unit * 1.2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, dialRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#11131a";
  ctx.beginPath();
  ctx.arc(centerX, centerY, dialRadius * 0.42, 0, Math.PI * 2);
  ctx.fill();
  const buttonRadius = dialRadius * 0.28;
  const offset = quarterTurn ? rail.width * 0.28 : rail.height * 0.25;
  [[quarterTurn ? -offset : 0, quarterTurn ? 0 : -offset], [quarterTurn ? offset : 0, quarterTurn ? 0 : offset]]
    .forEach(([dx, dy], index) => {
      ctx.fillStyle = index === 0 ? "#767985" : "#262832";
      ctx.beginPath();
      ctx.arc(centerX + dx, centerY + dy, buttonRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  ctx.fillStyle = "#d8d9df";
  ctx.font = `700 ${Math.max(8, Math.round(minSide * 0.018))}px "Mona12", "Courier New", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("DIGITAL", centerX, rail.y + rail.height * 0.12);
  ctx.restore();

  ctx.fillStyle = "#c7cad3";
  ctx.font = `700 ${Math.max(9, Math.round(minSide * 0.021))}px "Mona12", "Courier New", monospace`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("FILTER_2000  3.2 MEGA PIXELS", body.x + body.width * 0.05, body.y + body.height * 0.955);
}

function roundedRectPath(ctx, x, y, width, height, radius) {
  const safeRadius = Math.min(Math.max(0, radius), width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  ctx.closePath();
}

function composeRasterFrame(canvas, maxSide, definition) {
  const image = definition?.image;
  if (!image?.complete || !image.naturalWidth) {
    return { width: canvas.width, height: canvas.height };
  }

  const source = snapshotCanvas(canvas);
  const sourceX = definition.crop.x * image.naturalWidth;
  const sourceY = definition.crop.y * image.naturalHeight;
  const sourceWidth = definition.crop.width * image.naturalWidth;
  const sourceHeight = definition.crop.height * image.naturalHeight;
  const scale = maxSide / Math.max(sourceWidth, sourceHeight);
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    width,
    height,
  );

  const screen = getRasterFrameScreenRect(width, height, definition);
  ctx.save();
  roundedRectPath(ctx, screen.x, screen.y, screen.width, screen.height, width * definition.radius);
  ctx.clip();
  drawImageCover(ctx, source, screen.x, screen.y, screen.width, screen.height);
  ctx.restore();

  return { width, height };
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
  if (state.cameraOverlay === "digicam") drawDigicamUiLayer(ctx, logicalWidth, logicalHeight);
  else drawCameraUiLayer(ctx, logicalWidth, logicalHeight, state.cameraOverlay);
  ctx.restore();
}

function drawProcessed(
  targetCanvas,
  maxSide = 1500,
  originalOnly = false,
  animationPhase = 0,
  renderSeed = state.seed,
) {
  if (!state.image) return null;

  const sourceImage = state.vnMode === "scene" && state.vnBackground?.image
    ? state.vnBackground.image
    : state.image;
  const crop = getCrop(sourceImage.naturalWidth, sourceImage.naturalHeight, state.ratio);
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
    sourceImage,
    crop.sx,
    crop.sy,
    crop.sw,
    crop.sh,
    0,
    0,
    output.width,
    output.height,
  );
  if (state.vnMode === "scene" && state.vnCharacter) {
    drawVnCharacter(ctx, output.width, output.height);
  }
  ctx.filter = "none";

  if (!originalOnly) {
    applySelectedFilter(ctx, targetCanvas, output.width, output.height, renderSeed, animationPhase);
  }
  let finalOutput = output;
  if (state.filmStrip) {
    finalOutput = composeFilmStrip(targetCanvas, maxSide, originalOnly, animationPhase, renderSeed);
  }
  if (targetCanvas === elements.canvas) {
    state.previewContentSize = { width: finalOutput.width, height: finalOutput.height };
  }
  const rasterFrame = getActiveRasterFrameDefinition();
  if (originalOnly) {
    if (state.streamFrame !== "off") return composeStreamFrame(targetCanvas, maxSide);
    if (rasterFrame) return composeRasterFrame(targetCanvas, maxSide, rasterFrame);
    return finalOutput;
  }
  const finalCtx = targetCanvas.getContext("2d", { willReadFrequently: true });
  const showStickerSelection = targetCanvas === elements.canvas
    && !(state.filter === "liquify" && state.liquifyMode === "brush");
  drawStickers(finalCtx, finalOutput.width, finalOutput.height, showStickerSelection);
  if (state.showDate) addDateStamp(finalCtx, finalOutput.width, finalOutput.height);
  drawVnDialogue(finalCtx, finalOutput.width, finalOutput.height);
  if (state.streamFrame !== "off") finalOutput = composeStreamFrame(targetCanvas, maxSide);
  else if (state.xpOverlay) composeXpDesktop(targetCanvas, finalOutput.width, finalOutput.height);
  if (rasterFrame) finalOutput = composeRasterFrame(targetCanvas, maxSide, rasterFrame);
  else {
    const overlayCtx = targetCanvas.getContext("2d", { willReadFrequently: true });
    drawCameraOverlay(overlayCtx, finalOutput.width, finalOutput.height);
  }

  return finalOutput;
}

function scheduleRender() {
  if (!state.image) return;
  if (state.renderFrame) cancelAnimationFrame(state.renderFrame);
  elements.processing.hidden = false;
  state.renderFrame = requestAnimationFrame(() => {
    // Keep the live brush pass light enough to follow the pointer; the full
    // preview is restored as soon as the stroke ends.
    const previewMaxSide = state.paintingLiquify ? 560 : 1500;
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
  updateVnUI();
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
  state.previewContentSize = null;
  cancelActiveLiquifyPaint();
  clearFilmFrameImages();
  clearVnAssets();
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
  updateVnUI();
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

function safeDownloadBase() {
  return state.fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9가-힣_-]+/g, "-") || "memory";
}

function triggerBlobDownload(blob, extension) {
  const link = document.createElement("a");
  link.download = `${safeDownloadBase()}-${state.filter}.${extension}`;
  link.href = URL.createObjectURL(blob);
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
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
        const actualFormat = blob.type === "image/webp" ? "webp" : "png";
        triggerBlobDownload(blob, actualFormat);
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

elements.xpOverlayButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.xpOverlay = button.dataset.xpOverlay === "on";
    if (state.xpOverlay) {
      state.digicamFrame = "off";
      state.paintFrame = false;
      state.streamFrame = "off";
    }
    syncCompositeOverlayButtons();
    updateOverlayUI();
    scheduleRender();
  });
});

elements.digicamFrameButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.digicamFrame = button.dataset.digicamFrame;
    if (state.digicamFrame !== "off") {
      state.xpOverlay = false;
      state.paintFrame = false;
      state.streamFrame = "off";
    }
    if (state.digicamFrame !== "off") {
      prepareRasterFrame(rasterFrameDefinitions[state.digicamFrame]);
    }
    syncCompositeOverlayButtons();
    updateOverlayUI();
    scheduleRender();
  });
});

elements.paintFrameButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.paintFrame = button.dataset.paintFrame === "on";
    if (state.paintFrame) {
      state.xpOverlay = false;
      state.digicamFrame = "off";
      state.streamFrame = "off";
    }
    if (state.paintFrame) prepareRasterFrame(rasterFrameDefinitions.paint);
    syncCompositeOverlayButtons();
    updateOverlayUI();
    scheduleRender();
  });
});

elements.streamFrameButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.streamFrame = button.dataset.streamFrame;
    if (state.streamFrame !== "off") {
      state.xpOverlay = false;
      state.digicamFrame = "off";
      state.paintFrame = false;
    }
    syncCompositeOverlayButtons();
    updateOverlayUI();
    scheduleRender();
  });
});

elements.streamThemeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.streamTheme = button.dataset.streamTheme;
    updateOverlayUI();
    scheduleRender();
  });
});

elements.streamFitButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.streamFit = button.dataset.streamFit;
    updateOverlayUI();
    scheduleRender();
  });
});

[
  [elements.streamTitle, "streamTitle"],
  [elements.streamChannel, "streamChannel"],
  [elements.streamViewers, "streamViewers"],
  [elements.streamDuration, "streamDuration"],
].forEach(([input, key]) => {
  input.addEventListener("input", () => {
    state[key] = input.value;
    scheduleRender();
  });
});

[
  [elements.streamShowTitle, "streamShowTitle"],
  [elements.streamShowChannel, "streamShowChannel"],
  [elements.streamShowViewers, "streamShowViewers"],
  [elements.streamShowDuration, "streamShowDuration"],
].forEach(([input, key]) => {
  input.addEventListener("change", () => {
    state[key] = input.checked;
    scheduleRender();
  });
});

elements.streamZoom.addEventListener("input", () => {
  state.streamZoom = Number(elements.streamZoom.value) / 100;
  elements.streamZoomValue.textContent = `${elements.streamZoom.value}%`;
  setNormalizedRangeFill(elements.streamZoom);
  scheduleRender();
});

elements.streamPositionX.addEventListener("input", () => {
  state.streamPositionX = Number(elements.streamPositionX.value) / 100;
  elements.streamPositionXValue.textContent = `${elements.streamPositionX.value}%`;
  setNormalizedRangeFill(elements.streamPositionX);
  scheduleRender();
});

elements.streamPositionY.addEventListener("input", () => {
  state.streamPositionY = Number(elements.streamPositionY.value) / 100;
  elements.streamPositionYValue.textContent = `${elements.streamPositionY.value}%`;
  setNormalizedRangeFill(elements.streamPositionY);
  scheduleRender();
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

elements.vnModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.vnMode = button.dataset.vnMode;
    elements.vnModeButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    updateVnUI();
    scheduleRender();
  });
});

elements.vnStyleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.vnStyle = button.dataset.vnStyle;
    elements.vnStyleButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    updateVnUI();
    scheduleRender();
  });
});

elements.vnFontButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.vnFont = button.dataset.vnFont;
    elements.vnFontButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    scheduleRender();
  });
});

elements.vnName.addEventListener("input", () => {
  state.vnName = elements.vnName.value;
  scheduleRender();
});

elements.vnDialogue.addEventListener("input", () => {
  state.vnDialogue = elements.vnDialogue.value;
  scheduleRender();
});

elements.vnBoxColor.addEventListener("input", () => {
  state.vnBoxColor = elements.vnBoxColor.value;
  updateVnUI();
  scheduleRender();
});

elements.vnNameColor.addEventListener("input", () => {
  state.vnNameColor = elements.vnNameColor.value;
  updateVnUI();
  scheduleRender();
});

elements.resetVnColors.addEventListener("click", () => {
  state.vnBoxColor = null;
  state.vnNameColor = null;
  updateVnUI();
  scheduleRender();
});

elements.uploadVnBackground.addEventListener("click", () => elements.vnBackgroundInput.click());
elements.uploadVnCharacter.addEventListener("click", () => elements.vnCharacterInput.click());
elements.vnBackgroundInput.addEventListener("change", () => loadVnAsset(elements.vnBackgroundInput.files[0], "background"));
elements.vnCharacterInput.addEventListener("change", () => loadVnAsset(elements.vnCharacterInput.files[0], "character"));

elements.vnCharacterSize.addEventListener("input", () => {
  state.vnCharacterScale = Number(elements.vnCharacterSize.value) / 100;
  elements.vnCharacterSizeValue.textContent = `${elements.vnCharacterSize.value}%`;
  setNormalizedRangeFill(elements.vnCharacterSize);
  scheduleRender();
});

elements.vnCharacterX.addEventListener("input", () => {
  state.vnCharacterX = Number(elements.vnCharacterX.value) / 100;
  elements.vnCharacterXValue.textContent = `${elements.vnCharacterX.value}%`;
  setNormalizedRangeFill(elements.vnCharacterX);
  scheduleRender();
});

elements.clearVnAssets.addEventListener("click", () => {
  clearVnAssets();
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
  vnAssetUrls.forEach((url) => URL.revokeObjectURL(url));
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
setNormalizedRangeFill(elements.vnCharacterSize);
setNormalizedRangeFill(elements.vnCharacterX);
setNormalizedRangeFill(elements.streamZoom);
setNormalizedRangeFill(elements.streamPositionX);
setNormalizedRangeFill(elements.streamPositionY);
updateLiquifyUI();
updatePatternUI();
updateOverlayUI();
updateVnUI();
updateDownloadButtonLabel();
initializeStickerAssets();
