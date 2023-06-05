import { ITextItem } from "../../types";

class TextItem implements ITextItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
  hasEOL: boolean;

  constructor(
    str: string,
    dir: string,
    width: number,
    height: number,
    transform: number[],
    fontName: string,
    hasEOL: boolean
  ) {
    this.str = str;
    this.dir = dir;
    this.width = width;
    this.height = height;
    this.transform = transform;
    this.fontName = fontName;
    this.hasEOL = hasEOL;
  }
}

export default TextItem;
