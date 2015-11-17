import {
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders,
  iit, it, xit,
  describe, ddescribe,
  expect
} from 'angular2/testing';
import {Component, View, Renderer, provide} from 'angular2/angular2';
import {RichTextRenderer, ADAPTER} from '../src/rich_text_renderer';
import {Adapter} from '../src/adapter/default';

var result = "";
class MockAdapter extends Adapter {
  init(selector: string) {}
  print(richText: string) {
    result = richText;
  }
}

describe('RichTextRenderer', () => {

  beforeEachProviders(() => [
    RichTextRenderer,
    provide(Renderer, {useExisting: RichTextRenderer}),
    provide(ADAPTER, {useValue: new MockAdapter()})
  ]);

  it('should render', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, `foo`)
      .createAsync(TestComponent).then((fixture) => {
        fixture.detectChanges();
        expect(result).toEqual('foo');
      });
  }));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
}