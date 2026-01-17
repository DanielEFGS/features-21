export interface NamedApiResource {
  name: string;
  url: string;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonList {
  items: PokemonListItem[];
  total: number;
}

export interface PokemonType {
  name: string;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
  slot: number;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonSprite {
  label: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  baseExperience: number;
  height: number;
  weight: number;
  isDefault: boolean;
  order: number;
  spriteUrl: string | null;
  artworkUrl: string | null;
  sprites: PokemonSprite[];
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
}

export interface TypeListItem {
  name: string;
  url: string;
}
