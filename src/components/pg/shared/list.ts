export function list($list: HTMLElement, items: any[], key, add, update) {
  const elements = Array.from($list.children) as HTMLElement[];
  const current = elements.map((e: HTMLElement) => e.dataset.key);
  const itemKeys = items.map(x => x[key]);
  items.forEach(item => {
    if (current.includes(item[key])) {
      const element = elements.find((e: HTMLElement) => e.dataset.key === current[key]);
      if (item[key] === current[key]) {
        update(item, element);
        return;
      }
    } else {
      const newItem = add(item);
      if (newItem instanceof DocumentFragment) {
        (newItem.children[0] as any).dataset.key = item[key];
      } else {
        newItem.dataset.key = item[key];
      }
      $list.appendChild(newItem);
      return;
    }
  });
  elements.forEach(element => {
    if (!itemKeys.includes(element.dataset.key)) {
      element.remove();
    }
  });
}

export function item<T>($list: HTMLElement, item: any[], key: string): T {
  const elements = Array.from($list.children);
  const ele = elements.find((e: HTMLElement) => e.dataset.key === item[key]);
  return ele as any;
}