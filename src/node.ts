export abstract class Node {
  public parent: Node;
  public children: Node[] = [];
  public attribs: Map<string, any> ;

  public setAttribute(name: string, value: any) {
    this.attribs.set(name, value);
  }

  public getAttribute(name: string): any {
    return this.attribs.get(name);
  }
}

export class ComponentNode extends Node {
  private contentNodesByNgContentIndex: Node[][] = [];

  constructor(public tag: string, public isBound: boolean, public attribs: Map<string, any>, public isRoot: boolean = false) { super(); }

  addContentNode(ngContentIndex: number, node: Node) {
    while (this.contentNodesByNgContentIndex.length <= ngContentIndex) {
      this.contentNodesByNgContentIndex.push([]);
    }
    this.contentNodesByNgContentIndex[ngContentIndex].push(node);
  }

  project(ngContentIndex: number): Node[] {
    return ngContentIndex < this.contentNodesByNgContentIndex.length ?
      this.contentNodesByNgContentIndex[ngContentIndex] :
      [];
  }
}

export class ElementNode extends Node {
  constructor(public tag: string, public isBound: boolean, public attribs: Map<string, any>) { super(); }
}

export class TextNode extends Node {
  constructor(public value: string,  public isBound: boolean) { super(); }
}

export class AnchorNode extends Node {
  constructor() { super(); this.attribs = new Map<string, any>();}
}