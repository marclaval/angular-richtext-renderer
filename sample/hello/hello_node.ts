import 'reflect-metadata';
import 'zone.js/dist/zone-microtask';
import {Parse5DomAdapter} from 'angular2/src/core/dom/parse5_adapter';

import {bootstrapRichText} from '../../src/rich_text_renderer';
import {FsAdapter} from "../../src/adapter/fs";
import {MarkdownFormatter} from "../../src/formatter/markdown";
import {HelloApp} from "./hello";

Parse5DomAdapter.makeCurrent();
bootstrapRichText(HelloApp, FsAdapter, MarkdownFormatter);
