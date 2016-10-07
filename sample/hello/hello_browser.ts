import {bootstrapRichText} from '../../src/rich_text_renderer';
import {BrowserPrinter} from "../../src/printer/browser";
import {MarkdownFormatter} from "../../src/formatter/markdown";
import {HelloModule} from "./hello";

bootstrapRichText(HelloModule, BrowserPrinter, MarkdownFormatter);
