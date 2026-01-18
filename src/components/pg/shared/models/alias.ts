class FromAlias {
  public id?: string;
  public name?: string;
}

export class Alias {

  public id: string;
  public name: string;
  public match: boolean = false;

  constructor (
    id?: string,
    name?: string
  ) {
    if (id !== undefined) {
      this.id = id;
    }
    if (name !== undefined) {
      this.name = name;
    }
  }

  from(alias: FromAlias): Alias {
    if (alias.id !== undefined) {
      this.id = alias.id;
    }
    if (alias.name !== undefined) {
      this.name = alias.name;
    }
    return this;
  }

  to() {
    return {
      name: this.name
    };
  }

}