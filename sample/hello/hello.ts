import {Component, NgModule, ApplicationModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

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
    <hyperlink url="http://www.github.com">Github</hyperlink>
    <hyperlink [attr.url]="url">Angular</hyperlink>
    <bold *ngIf="maybe">Maybe you can see that</bold>
    <bold *ngFor="let item of items">Item {{item}}</bold>
    <sub-note><bold>Test</bold>with love</sub-note>`
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

@NgModule({
  declarations: [HelloApp],
  imports: [ApplicationModule, CommonModule],
  bootstrap: [HelloApp],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HelloModule {}