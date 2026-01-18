import { Icon } from "./models/icon";
import { removeDiacritics } from "./removeDiacritics";
import { filter } from "./filter";


function exactMatch(icons: Icon[], term: string) {
  for(var i = 0, c = icons.length; i < c; i++) {
    if (icons[i].name?.toLowerCase() === term) {
      icons.unshift(icons.splice(i, 1)[0]);
      return icons;
    }
  }
  return icons;
}

export function sanitizeTerm(term: string) {
  return removeDiacritics(term.trim().toLowerCase()).replace(/(\w) (\w)/g, "$1-$2");
}

export function iconFilter(icons: Icon[], term: string, limit: number = 5): Icon[] {
  term = sanitizeTerm(term);
  const iconsByName = filter(
    icons,
    (icon: Icon) => {
      return icon.name?.toLowerCase().indexOf(term) === 0;
    },
    limit
  );
  const list = Array.from(iconsByName);
  let skip: string[] = list.map(icon => icon.id);
  if (list.length < limit) {
    var more = filter(
      icons,
      (icon) => {
        if (skip.includes(icon.id)) {
          return false;
        }
        return icon.name?.toLowerCase().indexOf(term) !== -1;
      },
      limit - list.length
    );
    var more2 = Array.from(more);
    more2.forEach(icon => list.push(icon));
  }
  skip = list.map(icon => icon.id);
  if (list.length < limit) {
    var iconsByAliases = filter(
      icons,
      (icon) => {
        if (skip.includes(icon.id)) {
          return false;
        }
        for(var i = 0, c = icon.aliases.length; i < c; i++) {
          if (icon.aliases[i].name == null) {
            console.error(`Invalid alias in ${icon.name}`);
            return false;
          }
          if (icon.aliases[i].name.indexOf(term) !== -1) {
            icon.aliases[i].match = true;
            return true;
          }
        }
        return false;
      },
      limit - list.length
    );
    const list2 = Array.from(iconsByAliases);
    list2.forEach(icon => list.push(icon));
  }
  return exactMatch(list, term);
}