import Dexie from 'dexie';

export class Database extends Dexie {
  hashes: Dexie.Table<HashTable, string>;
  icons: Dexie.Table<IconTable, string>;

  constructor() {
    super("IconCache");

    this.version(1).stores({
      hashes: '&id, hash',
      icons: '&id, idFull, fontId, name, data, aliases, tags, codepoint'
    });

    this.hashes = this.table("hashes");
    this.icons = this.table("icons");
  }
}

export interface HashTable {
  id: string,
  hash: string
}

export interface IconTable {
  id: string,
  idFull: string,
  fontId: string,
  codepoint: string,
  name: string,
  data: string,
  version: string,
  aliases: any,
  tags: any
}
