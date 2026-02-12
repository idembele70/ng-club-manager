export class StringUtility {
  static extractNumberFromText(text: string): number {
    const match = text.match(/\d+/);
    return match?.length ? Number(match[0]) : 0;
  };
}