export class FontIconVersion {
  public major: number;
  public minor: number;
  public patch: number;

  from(version: FontIconVersion): FontIconVersion {
    this.major = version.major;
    this.minor = version.minor;
    this.patch = version.patch;
    return this;
  }

  to() {
    return {
      major: this.major,
      minor: this.minor,
      patch: this.patch
    }
  }
}