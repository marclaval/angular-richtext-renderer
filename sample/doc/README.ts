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
It can be used in node or in a browser.

<bold>All the documentations of this repository have been created with this renderer, including the current lines.</bold>

<header2>Usage</header2>
Create an Angular2 <codeline>Component</codeline> and use the specific bootstrap method, e.g: <codeline>bootstrapRichText(HelloApp, FsAdapter, MarkdownFormatter);</codeline>
The <codeline>Formatter</codeline> and <codeline>Adapter</codeline> are required. You can use the ones provided here, or create your own.

For more details, have a look at the <hyperlink url="https://github.com/mlaval/angular-richtext-renderer/tree/master/sample">samples</hyperlink> in this repository.

<header3>Warnings</header3>
<unordered>White spaces and line returns are preserved by the rendered, none are added. So all indentation and new lines have to be managed by the user</unordered>
<unordered>Only bind to attributes, never to properties, otherwise it will fail</unordered>
<unordered>There are no native events</unordered>

<header2>Customization</header2>

<header3>Formatter</header3>
The <hyperlink url="https://github.com/mlaval/angular-richtext-renderer/tree/master/src/formatter">formatter</hyperlink> generates the actual rich text string.
As an input, it takes a tree of nodes which represents the full application. The tree is built by the Angular2 and the renderer.
Two are available:
<unordered><codeline>DefaultFormatter</codeline>: a simple one which preserves the text but apply all Angular2's magic</unordered>
<unordered><codeline>MarkdownFormatter</codeline>: it extends the default one by defining special elements matching the markdown syntax, <hyperlink url="README-markdown.md">more info</hyperlink>.</unordered>

<header3>Adapter</header3>
The <hyperlink url="https://github.com/mlaval/angular-richtext-renderer/tree/master/src/adapter">adapter</hyperlink> is in charge of handling the formatter's output, i.e. the rich text string.
The rich text string is fully generated each time the something is updated and a refresh happens.
Three are available:
<unordered><codeline>DefaultAdapter</codeline>: simply logs in the console</unordered>
<unordered><codeline>FsAdapter</codeline>: saves the rich text in a file</unordered>
<unordered><codeline>BrowserAdapter</codeline>: displays the rich text in a code HTMLElement</unordered>

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