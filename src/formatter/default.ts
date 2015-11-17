import {Node, ComponentNode, ElementNode, TextNode, AnchorNode} from '../node';

export abstract class Formatter {

  public format(node: Node): string {
    if (node instanceof ComponentNode) {
      return this.formatComponent(node);
    } else if (node instanceof ElementNode) {
      return this.formatElement(node);
    } else if (node instanceof TextNode) {
      return this.formatText(node);
    } else if (node instanceof AnchorNode) {
      return this.formatAnchor(node);
    }
  }

  private formatComponent(node: ComponentNode): string {return null;}
  private formatElement(node: ElementNode): string {return null;}
  private formatText(node: TextNode): string {return null;}
  private formatAnchor(node: AnchorNode): string {return null;}
}

export class DefaultFormatter extends Formatter {
  private formatComponent(node: ComponentNode): string {
    var res = '';
    node.children.forEach(child => { res += this.format(child); });
    return res;
  }

  private formatElement(node: ElementNode): string {
    var res = `((${node.tag}))`;
    node.children.forEach(child => { res += this.format(child); });
    res += `((/${node.tag}))`;
    return res;
  }

  private formatText(node: TextNode): string {
    return node.value;
  }

  private formatAnchor(node: AnchorNode): string {
    return '';
  }
}