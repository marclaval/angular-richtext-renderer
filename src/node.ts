export abstract class Node {
  public parent: Node;
  public children: Node[] = [];
  public attribs: Map<string, any> = new Map<string, any>();

  public setAttribute(name: string, value: any) {
    this.attribs.set(name, value);
  }

  public getAttribute(name: string): any {
    return this.attribs.get(name);
  }

  attachTo(parent: Node): void {
    if (parent) {
      parent.children.push(this);
      this.parent = parent;
    }
  }

  attachToAt(parent: Node, index: number): void {
    if (parent) {
      parent.children.splice(index, 0, this);
      this.parent = parent;
    }
  }
}


export class ElementNode extends Node {
  constructor(public tag: string) { super(); }
}

export class TextNode extends Node {
  constructor(public value: string) { super(); }
}

export class AnchorNode extends Node {
  constructor() { super(); }
}