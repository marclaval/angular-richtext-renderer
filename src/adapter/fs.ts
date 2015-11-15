/// <reference path="../../typings/typings.d.ts" />
import {Adapter} from './default';
import * as fs from 'fs';
import * as path from 'path';

export class FsAdapter extends Adapter {
  private _fileName: string;

  init(selector: string) {
    this._fileName = selector;
  }

  print(richText: string) {
    fs.writeFileSync(path.normalize('./build/sample/node/') + this._fileName, richText);
  }
}