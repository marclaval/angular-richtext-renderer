export abstract class Printer {
  init(selector: string): void {}
  print(richText: string): void {}
}

export class DefaultPrinter extends Printer {

  init(selector: string) {}

  print(richText: string) {
    console.log(richText);
  }
}