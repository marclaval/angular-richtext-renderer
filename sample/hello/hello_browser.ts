import {bootstrapRichText} from '../../src/rich_text_renderer';
import {BrowserAdapter} from "../../src/adapter/browser";
import {MarkdownFormatter} from "../../src/formatter/markdown";
import {HelloApp} from "./hello";

bootstrapRichText(HelloApp, BrowserAdapter, MarkdownFormatter);
