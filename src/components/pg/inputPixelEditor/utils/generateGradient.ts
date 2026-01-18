// Not used but included
const byerMatrix2x2 = [
  [0, 2],
  [3, 1]
];

const bayerMatrix4x4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

const bayerMatrix8x8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21]
];

const bayerMatrix16x16 = [
  [0, 128, 32, 160, 8, 136, 40, 168, 2, 130, 34, 162, 10, 138, 42, 170],
  [192, 64, 224, 96, 200, 72, 232, 104, 194, 66, 226, 98, 202, 74, 234, 106],
  [48, 176, 16, 144, 56, 184, 24, 152, 50, 178, 18, 146, 58, 186, 26, 154],
  [240, 112, 208, 80, 248, 120, 216, 88, 242, 114, 210, 82, 250, 122, 218, 90],
  [12, 140, 44, 172, 4, 132, 36, 164, 14, 142, 46, 174, 6, 134, 38, 166],
  [204, 76, 236, 108, 196, 68, 228, 100, 206, 78, 238, 110, 198, 70, 230, 102],
  [60, 188, 28, 156, 52, 180, 20, 148, 62, 190, 30, 158, 54, 182, 22, 150],
  [252, 124, 220, 92, 244, 116, 212, 84, 254, 126, 222, 94, 246, 118, 214, 86],
  [3, 131, 35, 163, 11, 139, 43, 171, 1, 129, 33, 161, 9, 137, 41, 169],
  [195, 67, 227, 99, 203, 75, 235, 107, 193, 65, 225, 97, 201, 73, 233, 105],
  [51, 179, 19, 147, 59, 187, 27, 155, 49, 177, 17, 145, 57, 185, 25, 153],
  [243, 115, 211, 83, 251, 123, 219, 91, 241, 113, 209, 81, 249, 121, 217, 89],
  [15, 143, 47, 175, 7, 135, 39, 167, 13, 141, 45, 173, 5, 133, 37, 165],
  [207, 79, 239, 111, 199, 71, 231, 103, 205, 77, 237, 109, 197, 69, 229, 101],
  [63, 191, 31, 159, 55, 183, 23, 151, 61, 189, 29, 157, 53, 181, 21, 149],
  [255, 127, 223, 95, 247, 119, 215, 87, 253, 125, 221, 93, 245, 117, 213, 85]
];

// Normalize the Bayer matrix values to a 0-1 range
const normalizeBayerMatrix = (matrix) => {
    const maxVal = matrix.flat().reduce((max, val) => Math.max(max, val), 0);
    return matrix.map(row => row.map(val => val / (maxVal + 1))); // +1 to ensure values are strictly less than 1
};

const normalizedBayerMatrix = normalizeBayerMatrix(bayerMatrix4x4);

/**
 * Applies Bayer dithering to an image data array between two specified colors.
 * @param imageData The ImageData object containing pixel data.
 * @param color1 The first color (e.g., [r, g, b]).
 * @param color2 The second color (e.g., [r, g, b]).
 * @returns The dithered ImageData object.
 */
function applyBayerDithering(
    imageData,
    color1,
    color2
) {
    const { data, width, height } = imageData;
    const matrixSize = normalizedBayerMatrix.length;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4; // Index for R component

            // Calculate grayscale intensity (luminance) of the original pixel
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const intensity = (0.299 * r + 0.587 * g + 0.114 * b) / 255; // Normalize to 0-1

            // Get the threshold from the normalized Bayer matrix
            const threshold = normalizedBayerMatrix[y % matrixSize][x % matrixSize];

            // Assign color based on intensity and threshold
            if (intensity > threshold) {
                data[i] = color2[0];
                data[i + 1] = color2[1];
                data[i + 2] = color2[2];
            } else {
                data[i] = color1[0];
                data[i + 1] = color1[1];
                data[i + 2] = color1[2];
            }
        }
    }
    return imageData;
}
/*
// Example usage (assuming you have an ImageData object from a canvas)
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const linearGradient = ctx.createLinearGradient(0, 0, canvas.width, 0); // x0, y0, x1, y1

// Add color stops
linearGradient.addColorStop(0, 'white'); // Start color at 0%
linearGradient.addColorStop(1, 'black'); // End color at 100%

// Apply the gradient to fillStyle and draw a rectangle
ctx.fillStyle = linearGradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const ditheredImageData = applyBayerDithering(originalImageData, [0, 0, 0], [255, 255, 255]);
ctx.putImageData(ditheredImageData, 0, 0);
*/