import {
  injectAsync, TestComponentBuilder,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe
  expect
} from 'angular2/testing';
import {Component, View, Renderer, provide, NG} from 'angular2/angular2';
import {RichTextRenderer, ADAPTER, FORMATTER} from '../src/rich_text_renderer';
import {MockAdapter} from './mock';
import {MarkdownFormatter} from "../src/formatter/markdown";

var result: Object;

describe('Markdown', () => {

  beforeEach(() => {
    result = {};
  });
  beforeEachProviders(() => [
    RichTextRenderer,
    provide(Renderer, {useExisting: RichTextRenderer}),
    provide(ADAPTER, {useValue: new MockAdapter(result)}),
    MarkdownFormatter,
    provide(FORMATTER, {useExisting: MarkdownFormatter})
  ]);

  it('should preserve other elements', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.overrideTemplate(TestComponent, `<a c="d">foo</a>`)
      .createAsync(TestComponent).then(() => {
        expect(result.richText).toEqual('<a c="d">foo</a>');
      });
  }));

  //Reference: https://help.github.com/articles/markdown-basics/
  describe('basics', () => {
    it('should support header1', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<header1>foo</header1>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('# foo');
        });
    }));

    it('should support header2', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<header2>foo</header2>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('## foo');
        });
    }));

    it('should support header3', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<header3>foo</header3>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('### foo');
        });
    }));

    it('should support header4', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<header4>foo</header4>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('#### foo');
        });
    }));

    it('should support header5', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<header5>foo</header5>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('##### foo');
        });
    }));

    it('should support header6', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<header6>foo</header6>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('###### foo');
        });
    }));

    it('should support blockquote', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<blockquote>foo</blockquote>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('> foo');
        });
    }));

    it('should support italic', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<italic>foo</italic>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('*foo*');
        });
    }));

    it('should support bold', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<bold>foo</bold>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('**foo**');
        });
    }));

    it('should support unordered', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<unordered>foo</unordered>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('* foo');
        });
    }));

    it('should support ordered', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<ordered index="1">foo</ordered>||<ordered>bar</ordered>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('1. foo||0. bar');
        });
    }));

    it('should support codeline', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<codeline>foo = 123</codeline>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('`foo = 123`');
        });
    }));

    it('should support codeblock', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<codeblock>foo = 123</codeblock>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('```foo = 123```');
        });
    }));

    it('should support hyperlink', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<hyperlink url="foo.com">foo</hyperlink>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('[foo](foo.com)');
        });
    }));

  });

  //Reference: https://help.github.com/articles/github-flavored-markdown/
  // and also https://help.github.com/articles/writing-on-github/
  describe('Github flavored', () => {

    it('should support strikethrough', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<strikethrough>foo</strikethrough>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('~~foo~~');
        });
    }));

    it('should support codeblock with syntax highlightinh', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<codeblock language="javascript"> var foo = 123;</codeblock>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('```javascript var foo = 123;```');
        });
    }));

    it('should support task', injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.overrideTemplate(TestComponent, `<task completed="yes">foo</task>||<task completed="no">bar</task>`)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual('* [x] foo||* [ ] bar');
        });
    }));

    it('should support table', injectAsync([TestComponentBuilder], (tcb) => {
      var template = `<header>a</header><header>b</header>
<cell>a1</cell><cell>b1</cell>
<cell>a2</cell><cell>b2</cell>`;
      var output =` a | b |
 ---- | ---- |
 a1 | b1 |
 a2 | b2 |`;
      return tcb.overrideTemplate(TestComponent, template)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual(output);
        });
    }));

    it('should support table with alignment', injectAsync([TestComponentBuilder], (tcb) => {
      var template = `<header align="right">a</header><header align="center">b</header><header align="left">c</header>
<cell>a1</cell><cell>b1</cell><cell>c1</cell>
<cell>a2</cell><cell>b2</cell><cell>c2</cell>`;
      var output =` a | b | c |
 ----: | :----: | :---- |
 a1 | b1 | c1 |
 a2 | b2 | c2 |`;
      return tcb.overrideTemplate(TestComponent, template)
        .createAsync(TestComponent).then(() => {
          expect(result.richText).toEqual(output);
        });
    }));

  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {}