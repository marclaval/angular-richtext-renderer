import {Component, NgIf, NgFor} from 'angular2/angular2';

import {bootstrapRichText} from '../../src/rich_text_renderer';
import {BrowserAdapter} from '../../src/adapter/browser';
import {MarkdownFormatter} from '../../src/formatter/markdown';

@Component({
  selector: 'sub-note',
  template: `<ng-content select="bold"></ng-content>
  <italic>Created with Angular2  <ng-content></ng-content></italic>`
})
export class SubNote {}

@Component({
  selector: 'hello-app',
  template: `<header1>Hello {{name}}!</header1>
    Say hello to the <bold>world</bold>
    <md-link url="http://www.github.com">Github</md-link>
    <md-link [url]="url">Angular</md-link>
    <md-link url="{{url}}">Angular</md-link>
    <md-link [attr.url]="url">Angular</md-link>
    <bold *ng-if="maybe">Maybe you can see that</bold>
    <bold *ng-for="#item of items">Item {{item}}</bold>
    <sub-note><bold>Test</bold>with love</sub-note>`,
  directives: [NgIf, NgFor, SubNote]
})
export class HelloApp {
  name: string = 'world';
  url: string = 'http://www.angularjs.org';
  maybe: boolean = true;
  items: Array<number> = [1, 2, 3];

  constructor() {
    setTimeout(() => {
      this.name = 'reader';
      this.url = 'http://www.angular.io';
      this.maybe = false;
      this.items.push(42);
    }, 1000);
  }
}

bootstrapRichText(HelloApp, BrowserAdapter, MarkdownFormatter);
