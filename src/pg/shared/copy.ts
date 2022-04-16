export function getCopySvgInline(icon: any) {
  return `<svg viewBox="0 0 24 24"><path fill="currentColor" d="${icon.data}"/></svg>`;
}

export function getCopySvgFile(icon: any) {
  return [
    `<?xml version="1.0" encoding="utf-8"?>`,
    `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`,
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="full" width="24" height="24" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">`,
    `  <path fill="#000000" fill-opacity="1" stroke-width="0" stroke-linejoin="round" d="${icon.data}"/>`,
    `</svg>`
  ].join('');
}

export const copyText = (text: string) => {
  var copyFrom = document.createElement('textarea');
  copyFrom.setAttribute("style", "position:fixed;opacity:0;top:100px;left:100px;");
  copyFrom.value = text;
  document.body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  setTimeout(function () {
      document.body.removeChild(copyFrom);
  }, 1500);
}