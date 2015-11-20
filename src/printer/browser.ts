import {Printer} from './default';

export class BrowserPrinter extends Printer {
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