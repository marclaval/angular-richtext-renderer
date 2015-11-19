import 'reflect-metadata';
import 'zone.js/dist/zone-microtask';
import {Parse5DomAdapter} from 'angular2/src/core/dom/parse5_adapter';
import {Component, NgFor} from 'angular2/angular2';

import {bootstrapRichText} from '../../src/rich_text_renderer';
import {FsAdapter} from "../../src/adapter/fs";
import {MarkdownFormatter} from "../../src/formatter/markdown";

@Component({
  selector: 'README-markdown.md',
  directives: [NgFor],
  template:
`<header1>Markdown formatter</header1>
This formatter defines a set of elements which are matching the Markdown syntax.
It implements <hyperlink url="https://help.github.com/articles/markdown-basics/">Markdown basics</hyperlink> and <hyperlink url=""https://help.github.com/articles/github-flavored-markdown/>Github flavored markdown</hyperlink>.

These elements are <bold>optional</bold>, but needed to apply directives. They are:

<header align="center">Tag</header><header align="center">Attribute</header><header align="center">Description</header><header align="center">Sample</header><header align="center">Output</header><template ng-for #data [ng-for-of]="dataset">
<cell>{{data.tag}}</cell><cell>{{data.attribute}}</cell><cell>{{data.description}}</cell></cell><cell>\`{{data.sample}}\`</cell></cell><cell>\`{{data.output}}\`</cell></template>
`
})
export class Readme {
  dataset: Array<Object> = [
    {tag: "heading1", attribute: "", description: "Heading level 1", sample: "<heading1>foo</heading1>", output: '# foo'},
    {tag: "heading2", attribute: "", description: "Heading level 2", sample: "<heading2>foo</heading2>", output: '## foo'},
    {tag: "heading3", attribute: "", description: "Heading level 3", sample: "<heading3>foo</heading3>", output: '### foo'},
    {tag: "heading4", attribute: "", description: "Heading level 4", sample: "<heading4>foo</heading4>", output: '#### foo'},
    {tag: "heading5", attribute: "", description: "Heading level 5", sample: "<heading5>foo</heading5>", output: '##### foo'},
    {tag: "heading6", attribute: "", description: "Heading level 6", sample: "<heading6>foo</heading6>", output: '###### foo'},
    {tag: "blockquote", attribute: "", description: "A quote", sample: "<blockquote>foo</blockquote>", output: '> foo'},
    {tag: "italic", attribute: "", description: "Italic text", sample: "<italic>foo</italic>", output: '*foo*'},
    {tag: "bold", attribute: "", description: "Bold text", sample: "<bold>foo</bold>", output: '**foo**'},
    {tag: "unordered", attribute: "", description: "Unordered list item", sample: "<unordered>foo</unordered>", output: '* foo'},
    {tag: "ordered", attribute: "index", description: "Ordered list item", sample: `<ordered index="1">foo</ordered>`, output: '1. foo'},
    {tag: "codeline", attribute: "", description: "A line of code", sample: "<codeline>var foo = 123;</codeline>", output: '`var foo = 123;`'},
    {tag: "codeblock", attribute: "language", description: "A block of code", sample: `<codeblock language="javascript">var foo = 123;</codeblock>`, output: '```var foo = 123;````'},
    {tag: "hyperlink", attribute: "url", description: "A link", sample: `<hyperlink url="foo.com">foo</hyperlink>`, output: '[foo](foo.com)'},
    {tag: "strikethrough", attribute: "", description: "Strikethrough text", sample: "<strikethrough>foo</strikethrough>", output: '~~foo~~'},
    {tag: "task", attribute: "completed", description: "Task item", sample: `<task completed="yes">foo</task>`, output: '* [x] foo'},
    {tag: "header", attribute: "align", description: "Table header", sample: `<header align="center">foo</header>`, output: '| foo |  | :----: |'},
    {tag: "cell", attribute: "", description: "Table cell", sample: `<cell>foo</cell>`, output: '| foo |'}
  ]
}

Parse5DomAdapter.makeCurrent();
bootstrapRichText(Readme, FsAdapter, MarkdownFormatter);