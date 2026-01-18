import { FontIconVersion } from "./version";

export class FontIcon {
  public id: string;
  public codepoint: string;
  public font: string;
  public version: FontIconVersion;

  from(fontIcon: FontIcon): FontIcon {
    this.id = fontIcon.id;
    this.codepoint = fontIcon.codepoint;
    this.font = fontIcon.font;
    this.version = fontIcon.version;
    return this;
  }

  to() {
    return {
      id: this.id,
      codepoint: this.codepoint,
      font: this.font,
      version: this.version
    }
  }
}