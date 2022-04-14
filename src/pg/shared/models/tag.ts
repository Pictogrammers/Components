class FromTag {
  public id?: string;
  public name?: string;
  public url?: string;
  public count?: number;
}

export class Tag {
  public id: string;
  public name: string;
  public url: string;
  public count: number;

  from(tag: FromTag): Tag {
    if (tag.id !== undefined) {
      this.id = tag.id;
    }
    if (tag.name !== undefined) {
      this.name = tag.name;
    }
    if (tag.url !== undefined) {
      this.url = tag.url;
    }
    if (tag.count !== undefined) {
      this.count = tag.count;
    }
    return this;
  }

  to() {
    return {
      name: this.name,
      url: this.url,
      count: this.count
    }
  }
}