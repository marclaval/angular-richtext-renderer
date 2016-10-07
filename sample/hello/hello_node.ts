import 'reflect-metadata';
import 'zone.js/dist/zone-node.js';

import {bootstrapRichText} from '../../src/rich_text_renderer';
import {FsPrinter} from "../../src/printer/fs";
import {MarkdownFormatter} from "../../src/formatter/markdown";
import {HelloModule} from "./hello";

bootstrapRichText(HelloModule, FsPrinter, MarkdownFormatter);
