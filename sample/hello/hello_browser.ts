import {bootstrapRichText} from '../../src/rich_text_renderer';
import {BrowserPrinter} from "../../src/printer/browser";
import {MarkdownFormatter} from "../../src/formatter/markdown";
import {HelloApp} from "./hello";

bootstrapRichText(HelloApp, BrowserPrinter, MarkdownFormatter);
