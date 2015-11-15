export abstract class Adapter {
  init(selector: string): void {}
  print(richText: string): void {}
}

export class DefaultAdapter extends Adapter {

  init(selector: string) {}

  print(richText: string) {
    console.log(richText);
  }
}