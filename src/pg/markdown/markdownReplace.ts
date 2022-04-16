export class MarkdownReplace {
  constructor(
    public find: RegExp,
    public replace: (substring: string, ...args: any[]) => string,
    public render?: (template: HTMLElement) => void
  ) { }
}