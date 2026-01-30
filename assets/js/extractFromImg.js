const fileInput = document.getElementById("fileInput");
const uploadSection = document.getElementById("uploadSection");
const imagePreview = document.getElementById("imagePreview");
const extractBtn = document.getElementById("extractBtn");
const colorCount = document.getElementById("colorCount");
const paletteSection = document.getElementById("paletteSection");
const paletteContainer = document.getElementById("paletteContainer");
const loading = document.getElementById("loading");
const copiedNotification = document.getElementById("copiedNotification");

let currentImage = null;

fileInput.addEventListener("change", handleFileSelect);

uploadSection.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadSection.classList.add("dragover");
});

uploadSection.addEventListener("dragleave", () => {
    uploadSection.classList.remove("dragover");
});

uploadSection.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadSection.classList.remove("dragover");
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
        handleFile(files[0]);
    }
});

uploadSection.addEventListener("click", () => {
    fileInput.click();
});

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
        handleFile(file);
    }
}

function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = new Image();
        currentImage.onload = () => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "none";
            extractBtn.disabled = false;
            extractBtn.textContent = "Extract Colors";
            paletteSection.style.display = "none";
            extractColors();
        };
        currentImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

extractBtn.addEventListener("click", extractColors);

function extractColors() {
    if (!currentImage) return;

    loading.classList.add("show");
    paletteSection.style.display = "none";
    paletteContainer.innerHTML = "";

    setTimeout(() => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        const maxSize = 200;
        let width = currentImage.width;
        let height = currentImage.height;
        
        if (width > height) {
            if (width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width = (width * maxSize) / height;
                height = maxSize;
            }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(currentImage, 0, 0, width, height);
        
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        
        const numColors = parseInt(colorCount.value);
        const colors = kMeansClustering(pixels, numColors);
        
        displayPalette(colors);
        loading.classList.remove("show");
        paletteSection.style.display = "block";
    }, 100);
    extractBtn.textContent = "Not right? Extract Again";
}

function kMeansClustering(pixels, k) {
    const sampledPixels = [];
    const step = 4;

    for (let i = 0; i < pixels.length; i += step * 4) {
        sampledPixels.push({
            r: pixels[i],
            g: pixels[i + 1],
            b: pixels[i + 2]
        });
    }

    let centroids = [];
    for (let i = 0; i < k; i++) {
        const p = sampledPixels[Math.floor(Math.random() * sampledPixels.length)];
        centroids.push({ ...p });
    }

    const maxIterations = 15;
    const epsilon = 1;

    for (let iter = 0; iter < maxIterations; iter++) {
        const clusters = Array.from({ length: k }, () => []);

        sampledPixels.forEach(pixel => {
            let minDist = Infinity;
            let closest = 0;

            for (let i = 0; i < k; i++) {
                const d = colorDistance(pixel, centroids[i]);
                if (d < minDist) {
                    minDist = d;
                    closest = i;
                }
            }

            clusters[closest].push(pixel);
        });

        let converged = true;

        centroids = clusters.map((cluster, i) => {
            if (cluster.length === 0) return centroids[i];

            let r = 0, g = 0, b = 0;
            for (const p of cluster) {
                r += p.r;
                g += p.g;
                b += p.b;
            }

            const newCentroid = {
                r: Math.round(r / cluster.length),
                g: Math.round(g / cluster.length),
                b: Math.round(b / cluster.length)
            };

            if (colorDistance(newCentroid, centroids[i]) > epsilon) {
                converged = false;
            }

            return newCentroid;
        });

        if (converged) break;
    }

    return centroids;
}

function colorDistance(c1, c2) {
    return Math.sqrt(
        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2)
    );
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}

function displayPalette(colors) {
    paletteContainer.innerHTML = "";
    
    colors.forEach(color => {
        const hex = rgbToHex(color.r, color.g, color.b);
        const rgb = `rgb(${color.r}, ${color.g}, ${color.b})`;
        
        const colorCard = document.createElement("div");
        colorCard.className = "color-card";
        colorCard.innerHTML = `
            <div class="color-swatch" style="background-color: ${hex}"></div>
            <div class="color-info">
                <div class="color-hex">${hex.toUpperCase()}</div>
                <div class="color-rgb">${rgb}</div>
            </div>
        `;
        
        colorCard.addEventListener("click", () => copyToClipboard(hex));
        paletteContainer.appendChild(colorCard);
    });
}

function copyToClipboard(text) {
    console.log("copied")
    navigator.clipboard.writeText(text).then(() => {
        if (!copiedNotification.classList.contains("show")) {
            copiedNotification.classList.add("show");
            setTimeout(() => {
                copiedNotification.classList.remove("show");
            }, 2000);
        }
    });
}