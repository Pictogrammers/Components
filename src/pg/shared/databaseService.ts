import { Database, IconTable } from './database';
import { http } from './http';

import { Icon } from './models/icon';
import { Font } from './models/font';
import { Alias } from './models/alias';
import { Tag } from './models/tag';

interface StringMap {
  [key: string]: string;
}

export class DatabaseService {

  private db = new Database();

  /**
   * Get list of hashes for icons in font
   *
   * @param font Font id to lookup hashes for
   */
  private async getHashesFromServer(font: Font): Promise<StringMap> {
    const res = await http.get<StringMap>(`/api/font/${font.id}/hash`);
    return res;
  }

  private async getIconsFromServer(font: Font, ids: string[]): Promise<Icon[]> {
    if (ids.length === 0) {
      return [];
    }
    const res = await http.get<Icon[]>(`/api/font/${font.id}`, {
      params: {
        ids: ids.join(',')
      }
    });
    return res.map(icon => new Icon().from(icon));
  }

  private async getIconsByPage(font: Font, page: number, size: number) {
    const res = await http.get<Icon[]>(`/api/font/${font.id}`, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
    return res.map(icon => new Icon().from(icon));
  }

  async asyncThrottledMap<T, U>(maxCount: number, array: T[], f: (x: T) => Promise<U>) {
    let inFlight = new Set<Promise<U>>();
    const result: Promise<U>[] = [];

    // Sequentially add a Promise for each operation.
    for (let elem of array) {

        // Wait for any one of the promises to complete if there are too many running.
        if (inFlight.size >= maxCount) {
            await Promise.race(inFlight);
        }

        // This is the Promise that the user originally passed us back.
        const origPromise = f(elem);
        // This is a Promise that adds/removes from the set of in-flight promises.
        const handledPromise = wrap(origPromise);
        result.push(handledPromise);
    }

    return Promise.all(result);

    async function wrap(p: Promise<U>) {
        inFlight.add(p);
        const result = await p;
        inFlight.delete(p);
        return result;
    }
  }

  async exists(fontId: string) {
    const count = await this.getCount(fontId);
    return count > 0;
  }

  async resync(fontId: string) {
    let modified = false;
    const font = new Font().from({
      id: fontId
    } as Font);
    const hashes = await this.getHashesFromServer(font);
    const hashIds = Object.keys(hashes);
    const localHashObj = await this.db.hashes.toArray();
    const localHashes = {};
    localHashObj.forEach((item) => {
      localHashes[item.id] = item.hash;
    });
    const localHashIds = Object.keys(localHashes);
    const modifiedIds: string[] = [];
    hashIds.forEach((id) => {
      if (!(id in localHashes) || localHashes[id] !== hashes[id]) {
        modifiedIds.push(id);
      }
    });
    const removeIds: string[] = [];
    localHashIds.forEach((id) => {
      if (!(id in hashes)) {
        removeIds.push(id);
      }
    });
    await this.db.icons.bulkDelete(removeIds);
    if (modifiedIds.length > 0 || removeIds.length > 0) {
      modified = true;
    }
    if (modifiedIds.length < 500) {
      // Do a partial update patch of data
      let i, j, chunkIds: any[] = [], chunk = 100;
      for (i = 0, j = modifiedIds.length; i < j; i += chunk) {
        chunkIds.push(modifiedIds.slice(i, i + chunk));
      }
      const chunkPromises = chunkIds.map((ids) => {
        return this.getIconsFromServer(font, ids);
      });
      const results = await Promise.all(chunkPromises);
      results.forEach(icons => {
        this.db.icons.bulkPut(
          icons.map(icon => ({
            id: icon.fontIcon.id,
            idFull: icon.id  as string,
            fontId: font.id as string,
            name: icon.name as string,
            data: icon.data as string as string,
            version: icon.version as string,
            codepoint: icon.codepoint as string,
            aliases: icon.aliases,
            tags: icon.tags
          })
        ));
      });
    } else if (modifiedIds.length !== 0) {
      // Sync every icon into the database
      let size = 500,
        pages = Math.ceil(hashIds.length / size),
        chunkPromises: Promise<Icon[]>[] = [];
      for (let page = 1; page <= pages; page++) {
        chunkPromises.push(
          this.getIconsByPage(font, page, size)
        );
      }
      await this.asyncThrottledMap<Promise<Icon[]>, void>(2, chunkPromises, (p) =>
        p.then(icons => {
          this.db.icons.bulkPut(
            icons.map(icon => ({
              id: icon.fontIcon.id,
              idFull: icon.id as string,
              fontId: font.id as string,
              name: icon.name as string,
              data: icon.data as string,
              version: icon.version as string,
              codepoint: icon.codepoint as string,
              aliases: JSON.stringify(icon.aliases.map(alias => ({ name: alias.name }))),
              tags: JSON.stringify(icon.tags.map(tag => ({ name: tag.name, url: tag.url})))
            })
          ));
        })
      );
    }
    if (modified) {
      await this.db.hashes.bulkPut(hashIds.map(id => ({ id, hash: hashes[id] })));
      await this.db.hashes.bulkDelete(removeIds);
    }
    return modified;
  }

  synced = false;

  async sync(fontId: string) {
    if (!this.synced) {
      const modified = await this.resync(fontId);
      this.synced = true;
      return modified;
    }
    return false;
  }

  convert(local: IconTable) {
    const icon = new Icon();
    icon.id = local.idFull;
    icon.name = local.name;
    icon.data = local.data;
    icon.version = local.version;
    icon.codepoint = local.codepoint;
    const aliases = local.aliases instanceof Array ? local.aliases : JSON.parse(local.aliases);
    icon.aliases = aliases.map(alias => new Alias().from(alias));
    const tags = local.tags instanceof Array ? local.tags : JSON.parse(local.tags);
    icon.tags = tags.map(tag => new Tag().from(tag));
    return icon;
  }

  async getIconByName(name) {
    const local = await this.db.icons.where('name').equals(name).first();
    if (!local) {
      return null;
    }
    return this.convert(local);
  }

  // ToDo, cache into a format that can be parsed quicker for search

  async getIcons(fontId: string, term?: string) {
    let icons;
    if (term) {
      const safeTerm = term.toLowerCase().replace(/[^a-z0-9-]/g, '');
      const reg = new RegExp(`${safeTerm}`);
      icons = await this.db.icons.where('fontId').equals(fontId)
        .filter((icon) => {
          return icon.name.match(reg) !== null;
        }).sortBy('name');
    } else {
      icons = await this.db.icons.where('fontId').equals(fontId).sortBy('name');
    }
    return icons.map(icon => this.convert(icon));
  }

  async getCount(fontId: string) {
    return await this.db.icons.where('fontId').equals(fontId).count();
  }

  async delete() {
    await this.db.delete();
  }

}