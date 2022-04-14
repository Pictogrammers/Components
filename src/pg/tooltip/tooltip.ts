import { Component, Prop, Part } from '@pictogrammers/element';

import template from './tooltip.html';
import style from './tooltip.css'

import {
  TOP,
  TOP_START,
  TOP_END,
  RIGHT,
  RIGHT_START,
  RIGHT_END,
  BOTTOM,
  BOTTOM_START,
  BOTTOM_END,
  LEFT,
  LEFT_START,
  LEFT_END
} from './position';

const map = {
  [TOP_START]: (width, height, rect) => {
    return {
      arrowTop: height - 5,
      arrowLeft: rect.width > width
        ? Math.floor(width / 2) - 5
        : Math.floor(rect.width / 2) - 5,
      left: rect.left,
      top: rect.top - height - 10
    };
  },
  [TOP]: (width, height, rect) => {
    return {
      arrowTop: height - 5,
      arrowLeft: Math.floor(width / 2) - 5,
      left: rect.left - Math.floor((width - rect.width) / 2),
      top: rect.top - height - 10
    };
  },
  [TOP_END]: (width, height, rect) => {
    return {
      arrowTop: height - 5,
      arrowLeft: rect.width > width
        ? width - Math.floor(width / 2) - 5
        : width - Math.floor(rect.width / 2) - 5,
      left: rect.left - width + rect.width,
      top: rect.top - height - 10
    };
  },
  [RIGHT_START]: (width, height, rect) => {
    return {
      arrowTop: Math.floor(height / 2) - 5,
      arrowLeft: -5,
      left: rect.left + rect.width + 10,
      top: rect.top
    };
  },
  [RIGHT]: (width, height, rect) => {
    return {
      arrowTop: Math.floor(height / 2) - 5,
      arrowLeft: -5,
      left: rect.left + rect.width + 10,
      top: rect.top + Math.floor(rect.height / 2) - Math.floor(height / 2)
    };
  },
  [RIGHT_END]: (width, height, rect) => {
    return {
      arrowTop: Math.floor(height / 2) - 5,
      arrowLeft: -5,
      left: rect.left + rect.width + 10,
      top: rect.top + rect.height - height
    };
  },
  [BOTTOM_START]: (width, height, rect) => {
    return {
      arrowTop: -5,
      arrowLeft: rect.width > width
        ? Math.floor(width / 2) - 5
        : Math.floor(rect.width / 2) - 5,
      left: rect.left,
      top: rect.top + rect.height + height - 20
    };
  },
  [BOTTOM]: (width, height, rect) => {
    return {
      arrowTop: -5,
      arrowLeft: Math.floor(width / 2) - 5,
      left: rect.left - Math.floor((width - rect.width) / 2),
      top: rect.top + rect.height + height - 20
    };
  },
  [BOTTOM_END]: (width, height, rect) => {
    return {
      arrowTop: -5,
      arrowLeft: rect.width > width
        ? width - Math.floor(width / 2) - 5
        : width - Math.floor(rect.width / 2) - 5,
      left: rect.left - width + rect.width,
      top: rect.top + rect.height + height - 20
    };
  },
  [LEFT_START]: (width, height, rect) => {
    return {
      arrowTop: Math.floor(height / 2) - 5,
      arrowLeft: width - 5,
      left: rect.left - width - 10,
      top: rect.top
    };
  },
  [LEFT]: (width, height, rect) => {
    return {
      arrowTop: Math.floor(height / 2) - 5,
      arrowLeft: width - 5,
      left: rect.left - width - 10,
      top: rect.top + Math.floor(rect.height / 2) - Math.floor(height / 2)
    };
  },
  [LEFT_END]: (width, height, rect) => {
    return {
      arrowTop: Math.floor(height / 2) - 5,
      arrowLeft: width - 5,
      left: rect.left - width - 10,
      top: rect.top + rect.height - height
    };
  }
};

@Component({
  selector: 'pg-tooltip',
  style,
  template
})
export default class PgTooltip extends HTMLElement {
  @Prop() visible: boolean = false;
  @Prop() rect: any = null;
  @Prop() text: string = '';
  @Prop() position: string = BOTTOM;

  @Part() $tooltip: HTMLDivElement;
  @Part() $tooltipText: HTMLSpanElement;
  @Part() $tooltipArrow: HTMLDivElement;

  render(changes) {
    this.$tooltipText.innerText = this.text;
    this.style.position = 'absolute';
    if (changes.visible) {
      this.style.display = this.visible ? 'block' : 'none';
    }
    const {
      width: tooltipWidth,
      height: tooltipHeight
    } = this.$tooltipText.getBoundingClientRect();
    let position = this.position;
    if (!(position in map)) {
      position = BOTTOM;
    }
    if (this.rect) {
      const {
        arrowLeft,
        arrowTop,
        left,
        top
      } = map[position](tooltipWidth, tooltipHeight, this.rect);
      this.style.left = `${left + window.scrollX}px`;
      this.style.top = `${top + window.scrollY}px`;
      this.$tooltipArrow.style.left = `${arrowLeft}px`;
      this.$tooltipArrow.style.top = `${arrowTop}px`;
    }
  }
}