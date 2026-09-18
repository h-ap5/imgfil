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
};

const filterNames = {
  softcam: "흐릿한 아이폰",
  y2k: "Y2K 앰버",
  analog: "아날로그 TV",
  disposable: "일회용 플래시",
  ccd: "블루 CCD",
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
  };
  return filters[name] || "none";
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

    addPixelEffects(ctx, output.width, output.height, state.filter, state.strength, state.grain, state.seed);
    if (state.filter === "analog") addScanlines(ctx, output.width, output.height, state.strength);
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
