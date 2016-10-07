import {TestBed, getTestBed, ComponentFixture} from '@angular/core/testing';
import {Component, RootRenderer, ApplicationModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from "@angular/common";

import {RichTextRootRenderer, RichTextRootRenderer_, PRINTER, FORMATTER} from '../src/rich_text_renderer';
import {MockPrinter} from './mock';
import {MarkdownFormatter} from "../src/formatter/markdown";

var result: {richText: string};

export function initTest(testCpt: any, tpl: string): {fixture: ComponentFixture<any>, rootRenderer: RichTextRootRenderer} {
  TestBed.overrideComponent(testCpt, {set: {template: tpl}});
  const rootRenderer: RichTextRootRenderer = getTestBed().get(RichTextRootRenderer);
  const fixture: ComponentFixture<any> = TestBed.createComponent(testCpt);
  fixture.autoDetectChanges();
  rootRenderer.refresh();
  return {fixture: fixture, rootRenderer: rootRenderer};
}

describe('Markdown', () => {

  beforeEach(() => {
    result = {richText: null};
    TestBed.configureTestingModule({
      imports: [CommonModule, ApplicationModule],
      providers: [
        {provide: PRINTER, useValue: new MockPrinter(result)},
        MarkdownFormatter,
        {provide: FORMATTER, useExisting: MarkdownFormatter},
        {provide: RichTextRootRenderer, useClass: RichTextRootRenderer_},
        {provide: RootRenderer, useExisting: RichTextRootRenderer}
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TestComponent]
    });
  });

  it('should preserve other elements', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<a c="d">foo</a>`);
    expect(result.richText).toEqual('<a c="d">foo</a>');
  });

  //Reference: https://help.github.com/articles/markdown-basics/
  describe('basics', () => {
    it('should support header1', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<header1>foo</header1>`);
      expect(result.richText).toEqual('# foo');
    });

    it('should support header2', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<header2>foo</header2>`);
      expect(result.richText).toEqual('## foo');
    });

    it('should support header3', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<header3>foo</header3>`);
      expect(result.richText).toEqual('### foo');
    });

    it('should support header4', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<header4>foo</header4>`);
      expect(result.richText).toEqual('#### foo');
    });

    it('should support header5', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<header5>foo</header5>`);
      expect(result.richText).toEqual('##### foo');
    });

    it('should support header6', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<header6>foo</header6>`);
      expect(result.richText).toEqual('###### foo');
    });

    it('should support blockquote', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<blockquote>foo</blockquote>`);
      expect(result.richText).toEqual('> foo');
    });

    it('should support italic', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<italic>foo</italic>`);
      expect(result.richText).toEqual('*foo*');
    });

    it('should support bold', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<bold>foo</bold>`);
      expect(result.richText).toEqual('**foo**');
    });

    it('should support unordered', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<unordered>foo</unordered>`);
      expect(result.richText).toEqual('* foo');
    });

    it('should support ordered', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<ordered index="1">foo</ordered>||<ordered>bar</ordered>`);
      expect(result.richText).toEqual('1. foo||0. bar');
    });

    it('should support codeline', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<codeline>foo = 123</codeline>`);
      expect(result.richText).toEqual('`foo = 123`');
    });

    it('should support codeblock', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<codeblock>foo = 123</codeblock>`);
      expect(result.richText).toEqual('```foo = 123```');
    });

    it('should support hyperlink', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<hyperlink url="foo.com">foo</hyperlink>`);
      expect(result.richText).toEqual('[foo](foo.com)');
    });

  });

  //Reference: https://help.github.com/articles/github-flavored-markdown/
  // and also https://help.github.com/articles/writing-on-github/
  describe('Github flavored', () => {

    it('should support strikethrough', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<strikethrough>foo</strikethrough>`);
      expect(result.richText).toEqual('~~foo~~');
    });

    it('should support codeblock with syntax highlighting', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<codeblock language="javascript"> var foo = 123;</codeblock>`);
      expect(result.richText).toEqual('```javascript var foo = 123;```');
    });

    it('should support task', () => {
      const {fixture, rootRenderer} = initTest(TestComponent, `<task completed="yes">foo</task>||<task completed="no">bar</task>`);
      expect(result.richText).toEqual('* [x] foo||* [ ] bar');
    });

    it('should support table', () => {
      const template = `<header>a</header><header>b</header>
<cell>a1</cell><cell>b1</cell>
<cell>a2</cell><cell>b2</cell>`;
      const output =` a | b |
 ---- | ---- |
 a1 | b1 |
 a2 | b2 |`;
      const {fixture, rootRenderer} = initTest(TestComponent, template);
      expect(result.richText).toEqual(output);
    });

    it('should support table with alignment', () => {
      const template = `<header align="right">a</header><header align="center">b</header><header align="left">c</header>
<cell>a1</cell><cell>b1</cell><cell>c1</cell>
<cell>a2</cell><cell>b2</cell><cell>c2</cell>`;
      const output =` a | b | c |
 ----: | :----: | :---- |
 a1 | b1 | c1 |
 a2 | b2 | c2 |`;
      const {fixture, rootRenderer} = initTest(TestComponent, template);
      expect(result.richText).toEqual(output);
    });
  });

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {}