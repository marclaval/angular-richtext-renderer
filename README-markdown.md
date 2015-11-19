# Markdown formatter
This formatter defines a set of elements which are matching the Markdown syntax.
It implements [Markdown basics](https://help.github.com/articles/markdown-basics/) and [Github flavored markdown]().

These elements are **optional**, but needed to apply directives. They are:

 Tag | Attribute | Description | Sample | Output |
 :----: | :----: | :----: | :----: | :----: |
 heading1 |  | Heading level 1 | `<heading1>foo</heading1>` | `# foo` |
 heading2 |  | Heading level 2 | `<heading2>foo</heading2>` | `## foo` |
 heading3 |  | Heading level 3 | `<heading3>foo</heading3>` | `### foo` |
 heading4 |  | Heading level 4 | `<heading4>foo</heading4>` | `#### foo` |
 heading5 |  | Heading level 5 | `<heading5>foo</heading5>` | `##### foo` |
 heading6 |  | Heading level 6 | `<heading6>foo</heading6>` | `###### foo` |
 blockquote |  | A quote | `<blockquote>foo</blockquote>` | `> foo` |
 italic |  | Italic text | `<italic>foo</italic>` | `*foo*` |
 bold |  | Bold text | `<bold>foo</bold>` | `**foo**` |
 unordered |  | Unordered list item | `<unordered>foo</unordered>` | `* foo` |
 ordered | index | Ordered list item | `<ordered index="1">foo</ordered>` | `1. foo` |
 codeline |  | A line of code | `<codeline>var foo = 123;</codeline>` | ``var foo = 123;`` |
 codeblock | language | A block of code | `<codeblock language="javascript">var foo = 123;</codeblock>` | ````var foo = 123;````` |
 hyperlink | url | A link | `<hyperlink url="foo.com">foo</hyperlink>` | `[foo](foo.com)` |
 strikethrough |  | Strikethrough text | `<strikethrough>foo</strikethrough>` | `~~foo~~` |
 task | completed | Task item | `<task completed="yes">foo</task>` | `* [x] foo` |
 header | align | Table header | `<header align="center">foo</header>` | `| foo |  | :----: |` |
 cell |  | Table cell | `<cell>foo</cell>` | `| foo |` |
