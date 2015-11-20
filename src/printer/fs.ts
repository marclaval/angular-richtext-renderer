/// <reference path="../../typings/typings.d.ts" />
import {Printer} from './default';
import * as fs from 'fs';
import * as path from 'path';

export class FsPrinter extends Printer {
  private _fileName: string;

  init(selector: string) {
    this._fileName = selector;
  }

  print(richText: string) {
    fs.writeFileSync(path.normalize('./build/sample/') + this._fileName, richText);
  }
}