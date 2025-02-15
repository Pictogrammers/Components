function showOpenFilePickerPolyfill(options: any) {
  return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = options.multiple;
      input.accept = options.types
          .map((type) => type.accept)
          .flatMap((inst) => Object.keys(inst).flatMap((key) => inst[key]))
          .join(",");

      input.addEventListener("change", () => {
          resolve(
              [...(input.files as any)].map((file) => {
                  return {
                      getFile: async () =>
                          new Promise((resolve) => {
                              resolve(file);
                          }),
                  };
              })
          );
      });

      input.click();
  });
}

/**
 * Open file with polyfill for legacy browsers.
 *
 * @param options
 * @returns
 */
export function openFile(options) {
  // @ts-ignore
  if (window.showOpenFilePicker) {
    // @ts-ignore
    return window.showOpenFilePicker(options);
  }
  return showOpenFilePickerPolyfill(options);
}
