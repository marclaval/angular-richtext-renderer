import {Adapter} from '../src/adapter/default';

export class MockAdapter extends Adapter {
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