import { Icon } from './icon';
import { User } from './user';
import { ModificationType } from './../enums/modificationType';

export class Modification {

  public id: string;
  public modificationId: ModificationType;
  public packageId: string;
  public user: User;
  public icon: Icon;
  public iconNameBefore: string;
  public iconNameAfter: string;
  public iconDescriptionBefore: string;
  public iconDescriptionAfter: string;
  public iconDataBefore: string;
  public iconDataAfter: string;
  public text: string;
  public date: Date;
  public issue: number;
  public isVisible: boolean;

  constructor (
  ) { }

  from(modification: Modification): Modification {
    this.id = modification.id;
    this.modificationId = modification.modificationId;
    this.packageId = modification.packageId;
    this.user = new User().from(modification.user);
    this.icon = new Icon().from(modification.icon);
    this.iconNameBefore = modification.iconNameBefore;
    this.iconNameAfter = modification.iconNameAfter;
    this.iconDescriptionBefore = modification.iconDescriptionBefore;
    this.iconDescriptionAfter = modification.iconDescriptionAfter;
    this.iconDataBefore = modification.iconDataBefore;
    this.iconDataAfter = modification.iconDataAfter;
    this.text = modification.text;
    this.date = modification.date;
    this.issue = modification.issue;
    this.isVisible = modification.isVisible;
    return this;
  }

}