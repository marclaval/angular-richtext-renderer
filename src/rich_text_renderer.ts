import {
  RootRenderer,
  Renderer,
  RenderComponentType,
  Injectable,
  Inject,
  OpaqueToken,
  Type,
  NgModuleRef,
  NgZone,
  SchemaMetadata,
  Sanitizer,
  SecurityContext,
  ErrorHandler
} from '@angular/core';
import {ElementSchemaRegistry} from "@angular/compiler";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";

import {Node, ElementNode, TextNode, AnchorNode} from './node';
import {Printer, DefaultPrinter} from './printer/default';
import {Formatter, DefaultFormatter} from './formatter/default';

export const PRINTER: OpaqueToken = new OpaqueToken("Printer");
export const FORMATTER: OpaqueToken = new OpaqueToken("Formatter");

export class RichTextElementSchemaRegistry implements ElementSchemaRegistry {
  getDefaultComponentElementName(): string {
    return 'def-cpt';
  }
  hasProperty(tagName: string, propName: string): boolean {
    return true;
  }
  hasElement(tagName: string, schemaMetas: SchemaMetadata[]): boolean {
    return true;
  }
  getMappedPropName(propName: string): string {
    return propName;
  }
  securityContext(tagName: string, propName: string): any {
    return 0;
  }
  validateProperty(name: string): {error: boolean; msg?: string} {
    return {error: false};
  }
  validateAttribute(name: string): {error: boolean; msg?: string} {
    return {error: false};
  }
}

export class RichTextSanitizer implements Sanitizer {
  sanitize(ctx: SecurityContext, value: any): string {
    return value;
  }
}

export function bootstrapRichText(module: any, printer: Type<any>, formatter: Type<any>, customProviders?: Array<any>) {
  var _printer = printer ? printer : DefaultPrinter;
  var _formatter = formatter ? formatter : DefaultFormatter;
  platformBrowserDynamic([
    {provide: ErrorHandler, useFactory: errorHandler, deps: []},
    _printer,
    {provide: PRINTER, useExisting: _printer},
    _formatter,
    {provide: FORMATTER, useExisting: _formatter},
    [RichTextElementSchemaRegistry],
    {provide: ElementSchemaRegistry, useExisting: RichTextElementSchemaRegistry},
    RichTextSanitizer,
    {provide: Sanitizer, useExisting: RichTextSanitizer},
    {provide: RichTextRootRenderer, useClass: RichTextRootRenderer_},
    {provide: RootRenderer, useExisting: RichTextRootRenderer}
  ].concat(customProviders || [])).
  bootstrapModule(module).
  then((ngModuleRef: NgModuleRef<any>) => {
    var zone: NgZone = ngModuleRef.injector.get(NgZone);
    var rootRenderer = ngModuleRef.injector.get(RootRenderer);
    rootRenderer.zone = zone;
    rootRenderer.refresh();
    zone.onStable.subscribe(() => { rootRenderer.refresh(); });
  });;
}

function errorHandler(): ErrorHandler {
  return new ErrorHandler();
}

export class RichTextRootRenderer implements RootRenderer {
  private _registeredComponents: Map<string, RichTextRenderer> = new Map<string, RichTextRenderer>();
  private _printer: Printer;
  private _formatter: Formatter;
  private _root: Node;

  constructor(printer: Printer, formatter: Formatter) {
    this._printer = printer;
    this._formatter = formatter;
  }

  renderComponent(componentType: RenderComponentType): Renderer {
    var renderer = this._registeredComponents.get(componentType.id);
    if (renderer == null) {
      renderer = new RichTextRenderer(this);
      this._registeredComponents.set(componentType.id, renderer);
    }
    return renderer;
  }

  setRoot(root: Node): void {
    this._root = root;
  }

  refresh() {
    this._printer.print(
      this._root.children.map(
        (child) => this._formatter.format(child)
      ).join('')
    );
  }

  initPrinter(selector: string) {
    this._printer.init(selector);
  }
}

@Injectable()
export class RichTextRootRenderer_ extends RichTextRootRenderer {
  constructor(@Inject(PRINTER) printer: Printer, @Inject(FORMATTER) formatter: Formatter) {
    super(printer, formatter);
  }
}

@Injectable()
export class RichTextRenderer implements Renderer {

  constructor(private _rootRenderer: RichTextRootRenderer) { }

  selectRootElement(selector: string): any {
    var root = this.createElement(null, selector.startsWith('#root') ? 'test-cmp' : selector);
    this._rootRenderer.setRoot(root);
    this._rootRenderer.initPrinter(selector)
    return root;
  }

  createElement(parentElement: Node, name: string): Node {
    var node = new ElementNode(name);
    node.attachTo(parentElement);
    return node;
  }

  createViewRoot(hostElement: Node): Node {
    return hostElement;
  }

  createTemplateAnchor(parentElement: Node): Node {
    var node = new AnchorNode();
    node.attachTo(parentElement);
    return node;
  }

  createText(parentElement: Node, value: string): Node {
    var node = new TextNode(value);
    node.attachTo(parentElement);
    return node;
  }

  projectNodes(parentElement: Node, nodes: Node[]): void {
    if (parentElement) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        node.attachTo(parentElement);
      }
    }
  }

  attachViewAfter(node: Node, viewRootNodes: Node[]): void {
    if (viewRootNodes.length > 0) {
      var index = node.parent.children.indexOf(node);
      for (var i = 0; i < viewRootNodes.length; i++) {
        var viewRootNode = viewRootNodes[i];
        viewRootNode.attachToAt(node.parent, index + i + 1);
      }
    }
  }

  detachView(viewRootNodes: Node[]): void {
    for (var i = 0; i < viewRootNodes.length; i++) {
      var node = viewRootNodes[i];
      var parent = node.parent;
      if (parent) {
        var index = parent.children.indexOf(node);
        parent.children.splice(index, 1);
      }
    }
  }

  destroyView(hostElement: Node, viewAllNodes: Node[]): void {
    // Do nothing
  }

  listen(renderElement: any, name: string, callback: Function): Function {
    // Do nothing
    return () => {};
  }

  listenGlobal(target: string, name: string, callback: Function): Function {
    // Do nothing
    return () => {};
  }

  setElementProperty(renderElement: Node, propertyName: string, propertyValue: any): void {
    throw('NOT ALLOWED: binding to property');
  }

  setElementAttribute(renderElement: any, attributeName: string, attributeValue: string): void {
    renderElement.setAttribute(attributeName, attributeValue);
  }

  setBindingDebugInfo(renderElement: any, propertyName: string, propertyValue: string): void {
    // Do nothing
  }

  setElementClass(renderElement:any, className:string, isAdd:boolean):any {
    console.error('NOT IMPLEMENTED: setElementClass', arguments);
  }

  setElementStyle(renderElement:any, styleName:string, styleValue:string):any {
    console.error('NOT IMPLEMENTED: setElementStyle', arguments);
  }

  invokeElementMethod(renderElement: Node, methodName: string, args: any[]): void {
    console.error('NOT IMPLEMENTED: invokeElementMethod', arguments);
  }

  setText(renderNode: Node, text: string): void {
    if (renderNode instanceof TextNode) {
      renderNode.value = text;
    }
  }

  animate(element: any, startingStyles: any, keyframes: any[], duration: number, delay: number, easing: string): any {
    console.error('NOT IMPLEMENTED: animate', arguments);
  }

}
