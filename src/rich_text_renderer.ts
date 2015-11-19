import {
  Renderer,
  RenderElementRef,
  RenderFragmentRef,
  RenderProtoViewRef,
  RenderViewRef,
  RenderViewWithFragments,
  RenderTemplateCmd,
  RenderEventDispatcher,
  Injectable,
  Inject,
  OpaqueToken,
  provide,
  bootstrap,
  Type
} from 'angular2/angular2';
import {RenderComponentTemplate} from 'angular2/src/core/render/api';
import {Node, ComponentNode, ElementNode, TextNode, AnchorNode} from './node';
import {BuildContext, RichTextRenderViewBuilder} from "./builder";
import {Adapter, DefaultAdapter} from './adapter/default';
import {Formatter, DefaultFormatter} from './formatter/default';

export const ADAPTER: OpaqueToken = new OpaqueToken("Adapter");
export const FORMATTER: OpaqueToken = new OpaqueToken("Formatter");

export function bootstrapRichText(cpt: any, adapter: Type, formatter: Type) {
  var _adapter = adapter ? adapter : DefaultAdapter;
  var _formatter = formatter ? formatter : DefaultFormatter;
  bootstrap(cpt, [
    [RichTextRenderer],
    provide(Renderer, {useExisting: RichTextRenderer}),
    _adapter,
    provide(ADAPTER, {useExisting: _adapter}),
    _formatter,
    provide(FORMATTER, {useExisting: _formatter})
  ]);
}

class RichTextProtoViewRef extends RenderProtoViewRef {
  constructor(public template: RenderComponentTemplate, public cmds: RenderTemplateCmd[]) { super(); }
}

class RichTextRenderFragmentRef extends RenderFragmentRef {
  constructor(public nodes: Node[]) { super(); }
}

class RichTextViewRef extends RenderViewRef {
  hydrated: boolean = false;
  constructor(public fragments: RichTextRenderFragmentRef[], public boundTextNodes: TextNode[],
              public boundElementNodes: Node[]) { super(); }
}

@Injectable()
export class RichTextRenderer extends Renderer {
  private _componentTpls: Map<string, RenderComponentTemplate> = new Map<string, RenderComponentTemplate>();
  private _rootView: RenderViewWithFragments;
  private _adapter: Adapter;
  private _formatter: Formatter;

  constructor(@Inject(ADAPTER) adapter: Adapter, @Inject(FORMATTER) formatter: Formatter) {
    super();
    this._adapter = adapter;
    this._formatter = formatter;
  }

  createProtoView(componentTemplateId: string, cmds:RenderTemplateCmd[]):RenderProtoViewRef {
    return new RichTextProtoViewRef(this._componentTpls.get(componentTemplateId), cmds);
  }

  registerComponentTemplate(template: RenderComponentTemplate): void {
    this._componentTpls.set(template.id, template);
  }

  createRootHostView(hostProtoViewRef:RenderProtoViewRef, fragmentCount:number, hostElementSelector:string):RenderViewWithFragments {
    this._adapter.init(hostElementSelector);
    this._rootView = this._createView(hostProtoViewRef);
    this._refresh();
    return this._rootView;
  }

  _refresh() {
    this._adapter.print(this._formatter.format((<RichTextRenderFragmentRef>this._rootView.fragmentRefs[0]).nodes[0]));
  }

  createView(protoViewRef:RenderProtoViewRef, fragmentCount:number):RenderViewWithFragments {
    return this._createView(protoViewRef);
  }

  _createView(protoViewRef:RenderProtoViewRef): RenderViewWithFragments {
    var context = new BuildContext();
    var builder = new RichTextRenderViewBuilder(this._componentTpls, (<RichTextProtoViewRef>protoViewRef).cmds, null, context);
    context.build(builder);
    var fragments: RichTextRenderFragmentRef[] = [];
    for (var i = 0; i < context.fragments.length; i++) {
      fragments.push(new RichTextRenderFragmentRef(context.fragments[i]));
    }
    var view = new RichTextViewRef(fragments, context.boundTextNodes, context.boundElementNodes);
    return new RenderViewWithFragments(view, view.fragments);
  }

  destroyView(viewRef:RenderViewRef):any {
    console.error('NOT IMPLEMENTED: destroyView', arguments);
    return undefined;
  }

  attachFragmentAfterFragment(previousFragmentRef:RenderFragmentRef, fragmentRef:RenderFragmentRef): void {
    var previousNodes = (<RichTextRenderFragmentRef>previousFragmentRef).nodes;
    if (previousNodes.length > 0) {
      var sibling = previousNodes[previousNodes.length - 1];
      var nodes = (<RichTextRenderFragmentRef>fragmentRef).nodes;
      if (nodes.length > 0 && sibling.parent) {
        for (var i = 0; i < nodes.length; i++) {
          var index = sibling.parent.children.indexOf(sibling);
          sibling.parent.children.splice(index + i + 1, 0, nodes[i]);
          nodes[i].parent = sibling.parent;
        }
        this._refresh();
      }
    }
  }

  attachFragmentAfterElement(location:RenderElementRef, fragmentRef:RenderFragmentRef): void {
    var sibling = (<RichTextViewRef>location.renderView).boundElementNodes[(<any>location).boundElementIndex];
    var nodes = (<RichTextRenderFragmentRef>fragmentRef).nodes;
    if (nodes.length > 0 && sibling.parent) {
      for (var i = 0; i < nodes.length; i++) {
        var index = sibling.parent.children.indexOf(sibling);
        sibling.parent.children.splice(index + i + 1, 0, nodes[i]);
        nodes[i].parent = sibling.parent;
      }
      this._refresh();
    }
  }

  detachFragment(fragmentRef:RenderFragmentRef): void {
    var nodes = (<RichTextRenderFragmentRef>fragmentRef).nodes;
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var index = node.parent.children.indexOf(node);
      node.parent.children.splice(index, 1);
    }
    this._refresh();
  }

  hydrateView(viewRef:RenderViewRef): void {
    (<RichTextViewRef>viewRef).hydrated = true;
  }

  dehydrateView(viewRef:RenderViewRef): void {
    (<RichTextViewRef>viewRef).hydrated = false;
  }

  getNativeElementSync(location:RenderElementRef):any {
    return (<RichTextViewRef>location.renderView).boundElementNodes[(<any>location).boundElementIndex];
  }

  setElementProperty(location:RenderElementRef, propertyName:string, propertyValue:any): void {
    var node = (<RichTextViewRef>location.renderView).boundElementNodes[(<any>location).boundElementIndex];
    node.setAttribute(propertyName, propertyValue);
    this._refresh();
  }

  setElementAttribute(location:RenderElementRef, attributeName:string, attributeValue:string): void {
    var node = (<RichTextViewRef>location.renderView).boundElementNodes[(<any>location).boundElementIndex];
    node.setAttribute(attributeName, attributeValue);
    this._refresh();
  }

  setElementClass(location:RenderElementRef, className:string, isAdd:boolean): void {
    console.error('NOT IMPLEMENTED: setElementClass', arguments);
  }

  setElementStyle(location:RenderElementRef, styleName:string, styleValue:string): void {
    console.error('NOT IMPLEMENTED: setElementStyle', arguments);
  }

  invokeElementMethod(location:RenderElementRef, methodName:string, args:any[]): void {
    console.error('NOT IMPLEMENTED: invokeElementMethod', arguments);
  }

  setText(viewRef:RenderViewRef, textNodeIndex:number, text:string): void {
    (<RichTextViewRef>viewRef).boundTextNodes[textNodeIndex].value = text;
    this._refresh();
  }

  setEventDispatcher(viewRef:RenderViewRef, dispatcher:RenderEventDispatcher): void {
    //Do nothing
  }

}
