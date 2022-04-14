import { Component, Part, Prop } from '@pictogrammers/element';
import PgScroll from 'pg/scroll/scroll';

import template from './basic.html';
import style from './basic.css';

@Component({
  selector: 'x-pg-scroll-basic',
  template,
  style
})
export default class XPgScrollBasic extends HTMLElement {

  @Part() $scroll: PgScroll;
  @Part() $scrollList: HTMLDivElement;
  @Part() $scrollCount: HTMLSpanElement;
  @Part() $small: HTMLButtonElement;
  @Part() $large: HTMLButtonElement;
  @Part() $overflow: HTMLSpanElement;
  @Part() $overflowContainer: HTMLDivElement;

  connectedCallback() {
    const mdiScrollItems: string[] = [];
    var currentRow = 0;
    var currentViewHeight = 0;
    const dispatchHeight = () => {
      this.$scroll.height = mdiScrollItems.length * 44;
    }
    function small() {
      mdiScrollItems.splice(0, mdiScrollItems.length);
      for(var i = 0; i < 10; i++) {
        mdiScrollItems.push(`Test Item ${i}`);
      }
      dispatchHeight();
    }
    function large() {
      mdiScrollItems.splice(0, mdiScrollItems.length);
      for(var i = 0; i < 500; i++) {
        mdiScrollItems.push(`Test Item ${i}`);
      }
      dispatchHeight();
    }
    this.$small.addEventListener('click', small);
    this.$large.addEventListener('click', large);
    var list: HTMLElement[] = [];
    const syncVirtual = (virtualRows) => {
      for (var i = list.length; i < virtualRows; i++) {
        var ele = document.createElement('button');
        ele.innerText = 'Placeholder';
        ele.style.height = '44px';
        this.$scrollList.appendChild(ele);
        list.push(ele);
      }
      list.forEach((e, i) => {
        e.style.display = i < virtualRows - 1 ? '' : 'none'
      });
    }
    this.$scroll.addEventListener('calculate', (e: CustomEvent) => {
      var { offsetY, height, viewHeight } = e.detail as any;
      var viewRows = Math.ceil(viewHeight / 44) + 1;
      var row = Math.floor(offsetY / 44);
      syncVirtual(viewRows);
      if (currentRow !== row || currentViewHeight !== viewHeight) {
        this.$scrollCount.innerText = `${row}, ${viewRows}`;
        list.forEach((ele, index) => {
          ele.innerText = mdiScrollItems[index + row];
        });
        currentRow = row;
        currentViewHeight = viewHeight;
      }
      this.$scrollList.style.transform = `translateY(${-1 * offsetY % 44}px)`;
    });
    function overflow(overflowText) {
      if (overflowText === 'auto') {
        this.$overflowContainer.style.overflow = 'auto';
        this.$overflowContainer.style.height = '300px';
        this.$overflow.innerText = 'auto';
      } else {
        this.$overflowContainer.style.overflow = 'visible';
        this.$overflowContainer.style.height = '';
        this.$overflow.innerText = 'visible';
      }
    }
    overflow('auto');
    // overflow('visible');
    small();
  }
}