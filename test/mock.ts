import {Printer} from '../src/printer/default';

export class MockPrinter extends Printer {
  private _result: Object;
  constructor(result: Object) {
    super();
    this._result = result;
  }
  init(selector: string) {}
  print(richText: string) {
    this._result['richText'] = richText;
  }
}