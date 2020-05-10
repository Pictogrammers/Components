import { Component, Prop, Part, Local } from '@mdi/element';

import template from './scroll.html';
import style from './scroll.css';

declare const ResizeObserver;

@Component({
  selector: 'mdi-scroll',
  style,
  template
})
export default class MdiScroll extends HTMLElement {

  @Prop() height: string | number = 16;

  @Part() $scroll: HTMLDivElement;
  @Part() $text: HTMLDivElement;

  scrollElement;
  currentHeight = -1;
  columns = 10;
  size = 44;
  visible = false;
  y = -1;

  resizeObserver = new ResizeObserver(entries => {
    const { width } = entries[0].contentRect;
    this.columns = Math.floor(width / (this.size + 20));
  });

  getInnerHeight() {
    let parentElement = this.parentElement;
    while (parentElement) {
      if (parentElement.style.overflow === 'auto') {
        return parentElement.getBoundingClientRect().height;
      }
      parentElement = parentElement.parentElement;
    }
    return window.innerHeight;
  }

  get isWindow() {
    return this.scrollElement === window;
  }

  getView() {
    const innerHeight = this.getInnerHeight();
    const container = this.getBoundingClientRect();
    const { y, height } = this.isWindow
      ? { y: container.y, height: container.height }
      : {
        y: container.y - this.scrollElement.getBoundingClientRect().y,
        height: container.height
       };
    const top = y < 0 ? -1 * y : 0;
    const calcY = height - top - innerHeight < 0
      ? height - innerHeight < 0 ? 0 : height - innerHeight
      : top;
    const calcHeight = height < innerHeight
      ? height
      : y + height - innerHeight > 0
        ? innerHeight
        : y + height - innerHeight;
    return {
      visible: (y < innerHeight && height + y > 0) || !this.isWindow,
      y: calcY,
      height: calcHeight < 0 ? innerHeight : calcHeight,
      atEnd: calcHeight < 0
    }
  }

  calculateScroll() {
    const { visible, y, height } = this.getView();
    if (visible) {
      this.$scroll.style.transform = `translateY(${y}px)`;
      this.$scroll.style.height = `${height}px`;
    }
    if (this.visible !== visible) {
      this.visible = visible;
      if (this.visible) {
        this.enterView();
      } else {
        this.leaveView();
      }
    }
    if (this.visible && this.y !== y) {
      this.dispatchEvent(
        new CustomEvent('calculate', {
          detail: {
            offsetY: y,
            viewHeight: height,
            height: this.height
          }
        }
      ));
      this.y = y;
    }
  }

  enterView() {
    this.dispatchEvent(new CustomEvent('enter'));
  }

  leaveView() {
    this.dispatchEvent(new CustomEvent('leave'));
  }

  getParentElement() {
    let parentElement = this.parentElement;
    while (parentElement) {
      if (parentElement.style.overflow === 'auto') {
        return parentElement;
      }
      parentElement = parentElement.parentElement;
    }
    return window;
  }

  updateHeight() {
    this.scrollElement = this.getParentElement();
    this.scrollElement.addEventListener('scroll', () => {
      this.calculateScroll();
    });
    window.addEventListener('resize', () => {
      this.y = -1;
      this.calculateScroll();
    });
    this.style.height = `${this.currentHeight}px`;
    this.y = -1;
    this.calculateScroll();
  }

  render() {
    const height = parseInt(this.height as string, 10);
    if (this.currentHeight !== height) {
      this.currentHeight = height;
      this.updateHeight();
    }
  }
}
