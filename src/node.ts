export abstract class Node {
  public parent: Node;
  public children: Node[] = [];
  public attributes: any;

  abstract toMarkdown(): string;
}

export class ComponentNode extends Node {
  private contentNodesByNgContentIndex: Node[][] = [];

  constructor(public tag: string, public isBound: boolean, public attributes: any, public isRoot: boolean = false) { super(); }

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

  public toMarkdown(): string {
    var res = '';
    this.children.forEach(child => { res += child.toMarkdown(); });
    return res;
  }
}

export class ElementNode extends Node {
  constructor(public tag: string, public isBound: boolean, public attributes: any) { super(); }

  public toMarkdown(): string {
    var start: string = '', end: string = '';
    switch (this.tag) {
      case 'bold': start = end = '**'; break;
      case 'italic': start = end = '*'; break;
      case 'header1': start = end = '#'; break;
      case 'header2': start = end = '##'; break;
      case 'header3': start = end = '###'; break;
      case 'header4': start = end = '####'; break;
      case 'header5': start = end = '#####'; break;
      case 'header6': start = end = '######'; break;
      case 'md-link': start = '['; end = '](' + this.attributes.url + ')'; break;
    }
    var res = start;
    this.children.forEach(child => {
      res += child.toMarkdown();
    });
    res += end;
    return res;
  }
}

export class TextNode extends Node {
  constructor(public value: string,  public isBound: boolean) { super(); }

  public toMarkdown(): string { return this.value; }
}

export class AnchorNode extends Node {
  constructor() { super(); }

  public toMarkdown(): string { return ''; }
}