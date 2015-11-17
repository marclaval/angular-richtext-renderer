import {
  injectAsync, TestComponentBuilder,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe
  expect
} from 'angular2/testing';
import {Component, View, Renderer, provide} from 'angular2/angular2';
import {RichTextRenderer, ADAPTER, FORMATTER} from '../src/rich_text_renderer';
import {MockAdapter} from './mock';
import {DefaultFormatter} from "../src/formatter/default";

var result: Object;

describe('RichTextRenderer', () => {

  beforeEach(() => {
    result = {};
  });
  beforeEachProviders(() => [
    RichTextRenderer,
    provide(Renderer, {useExisting: RichTextRenderer}),
    provide(ADAPTER, {useValue: new MockAdapter(result)}),
    DefaultFormatter,
    provide(FORMATTER, {useExisting: DefaultFormatter})
  ]);


  it('should render text', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, `foo`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        expect(result.richText).toEqual('foo');
      });
  }));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
}