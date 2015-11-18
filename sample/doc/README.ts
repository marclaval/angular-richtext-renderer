import 'reflect-metadata';
import 'zone.js/dist/zone-microtask';
import {Parse5DomAdapter} from 'angular2/src/core/dom/parse5_adapter';
import {Component} from 'angular2/angular2';

import {bootstrapRichText} from '../../src/rich_text_renderer';
import {FsAdapter} from "../../src/adapter/fs";
import {MarkdownFormatter} from "../../src/formatter/markdown";

@Component({
  selector: 'README.md',
  template:
`<header1>angular-richtext-renderer</header1>
A renderer to generate rich text document (e.g. markdown) with Angular 2.

<header2>Development</header2>

<header3>Preparing your environment</header3>
<unordered>Clone this repository or a fork of it</unordered>
<unordered>Install Gulp and TSD globally: <codeline>npm install -g gulp tsd</codeline></unordered>
<unordered>Install local npm modules: <codeline>npm install -g gulp tsd</codeline></unordered>

<header3>Running scripts</header3>

To run the sample in node:
<unordered>Launch <codeline>gulp sample.node</codeline>  to continuously build it and generate output in <codeline>./build/sample/</codeline> folder</unordered>

To run the sample in a browser:
<unordered>Launch <codeline>gulp sample.browser</codeline> to continuously build it and start a webserver at http://localhost:9001</unordered>

To run tests in node:
<unordered>Launch <codeline>gulp test.node</codeline></unordered>

To run tests in Chrome:
<unordered>Launch <codeline>gulp test.browser</codeline></unordered>
`
})
export class Readme {}

Parse5DomAdapter.makeCurrent();
bootstrapRichText(Readme, FsAdapter, MarkdownFormatter);