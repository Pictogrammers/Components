export async function canvasToPngBuffer(canvas: HTMLCanvasElement): Promise<ArrayBuffer> {
    const blob = await new Promise((resolve: BlobCallback) =>
        canvas.toBlob(resolve, 'image/png')
    );

    // `canvas.toBlob` can return null, so guard it
    if (!blob) {
        throw new Error("Failed to convert canvas to Blob");
    }

    return await blob.arrayBuffer();
}
