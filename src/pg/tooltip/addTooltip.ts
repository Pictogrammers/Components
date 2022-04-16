export function addTooltip($part, render, position?) {
  function handleMouseEnter() {
    $part.dispatchEvent(
      new CustomEvent('tooltip', {
        detail: {
          visible: true,
          rect: $part.getBoundingClientRect(),
          text: render(),
          position: position
        },
        bubbles: true,
        composed: true
      })
    );
  }

  function handleMouseLeave() {
    $part.dispatchEvent(
      new CustomEvent('tooltip', {
        detail: {
          visible: false
        },
        bubbles: true,
        composed: true
      })
    );
  }

  $part.addEventListener('mouseenter', handleMouseEnter);
  $part.addEventListener('mouseleave', handleMouseLeave);
}