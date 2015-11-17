import {Formatter} from './default';
import {Node, ComponentNode, ElementNode, TextNode, AnchorNode} from '../node';

export class MarkdownFormatter extends Formatter {
  formatComponent(node: ComponentNode): string {
    var res = '';
    node.children.forEach(child => { res += this.format(child); });
    return res;
  }

  formatElement(node: ElementNode): string {
    var start: string = '', end: string = '';
    switch (node.tag) {
      case 'bold': start = end = '**'; break;
      case 'italic': start = end = '*'; break;
      case 'header1': start = end = '#'; break;
      case 'header2': start = end = '##'; break;
      case 'header3': start = end = '###'; break;
      case 'header4': start = end = '####'; break;
      case 'header5': start = end = '#####'; break;
      case 'header6': start = end = '######'; break;
      case 'md-link': start = '['; end = '](' + node.getAttribute('url') + ')'; break;
    }
    var res = start;
    node.children.forEach(child => {
      res += this.format(child);
    });
    res += end;
    return res;
  }

  formatText(node: TextNode): string {
    return node.value;
  }

  formatAnchor(node: AnchorNode): string {
    return '';
  }
}