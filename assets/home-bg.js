const leftImages = [
  "assets/bg/left-01.jpg",
  "assets/bg/left-02.jpg",
  "assets/bg/left-03.jpg"
];

const rightImages = [
  "assets/bg/right-01.jpg",
  "assets/bg/right-02.jpg",
  "assets/bg/right-03.jpg"
];

const leftBg = document.querySelector(".side-bg-left");
const rightBg = document.querySelector(".side-bg-right");

function createLayers(container) {
  if (!container) return [];

  container.innerHTML = `
    <div class="side-bg-layer active"></div>
    <div class="side-bg-layer"></div>
  `;

  return container.querySelectorAll(".side-bg-layer");
}

const leftLayers = createLayers(leftBg);
const rightLayers = createLayers(rightBg);

let leftIndex = 0;
let rightIndex = 0;
let leftLayerIndex = 0;
let rightLayerIndex = 0;

function changeSide(layers, images, index, layerIndex) {
  if (!layers.length || !images.length) return { index, layerIndex };

  const nextLayerIndex = 1 - layerIndex;
  const nextLayer = layers[nextLayerIndex];
  const currentLayer = layers[layerIndex];

  nextLayer.style.backgroundImage = `url("${images[index]}")`;
  nextLayer.classList.add("active");
  currentLayer.classList.remove("active");

  return {
    index: (index + 1) % images.length,
    layerIndex: nextLayerIndex
  };
}

function changeBothSides() {
  const leftResult = changeSide(leftLayers, leftImages, leftIndex, leftLayerIndex);
  leftIndex = leftResult.index;
  leftLayerIndex = leftResult.layerIndex;

  const rightResult = changeSide(rightLayers, rightImages, rightIndex, rightLayerIndex);
  rightIndex = rightResult.index;
  rightLayerIndex = rightResult.layerIndex;
}

if (leftLayers.length && rightLayers.length) {
  leftLayers[0].style.backgroundImage = `url("${leftImages[0]}")`;
  rightLayers[0].style.backgroundImage = `url("${rightImages[0]}")`;

  leftIndex = 1;
  rightIndex = 1;

  setInterval(changeBothSides, 7000);
}