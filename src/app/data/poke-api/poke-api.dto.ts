export interface NamedApiResourceDto {
  name: string;
  url: string;
}

export interface PokemonListResponseDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResourceDto[];
}

export interface PokemonTypeEntryDto {
  slot: number;
  type: NamedApiResourceDto;
}

export interface PokemonAbilityEntryDto {
  is_hidden: boolean;
  slot: number;
  ability: NamedApiResourceDto;
}

export interface PokemonStatEntryDto {
  base_stat: number;
  effort: number;
  stat: NamedApiResourceDto;
}

export interface PokemonSpritesDto {
  back_default: string | null;
  back_shiny: string | null;
  front_default: string | null;
  front_shiny: string | null;
  other?: {
    home?: {
      front_default: string | null;
      front_shiny: string | null;
    };
    'official-artwork'?: {
      front_default: string | null;
      front_shiny?: string | null;
    };
    showdown?: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

export interface PokemonDto {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  is_default: boolean;
  order: number;
  sprites: PokemonSpritesDto;
  types: PokemonTypeEntryDto[];
  abilities: PokemonAbilityEntryDto[];
  stats: PokemonStatEntryDto[];
}

export interface TypeListResponseDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResourceDto[];
}

export interface TypePokemonEntryDto {
  slot: number;
  pokemon: NamedApiResourceDto;
}

export interface TypeDetailResponseDto {
  id: number;
  name: string;
  pokemon: TypePokemonEntryDto[];
}
