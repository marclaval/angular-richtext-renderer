import {
  Renderer,
  RenderElementRef,
  RenderFragmentRef,
  RenderProtoViewRef,
  RenderViewRef,
  RenderViewWithFragments,
  RenderTemplateCmd,
  RenderEventDispatcher
} from 'angular2/angular2';
import {RenderComponentTemplate} from 'angular2/src/core/render/api';
import {Node, ComponentNode, ElementNode, TextNode, AnchorNode} from './node';
import {BuildContext, RichTextRenderViewBuilder} from "./builder";
import {DOM} from 'angular2/src/core/dom/dom_adapter';

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

export class RichTextRenderer extends Renderer {
  private _componentTpls: Map<string, RenderComponentTemplate> = new Map<string, RenderComponentTemplate>();
  private _anchor: Element;
  private _rootView: RenderViewWithFragments;

  constructor() {
    super();
    //console.log('constructor', arguments);
  }

  createProtoView(componentTemplateId: string, cmds:RenderTemplateCmd[]):RenderProtoViewRef {
    //console.log('createProtoView', arguments);
    return new RichTextProtoViewRef(this._componentTpls.get(componentTemplateId), cmds);
  }

  registerComponentTemplate(template: RenderComponentTemplate): void {
    //console.log('registerComponentTemplate', arguments);
    this._componentTpls.set(template.id, template);
  }

  resolveComponentTemplate(templateId: string): RenderComponentTemplate {
    return this._componentTpls.get(templateId);
  }

  createRootHostView(hostProtoViewRef:RenderProtoViewRef, fragmentCount:number, hostElementSelector:string):RenderViewWithFragments {
    //console.log('createRootHostView', arguments);
    var el = DOM.querySelector(DOM.defaultDoc().body, hostElementSelector);
    if (el) {
      this._anchor = el;
      this._rootView = this._createView(hostProtoViewRef);
      return this._rootView;
    } else {
      throw `The selector "${hostElementSelector}" did not match any elements`;
    }
  }

  _refresh() {
    DOM.setInnerHTML(this._anchor,
      (<RichTextRenderFragmentRef>this._rootView.fragmentRefs[0]).nodes[0].toMarkdown());
  }

  createView(protoViewRef:RenderProtoViewRef, fragmentCount:number):RenderViewWithFragments {
    //console.log('createView', arguments);
    return this._createView(protoViewRef);
  }

  _createView(protoViewRef:RenderProtoViewRef): RenderViewWithFragments {
    //console.log('_createView', arguments);
    var context = new BuildContext();
    var builder = new RichTextRenderViewBuilder(this, (<RichTextProtoViewRef>protoViewRef).cmds, null, context);
    context.build(builder);
    var fragments: RichTextRenderFragmentRef[] = [];
    for (var i = 0; i < context.fragments.length; i++) {
      fragments.push(new RichTextRenderFragmentRef(context.fragments[i]));
    }
    var view = new RichTextViewRef(fragments, context.boundTextNodes, context.boundElementNodes);
    return new RenderViewWithFragments(view, view.fragments);
  }

  destroyView(viewRef:RenderViewRef):any {
    console.error('destroyView', arguments);
    return undefined;
  }

  attachFragmentAfterFragment(previousFragmentRef:RenderFragmentRef, fragmentRef:RenderFragmentRef): void {
    //console.log('attachFragmentAfterFragment', arguments);
    var previousNodes = (<RichTextRenderFragmentRef>previousFragmentRef).nodes;
    if (previousNodes.length > 0) {
      var sibling = previousNodes[previousNodes.length - 1];
      var nodes = (<RichTextRenderFragmentRef>fragmentRef).nodes;
      if (nodes.length > 0 && sibling.parent) {
        for (var i = 0; i < nodes.length; i++) {
          var index = sibling.parent.children.indexOf(sibling);
          sibling.parent.children.splice(index + 1, 0, nodes[i]);
          nodes[i].parent = sibling.parent;
        }
        this._refresh();
      }
    }
  }

  attachFragmentAfterElement(location:RenderElementRef, fragmentRef:RenderFragmentRef): void {
    //console.log('attachFragmentAfterElement', arguments);
    var sibling = (<RichTextViewRef>location.renderView).boundElementNodes[(<any>location).boundElementIndex];
    var nodes = (<RichTextRenderFragmentRef>fragmentRef).nodes;
    if (nodes.length > 0 && sibling.parent) {
      for (var i = 0; i < nodes.length; i++) {
        var index = sibling.parent.children.indexOf(sibling);
        sibling.parent.children.splice(index + 1, 0, nodes[i]);
        nodes[i].parent = sibling.parent;
      }
      this._refresh();
    }
  }

  detachFragment(fragmentRef:RenderFragmentRef): void {
    //console.log('detachFragment', arguments);
    var nodes = (<RichTextRenderFragmentRef>fragmentRef).nodes;
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var index = node.parent.children.indexOf(node);
      node.parent.children.splice(index, 1);
    }
    this._refresh();
  }

  hydrateView(viewRef:RenderViewRef): void {
    //console.log('hydrateView', arguments);
    (<RichTextViewRef>viewRef).hydrated = true;
  }

  dehydrateView(viewRef:RenderViewRef): void {
    //console.log('dehydrateView', arguments);
    (<RichTextViewRef>viewRef).hydrated = false;
  }

  getNativeElementSync(location:RenderElementRef):any {
    //console.log('getNativeElementSync', arguments);
    return (<RichTextViewRef>location.renderView).boundElementNodes[(<any>location).boundElementIndex];
  }

  setElementProperty(location:RenderElementRef, propertyName:string, propertyValue:any): void {
    //console.log('setElementProperty', arguments);
    var node = (<RichTextViewRef>location.renderView).boundElementNodes[(<any>location).boundElementIndex];
    node.attributes[propertyName] = propertyValue;
    this._refresh();
  }

  setElementAttribute(location:RenderElementRef, attributeName:string, attributeValue:string): void {
    //console.log('setElementAttribute', arguments);
    var node = (<RichTextViewRef>location.renderView).boundElementNodes[(<any>location).boundElementIndex];
    node.attributes[attributeName] = attributeValue;
    this._refresh();
  }

  setElementClass(location:RenderElementRef, className:string, isAdd:boolean): void {
    console.error('setElementClass', arguments);
  }

  setElementStyle(location:RenderElementRef, styleName:string, styleValue:string): void {
    console.error('setElementStyle', arguments);
  }

  invokeElementMethod(location:RenderElementRef, methodName:string, args:any[]): void {
    console.error('invokeElementMethod', arguments);
  }

  setText(viewRef:RenderViewRef, textNodeIndex:number, text:string): void {
    //console.log('setText', arguments);
    (<RichTextViewRef>viewRef).boundTextNodes[textNodeIndex].value = text;
    this._refresh();
  }

  setEventDispatcher(viewRef:RenderViewRef, dispatcher:RenderEventDispatcher): void {
    //console.log('setEventDispatcher', arguments);
    //Do nothing
  }

}
