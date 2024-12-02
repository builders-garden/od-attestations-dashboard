class Badge {
  image: string;
  title: string;
  description: string;
  unlocked: boolean;
  attestationUID: string;
  timeCreated: number;
  details: { name: string; value: string }[];

  constructor(
    image: string,
    title: string,
    unlocked: boolean = true,
    description: string,
    attestationUID: string,
    timeCreated: number,
    details: { name: string; value: string }[],
  ) {
    this.image = image;
    this.title = title;
    this.unlocked = unlocked;
    this.description = description;
    this.attestationUID = attestationUID;
    this.timeCreated = timeCreated;
    this.details = details;
  }

  getBadgeInfo() {
    return {
      image: this.image,
      title: this.title,
      description: this.description,
      unlocked: this.unlocked,
      attestationUID: this.attestationUID,
      timeCreated: this.timeCreated,
      details: this.details,
    };
  }
}

export default Badge;
