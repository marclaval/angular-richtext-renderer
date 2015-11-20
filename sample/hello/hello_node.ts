import 'reflect-metadata';
import 'zone.js/dist/zone-microtask';
import {Parse5DomAdapter} from 'angular2/src/core/dom/parse5_adapter';

import {bootstrapRichText} from '../../src/rich_text_renderer';
import {FsPrinter} from "../../src/printer/fs";
import {MarkdownFormatter} from "../../src/formatter/markdown";
import {HelloApp} from "./hello";

Parse5DomAdapter.makeCurrent();
bootstrapRichText(HelloApp, FsPrinter, MarkdownFormatter);
