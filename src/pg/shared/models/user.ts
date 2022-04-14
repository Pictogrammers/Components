export class User {

  public id: string | null = null;
  public github: string | null = null;
  public twitter: string | null = null;
  public name: string | null = null;
  public base64: string | null = null;
  public iconCount: number | null = null;
  public description: string | null = null;
  public website: string | null = null;
  public sponsored: boolean = false;
  public sponsorship: string = '';
  public core: boolean = false;

  from(user: User): User {
      this.id = user.id;
      this.github = user.github;
      this.twitter = user.twitter;
      this.name = user.name;
      if (typeof user.base64 === 'string') {
          if (user.base64.match(/^data/)) {
              this.base64 = user.base64;
          } else {
              this.base64 = `data:image/png;base64,${user.base64}`;
          }
      }
      this.iconCount = user.iconCount;
      this.description = user.description;
      this.website = user.website;
      this.sponsored = user.sponsored;
      this.sponsorship = `https://github.com/users/${user.github}/sponsorship`;
      this.core = user.core;
      return this;
  }
}