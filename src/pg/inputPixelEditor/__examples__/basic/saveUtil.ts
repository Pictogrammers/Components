
/**
 * Save file with polyfill for legacy browsers.
 *
 * @param blob File blob
 * @returns Promise
 */
export async function saveFile(blob) {
  // @ts-ignore
  if (window.showSaveFilePicker) {
    const opts = {
      types: [
        {
          description: "Text file",
          accept: { "text/plain": [".txt"] },
        },
      ],
    };
    // @ts-ignore
    return await window.showSaveFilePicker(opts);
  }
  const downloadelem = document.createElement("a");
  const url = URL.createObjectURL(blob);
  document.body.appendChild(downloadelem);
  downloadelem.href = url;
  downloadelem.download = 'filename.txt';
  downloadelem.click();
  downloadelem.remove();
  window.URL.revokeObjectURL(url);
  return Promise.resolve();
}
