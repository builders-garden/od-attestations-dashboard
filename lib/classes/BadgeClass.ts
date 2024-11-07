class Badge {
  index: number;
  image: string;
  title: string;
  description: string;
  unlocked: boolean;

  constructor(
    index: number,
    image: string,
    title: string,
    unlocked: boolean = true,
    description: string,
  ) {
    this.index = index;
    this.image = image;
    this.title = title;
    this.unlocked = unlocked;
    this.description = description;
  }

  getBadgeInfo() {
    return {
      index: this.index,
      image: this.image,
      title: this.title,
      description: this.description,
      unlocked: this.unlocked,
    };
  }
}

export default Badge;
