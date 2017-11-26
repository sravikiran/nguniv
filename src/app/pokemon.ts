export class Pokemon {
  name: string;
  id: number;
  types = [];
  stats = [];
  sprites: Sprite[] = [];
  imageurl: string;
  
  get imageUrl() {
    return `https://rawgit.com/PokeAPI/sprites/master/sprites/pokemon/${this.id}.png`;
  }
}

export class Sprite {
  name: string;
  imagePath: string;
}