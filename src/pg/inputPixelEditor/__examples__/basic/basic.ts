import { Component, Part } from '@pictogrammers/element';
import PgInputPixelEditor from '../../inputPixelEditor';
import PgTable, { createTableItem } from '../../../table/table';
import PgTableCellButtonIcon from '../../../tableCellButtonIcon/tableCellButtonIcon';
import { maskToBitmap } from '../../utils/maskToBitmap';
import { patterns } from './constants';

import template from './basic.html';
import style from './basic.css';

const IconPicker = 'M19.35,11.72L17.22,13.85L15.81,12.43L8.1,20.14L3.5,22L2,20.5L3.86,15.9L11.57,8.19L10.15,6.78L12.28,4.65L19.35,11.72M16.76,3C17.93,1.83 19.83,1.83 21,3C22.17,4.17 22.17,6.07 21,7.24L19.08,9.16L14.84,4.92L16.76,3M5.56,17.03L4.5,19.5L6.97,18.44L14.4,11L13,9.6L5.56,17.03Z';
const IconTrash = 'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z';
const IconLayerEdit = 'M4.63 10.27L3 9L12 2L19.94 8.17L12.5 15.61L12 16L4.63 10.27M10 18.94V18.11L10.59 17.53L10.63 17.5L4.62 12.81L3 14.07L10 19.5V18.94M21.7 12.58L20.42 11.3C20.21 11.09 19.86 11.09 19.65 11.3L18.65 12.3L20.7 14.35L21.7 13.35C21.91 13.14 21.91 12.79 21.7 12.58M12 21H14.06L20.11 14.93L18.06 12.88L12 18.94V21Z';

@Component({
  selector: 'x-pg-input-pixel-editor-basic',
  style,
  template
})
export default class XPgInputPixelEditorBasic extends HTMLElement {

  @Part() $input: PgInputPixelEditor;
  @Part() $value1: HTMLSpanElement;
  @Part() $value2: HTMLSpanElement;
  @Part() $debug: HTMLDivElement;
  @Part() $width: HTMLInputElement;
  @Part() $height: HTMLInputElement;
  @Part() $size: HTMLInputElement;
  @Part() $transparent: HTMLInputElement;

  @Part() $reset: HTMLButtonElement;
  @Part() $clear: HTMLButtonElement;
  @Part() $invert: HTMLButtonElement;
  @Part() $modeStamp1: HTMLButtonElement;
  @Part() $modeStamp2: HTMLButtonElement;
  @Part() $modeStamp3: HTMLButtonElement;
  @Part() $modeStamp4: HTMLButtonElement;
  @Part() $modePixel: HTMLButtonElement;
  @Part() $modeLine: HTMLButtonElement;
  @Part() $modeRectangle: HTMLButtonElement;
  @Part() $modeRectangleOutline: HTMLButtonElement;
  @Part() $modeEllipse: HTMLButtonElement;
  @Part() $modeEllipseOutline: HTMLButtonElement;

  @Part() $save: HTMLButtonElement;
  @Part() $open: HTMLButtonElement;
  @Part() $output: HTMLPreElement;
  @Part() $file: HTMLInputElement;
  @Part() $saveSvg: HTMLInputElement;
  @Part() $savePng: HTMLInputElement;

  @Part() $addLayer: HTMLButtonElement;
  @Part() $addColor: HTMLButtonElement;

  @Part() $colors: PgTable;
  @Part() $layers: PgTable;

  connectedCallback() {
    this.$width.value = '10';
    this.$height.value = '10';
    this.$size.value = '10';
    this.$input.addEventListener('change', this.handleChange.bind(this));
    this.$width.addEventListener('input', this.handleWidthChange.bind(this));
    this.$height.addEventListener('input', this.handleHeightChange.bind(this));
    this.$size.addEventListener('input', this.handleSizeChange.bind(this));
    this.$transparent.addEventListener('input', this.handleTransparentChange.bind(this));
    this.$input.addEventListener('input', this.handleInput.bind(this));
    this.$input.addEventListener('debug', this.handleDebug.bind(this));
    [
      this.$modeStamp1,
      this.$modeStamp2,
      this.$modeStamp3,
      this.$modeStamp4,
    ].forEach(($modeStamp) => {
      $modeStamp.addEventListener('click', (e: any) => {
        const stamp = e.target.dataset.stamp;
        this.$input.inputModeStamp(patterns[stamp]);
      });
    });
    this.$modePixel.addEventListener('click', () => {
      this.$input.inputModePixel();
    });
    this.$modeLine.addEventListener('click', () => {
      this.$input.inputModeLine();
    });
    this.$modeRectangle.addEventListener('click', () => {
      this.$input.inputModeRectangle();
    });
    this.$modeRectangleOutline.addEventListener('click', () => {
      this.$input.inputModeRectangleOutline();
    });
    this.$modeEllipse.addEventListener('click', () => {
      this.$input.inputModeEllipse();
    });
    this.$modeEllipseOutline.addEventListener('click', () => {
      this.$input.inputModeEllipseOutline();
    });
    this.$reset.addEventListener('click', () => {
      this.$input.reset();
    });
    this.$clear.addEventListener('click', () => {
      this.$input.clear();
    });
    this.$invert.addEventListener('click', () => {
      this.$input.invert();
    });
    this.$save.addEventListener('click', async () => {
      const json = await this.$input.save();
      this.$output.textContent = JSON.stringify(json, null, 4);
    });
    this.$open.addEventListener('click', () => {
      const json = JSON.parse(this.$output.textContent || '');
      this.$input.open(json as any);
    });
    this.$file.addEventListener('change', this.handleFile.bind(this));
    this.$saveSvg.addEventListener('click', async () => {
      try {
        // @ts-ignore
        const handle = await window.showSaveFilePicker({
          suggestedName: 'Canvas',
          types: [{
            description: 'SVG Document',
            accept: {'image/svg+xml': ['.svg']},
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.$width.value} ${this.$height.value}">`);
        await writable.write(`<path d="${'test'}" />`);
        await writable.write('</svg>');
        await writable.close();
      } catch (e: any) {
        // no save
      }
    });
    this.$savePng.addEventListener('click', async () => {
      try {
        // @ts-ignore
        const handle = await window.showSaveFilePicker({
          suggestedName: 'CanvasName',
          types: [{
            description: 'SVG Document',
            accept: {'image/svg+xml': ['.svg']},
          }],
        });
        const writable = await handle.createWritable();
        await writable.write('something');
        await writable.write
        await writable.close();
      } catch (e: any) {
        // no save
      }
    });
    // Layers
    this.$layers.columns = [{
      label: 'Name',
      key: 'name',
    }, {
      label: 'Type',
      key: 'type',
    }, {
      label: 'Selected',
      key: 'selected',
      hideLabel: true,
    }, {
      label: 'Select',
      key: 'select',
      hideLabel: true,
    }];
    this.$layers.data = [
      createTableItem({
        name: 'Layer 1',
        type: 'pixel',
        selected: true,
        select: {
          type: PgTableCellButtonIcon,
          icon: IconLayerEdit,
          value: 0,
        }
      })
    ];
    this.$layers.addEventListener('action', (e: any) => {
      const { getColumn, getRows, key } = e.detail;
      switch(key) {
        case 'select':
          getRows().forEach(({ getColumn }) => {
            getColumn('selected').value = false;
          });
          getColumn('selected').value = true;
          this.$input.selectLayer(getColumn('select').value);
          break;
      }
    });
    this.$addLayer.addEventListener('click', () => {
      this.$layers.data.push(
        createTableItem({
          name: 'Layer 2',
          type: 'pixel',
          selected: false,
          select: {
            type: PgTableCellButtonIcon,
            icon: IconLayerEdit,
            value: 1,
          }
        })
      );
      this.$input.addLayer();
    });
    // Colors
    this.$colors.columns = [{
      label: 'Red',
      key: 'r',
      editable: true,
    }, {
      label: 'Green',
      key: 'g',
      editable: true,
    }, {
      label: 'Blue',
      key: 'b',
      editable: true,
    }, {
      label: 'Alpha',
      key: 'a',
      editable: true,
    }, {
      label: 'Selected',
      key: 'selected',
      hideLabel: true,
    }, {
      label: 'Select',
      key: 'select',
      hideLabel: true,
    }, {
      label: 'Delete',
      key: 'delete',
      hideLabel: true,
    }];
    this.$colors.data.push(...this.$input.getColors().map(([r, g, b, a], i) => {
      return createTableItem({
        r,
        g,
        b,
        a,
        selected: i === 1,
        select: {
          type: PgTableCellButtonIcon,
          icon: IconPicker,
          value: i,
        },
        delete: {
          type: PgTableCellButtonIcon,
          icon: IconTrash,
          value: i,
        }
      });
    }));
    this.$colors.addEventListener('action', (e: any) => {
      const { getColumn, getRows, key } = e.detail;
      switch(key) {
        case 'select':
          getRows().forEach(({ getColumn }) => {
            getColumn('selected').value = false;
          });
          getColumn('selected').value = true;
          this.$input.selectColor(getColumn('select').value);
          break;
      }
    });
    this.$addColor.addEventListener('click', () => {
      this.$colors.data.push(createTableItem({
        r: 5,
        g: 5,
        b: 5,
        a: 1,
        selected: false,
        select: {
          type: PgTableCellButtonIcon,
          icon: IconPicker,
          value: this.$colors.data.length,
        },
        delete: {
          type: PgTableCellButtonIcon,
          icon: IconTrash
        }
      }));
    });
  }

  handleFile(e) {
    const { files } = e.currentTarget;
    if (files.length !== 1) {
      throw new Error('select only 1 file');
    }
    switch(files[0].type) {
      case 'image/svg+xml':
        // Read the file
        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result as string;
          const size = content.match(/viewBox="\d+ \d+ (\d+) (\d+)"/) as string[];
          const width = parseInt(size[1], 10);
          const height = parseInt(size[2], 10);
          const path = (content.match(/\sd="([^"]+)"/) as string[])[1];
          // Render path
          console.log(path, size[1], size[2]);
          this.$input.applyTemplate(maskToBitmap(path, width, height));
          ;
        };
        reader.onerror = () => {
          throw new Error("Error reading the file. Please try again.");
        };
        reader.readAsText(files[0]);
        break;
      default:
        throw new Error('Unsupported format.');
    }
  }

  handleChange(e: CustomEvent) {
    this.$value1.textContent = this.$input.getLayerPaths().join('--');
  }

  handleInput(e: CustomEvent) {
    const { value } = e.detail;
    this.$value2.textContent = value;
  }

  handleDebug(e: CustomEvent) {
    const { x, y, width, height, context, baseLayer, editLayer, noEditLayer, previewLayer } = e.detail;
    this.$debug.appendChild(baseLayer);
    this.$debug.appendChild(editLayer);
    this.$debug.appendChild(noEditLayer);
    this.$debug.appendChild(previewLayer);
    //context.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    //context.lineWidth = 1;
    //context.strokeRect(x, y, width, height);
  }

  handleWidthChange(e) {
    this.$input.width = e.target.value;
    this.$debug.innerHTML = '';
  }

  handleHeightChange(e) {
    this.$input.height = e.target.value;
    this.$debug.innerHTML = '';
  }

  handleSizeChange(e) {
    this.$input.size = e.target.value;
    this.$debug.innerHTML = '';
  }

  handleTransparentChange(e) {
    this.$input.transparent = e.target.checked;
  }
}