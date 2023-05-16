export class Week {
  constructor(id, theme) {
    this.id = id;
    this.theme = theme;
  }

  static fromNotion(record) {
    return new Week(
      record.id,
      record.properties['Theme'].title[0].plain_text,
    );
  }

  toString() {
    return `${this.theme}`;
  }
}
