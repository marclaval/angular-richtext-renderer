import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import {Component, NgModule, ApplicationModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {bootstrapRichText} from '../../src/rich_text_renderer';
import {FsPrinter} from "../../src/printer/fs";
import {MarkdownFormatter} from "../../src/formatter/markdown";

@Component({
  selector: 'README.md',
  template:
`[![Build Status](https://secure.travis-ci.org/mlaval/angular-richtext-renderer.png)](http://travis-ci.org/mlaval/angular-richtext-renderer)
<header1>angular-richtext-renderer</header1>
A renderer to generate rich text document (e.g. markdown) with Angular 2.
It can be used in node or in a browser.

<bold>All the documentations of this repository have been created with this renderer, including the current lines.</bold>

<header2>Usage</header2>
Create an Angular2 <codeline>Component</codeline> and use the specific bootstrap method, e.g: <codeline>bootstrapRichText(HelloApp, FSPrinter, MarkdownFormatter);</codeline>
The <codeline>Formatter</codeline> and <codeline>Printer</codeline> are required. You can use the ones provided here, or create your own.

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

<header3>Printer</header3>
The <hyperlink url="https://github.com/mlaval/angular-richtext-renderer/tree/master/src/printer">printer</hyperlink> is in charge of handling the formatter's output, i.e. the rich text string.
The rich text string is fully generated each time the something is updated and a refresh happens.
Three are available:
<unordered><codeline>DefaultPrinter</codeline>: simply logs in the console</unordered>
<unordered><codeline>FsPrinter</codeline>: saves the rich text in a file</unordered>
<unordered><codeline>BrowserPrinter</codeline>: displays the rich text in a code HTMLElement</unordered>

<header2>Development</header2>

<header3>Preparing your environment</header3>
<unordered>Clone this repository or a fork of it</unordered>
<unordered>Install Gulp and TSD globally: <codeline>npm install -g gulp typings</codeline></unordered>
<unordered>Install local npm modules: <codeline>npm install</codeline></unordered>

<header3>Running scripts</header3>

To build the documentation:
<unordered>Launch <codeline>gulp doc</codeline> to continuously build it and generate output in <codeline>./build/sample/</codeline> folder</unordered>

To run the sample in node:
<unordered>Launch <codeline>gulp sample.node</codeline> to continuously build it and generate output in <codeline>./build/sample/</codeline> folder</unordered>

To run the sample in a browser:
<unordered>Launch <codeline>gulp sample.browser</codeline> to continuously build it and start a webserver at http://localhost:9001</unordered>

To run tests in Firefox:
<unordered>Launch <codeline>gulp test.browser</codeline></unordered>
`
})
export class Readme {}


@NgModule({
  declarations: [Readme],
  imports: [ApplicationModule, CommonModule],
  bootstrap: [Readme],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ReadmeModule {}
bootstrapRichText(ReadmeModule, FsPrinter, MarkdownFormatter);