import { Component, Prop, Part } from '@pictogrammers/element';

import template from './inputFileLocal.html';
import style from './inputFileLocal.css';

const noIcon = 'M0 0h24v24H0V0zm2 2v20h20V2H2z';

@Component({
  selector: 'pg-input-file-local',
  style,
  template
})
export default class PgInputFileLocal extends HTMLElement {
  @Prop() acceptsFileType: string = '';

  @Part() $file: HTMLInputElement;

  connectedCallback() {
    this.$file.addEventListener('change', () => {
      if (this.$file.files === null || this.$file.files.length === 0) {
        alert('Error : No file selected');
        return;
      }

      // first file selected by user
      var file = this.$file.files[0];

      // perform validation on file type & size if required
      if (this.acceptsFileType) {
        var types = this.acceptsFileType.split(',').join('|');
        var regex = new RegExp(`(${types})$`, 'i');
        if (file.name.match(regex) === null) {
          alert(`${this.acceptsFileType} file only`);
          return;
        }
      }

      // read the file
      var reader = new FileReader();

      // file reading started
      reader.addEventListener('loadstart', function () {
        // console.log('File reading started');
      });

      // file reading finished successfully
      reader.addEventListener('load', (e: any) => {
        // contents of file in variable
        var text = e.target.result;

        this.dispatchEvent(
          new CustomEvent('change', {
            detail: {
              value: text,
              name: file.name
            }
          })
        );
      });

      // file reading failed
      reader.addEventListener('error', function () {
        alert('Error : Failed to read file');
      });

      // file read progress
      reader.addEventListener('progress', function (e) {
        if (e.lengthComputable == true) {
          var percent_read = Math.floor((e.loaded / e.total) * 100);
          // console.log(percent_read + '% read');
        }
      });

      // read as text file
      reader.readAsText(file);
    });
  }

  render(changes) {

  }
}