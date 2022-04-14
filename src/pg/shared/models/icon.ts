import { Alias } from "./alias";
import { User } from "./user";
import { Tag } from "./tag";
import { Style } from "./style";
import { FontIcon } from "./fontIcon";

export class Icon {

  public id: string | null = null;
  public packageId: string | null = null
  public baseIconId: string | null = null;
  public name: string | null = null;
  public description: string | null = null;
  public data: string | null = null;
  public user: User | null = null;
  public version: string | null = null;
  public aliases: Alias[] = [];
  public tags: Tag[] = [];
  public styles: Style[] = [];
  public published: boolean = true;
  public deprecated: boolean = false;
  public codepoint: string | null = null;
  public fontIcons: FontIcon[] = [];
  public fontIcon: any = null;

  constructor(name?: string, data?: string) {
    this.name = name || null;
    this.data = data || null;
  }

  from(icon: Icon): Icon {
    this.id = icon.id;
    this.packageId = icon.packageId;
    this.baseIconId = icon.baseIconId;
    this.name = icon.name;
    this.description = icon.description;
    this.data = icon.data;
    if (icon.version) {
      this.version = icon.version;
    }
    if (icon.fontIcon) {
      this.fontIcon = icon.fontIcon;
    }
    if (icon.user) {
      this.user = new User().from(icon.user);
    }
    if (icon.aliases) {
      this.aliases = icon.aliases.map(a => new Alias().from(a));
    }
    if (icon.tags) {
      this.tags = icon.tags.map(t => new Tag().from(t));
    }
    if (icon.styles) {
      this.styles = icon.styles.map(s => new Style().from(s));
    }
    if (typeof icon.published === 'boolean') {
      this.published = icon.published;
    }
    if (typeof icon.deprecated === 'boolean') {
      this.deprecated = icon.deprecated;
    }
    if (icon.codepoint) {
      this.codepoint = icon.codepoint;
    }
    if (icon.fontIcons) {
      this.fontIcons = icon.fontIcons.map(t => new FontIcon().from(t));
    }
    return this;
  }

  to() {
    const {
      id,
      name,
      description,
      data,
      version,
      fontIcon,
      packageId,
      baseIconId,
      aliases,
      tags
    } = this;
    return {
      id,
      name,
      description,
      data,
      version,
      fontIcon,
      packageId,
      baseIconId,
      aliases: aliases.map(alias => alias.to()),
      tags: tags.map(tag => tag.to())
    }
  }
}