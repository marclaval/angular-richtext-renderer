import {TestBed, getTestBed, ComponentFixture} from '@angular/core/testing';
import {Component, RootRenderer, ApplicationModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from "@angular/common";

import {RichTextRootRenderer, RichTextRootRenderer_, PRINTER, FORMATTER} from '../src/rich_text_renderer';
import {MockPrinter} from './mock';
import {DefaultFormatter} from "../src/formatter/default";

var result: {richText: string};

export function initTest(testCpt: any, tpl: string): {fixture: ComponentFixture<any>, rootRenderer: RichTextRootRenderer} {
  TestBed.overrideComponent(testCpt, {set: {template: tpl}});
  const rootRenderer: RichTextRootRenderer = getTestBed().get(RichTextRootRenderer);
  const fixture: ComponentFixture<any> = TestBed.createComponent(testCpt);
  fixture.autoDetectChanges();
  rootRenderer.refresh();
  return {fixture: fixture, rootRenderer: rootRenderer};
}

describe('RichTextRenderer', () => {

  beforeEach(() => {
    result = {richText: null};
    TestBed.configureTestingModule({
      imports: [CommonModule, ApplicationModule],
      providers: [
        {provide: PRINTER, useValue: new MockPrinter(result)},
        DefaultFormatter,
        {provide: FORMATTER, useExisting: DefaultFormatter},
        {provide: RichTextRootRenderer, useClass: RichTextRootRenderer_},
        {provide: RootRenderer, useExisting: RichTextRootRenderer}
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TestComponent, SubComponent, SubComponentWithProjection]
    });
  });

  it('should render text', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `foo`);
    expect(result.richText).toEqual('foo');
  });

  it('should render element', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<a>foo</a>`);
    expect(result.richText).toEqual('<a>foo</a>');
  });

  it('should render element with attributes', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<a c="d" e="f">foo</a>`);
    expect(result.richText).toEqual('<a c="d" e="f">foo</a>');
  });

  it('should render component', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `1<sub></sub>2`);
    expect(result.richText).toEqual('1<sub>sub</sub>2');
  });

  it('should support interpolation', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `1{{s}}2`);
    expect(result.richText).toEqual('1bar2');
  });

  it('should not support binding to interpolated properties', () => {
    expect(() => {initTest(TestComponent, `<a b="{{s}}">foo</a>`)}).toThrow();
  });

  it('should not support binding to properties', () => {
    expect(() => {initTest(TestComponent, `<a [b]="s">foo</a>`)}).toThrow();
  });

  it('should support binding to attributes', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `<a [attr.b]="s">foo</a>`);
    expect(result.richText).toEqual('<a b="bar">foo</a>');

    fixture.componentInstance.s = 'baz';
    fixture.detectChanges();
    rootRenderer.refresh();
    expect(result.richText).toEqual('<a b="baz">foo</a>');
  });

  it('should support NgIf', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `1<a *ngIf="b">foo</a>2`);
    expect(result.richText).toEqual('1<a>foo</a>2');

    fixture.componentInstance.b = false;
    fixture.detectChanges();
    rootRenderer.refresh();
    expect(result.richText).toEqual('12');
  });

  it('should support NgFor', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `0<template ngFor let-item [ngForOf]="a">{{item}}</template>4`);
    expect(result.richText).toEqual('01234');

    fixture.componentInstance.a.pop();
    fixture.detectChanges();
    rootRenderer.refresh();
    expect(result.richText).toEqual('0124');

    fixture.componentInstance.a = [];
    fixture.detectChanges();
    rootRenderer.refresh();
    expect(result.richText).toEqual('04');

    fixture.componentInstance.a.push(8);
    fixture.detectChanges();
    rootRenderer.refresh();
    expect(result.richText).toEqual('084');
  });

  it('should support NgFor with several children and right order', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `-<template ngFor let-item [ngForOf]="d"><a>{{item.a}}</a><b>{{item.b}}</b></template>-`);
    expect(result.richText).toEqual('-<a>0</a><b>1</b><a>8</a><b>9</b>-');
  });

  it('should support ng-content', () => {
    const {fixture, rootRenderer} = initTest(TestComponent, `-<proj><a>a</a><b>b</b></proj>-`);
    expect(result.richText).toEqual('-<proj>0<b>b</b>1<a>a</a>2</proj>-');
  });

});

@Component({
  selector: 'sub',
  template: `sub`
})
class SubComponent {
}
@Component({
  selector: 'proj',
  template: `0<ng-content select="b"></ng-content>1<ng-content></ng-content>2`
})
class SubComponentWithProjection {
}
@Component({
  selector: 'test-cmp',
  template: `to be overriden`
})
class TestComponent {
  s: string = 'bar';
  b: boolean = true;
  a: Array<number> = [1,2,3];
  d: Array<Object> = [{a:0,b:1}, {a:8, b:9}]
  n: number = 0;
}