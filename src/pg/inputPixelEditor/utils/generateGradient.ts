// Define a Bayer matrix (e.g., 4x4)
const bayerMatrix4x4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
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