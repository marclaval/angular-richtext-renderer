import {Formatter} from './default';
import {ElementNode, TextNode, AnchorNode} from '../node';

export class MarkdownFormatter extends Formatter {
  private _headerAlign: Array<string> = [];

  formatElement(node: ElementNode): string {
    var start: string = '', end: string = '';
    var res:string = '';
    switch (node.tag) {
      //Basics
      case 'header1': start = '# '; break;
      case 'header2': start = '## '; break;
      case 'header3': start = '### '; break;
      case 'header4': start = '#### '; break;
      case 'header5': start = '##### '; break;
      case 'header6': start = '###### '; break;
      case 'blockquote': start = '> '; break;
      case 'italic': start = end = '*'; break;
      case 'bold': start = end = '**'; break;
      case 'unordered': start = '* '; break;
      case 'ordered': start = (node.getAttribute('index') || 0) + '. '; break;
      case 'codeline': start = end = '`'; break;
      case 'codeblock': start = '```' + (node.getAttribute('language') || ''); end = '```'; break;
      case 'hyperlink': start = '['; end = '](' + node.getAttribute('url') + ')'; break;
      //Github flavored
      case 'strikethrough': start = end = '~~'; break;
      case 'task': start = '* [' + (node.getAttribute('completed') == 'yes' ? 'x' : ' ' ) + '] '; break;
      case 'header': this._headerAlign.push(node.getAttribute('align')); start = ' '; end = ' |'; break;
      case 'cell':
        if (this._headerAlign.length > 0) {
          for (var i = 0; i < this._headerAlign.length; i++) {
            var align = this._headerAlign[i];
            var left = align == 'left' || align == 'center';
            var right = align == 'right' || align == 'center';
            res += ` ${left ? ':' : ''}----${right ? ':' : ''} |`;
          }
          res += '\n';
          this._headerAlign = [];
        }
        start = ' '; end = ' |';
        break;
      default:
        start = `<${node.tag}`;
        if (node.attribs.size > 0) {
          node.attribs.forEach((value, key) => {
            if (key != 'data-ngid')
              start += ` ${key}="${value}"`;
          });
        }
        start += '>';
        end = `</${node.tag}>`;
        break;
    }
    res += start;
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