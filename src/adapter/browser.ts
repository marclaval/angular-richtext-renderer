import {Adapter} from './default';

export class BrowserAdapter extends Adapter {
  private _anchor: Element;

  init(selector: string) {
    var el = document.querySelector(selector);
    if (el) {
      this._anchor = el;
    } else {
      throw `The selector "${selector}" did not match any elements`;
    }
  }

  print(richText: string) {
    (<HTMLElement>this._anchor.querySelector('code')).innerText = richText;
  }
}