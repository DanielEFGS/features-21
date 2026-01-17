import {
  NamedApiResourceDto,
  PokemonDto,
  PokemonListResponseDto,
  TypeDetailResponseDto,
  TypeListResponseDto
} from './poke-api.dto';
import {
  NamedApiResource,
  Pokemon,
  PokemonList,
  PokemonListItem,
  PokemonSprite,
  PokemonType,
  TypeListItem
} from './poke-api.models';

/**
 * Maps a named API resource DTO to the domain model.
 *
 * @param dto - API resource DTO.
 * @returns Domain resource model.
 */
export function mapNamedResource(dto: NamedApiResourceDto): NamedApiResource {
  return {
    name: dto.name,
    url: dto.url
  };
}

/**
 * Maps the Pokemon list response to domain list model.
 *
 * @param response - List response DTO.
 * @returns Pokemon list model.
 */
export function mapPokemonList(response: PokemonListResponseDto): PokemonList {
  return {
    items: response.results.map((item) => ({
      name: item.name,
      url: item.url
    })),
    total: response.count
  };
}

/**
 * Maps the type list response to domain list items.
 *
 * @param response - Type list response DTO.
 * @returns Type list items.
 */
export function mapTypeList(response: TypeListResponseDto): TypeListItem[] {
  return response.results.map((item) => ({
    name: item.name,
    url: item.url
  }));
}

/**
 * Maps the type detail response to a list of Pokemon list items.
 *
 * @param response - Type detail response DTO.
 * @returns Pokemon list items for the type.
 */
export function mapTypeDetail(response: TypeDetailResponseDto): PokemonListItem[] {
  return response.pokemon.map((entry) => ({
    name: entry.pokemon.name,
    url: entry.pokemon.url
  }));
}

/**
 * Maps Pokemon detail DTO to domain model.
 *
 * @param dto - Pokemon detail DTO.
 * @returns Pokemon domain model.
 */
export function mapPokemon(dto: PokemonDto): Pokemon {
  const sprites = buildPokemonSprites(dto);

  return {
    id: dto.id,
    name: dto.name,
    baseExperience: dto.base_experience,
    height: dto.height,
    weight: dto.weight,
    isDefault: dto.is_default,
    order: dto.order,
    spriteUrl: dto.sprites.front_default ?? null,
    artworkUrl: dto.sprites.other?.['official-artwork']?.front_default ?? null,
    sprites,
    types: dto.types.map((entry) => mapPokemonType(entry.type.name)),
    abilities: dto.abilities.map((entry) => ({
      name: entry.ability.name,
      isHidden: entry.is_hidden,
      slot: entry.slot
    })),
    stats: dto.stats.map((entry) => ({
      name: entry.stat.name,
      value: entry.base_stat
    }))
  };
}

/**
 * Maps a type name to a PokemonType model.
 *
 * @param name - Type name.
 * @returns Pokemon type model.
 */
function mapPokemonType(name: string): PokemonType {
  return { name };
}

/**
 * Builds a curated list of sprite variants for detail views.
 *
 * @param dto - Pokemon DTO with sprite data.
 * @returns List of labeled sprite URLs.
 */
function buildPokemonSprites(dto: PokemonDto): PokemonSprite[] {
  const entries: Array<{ label: string; url: string | null | undefined }> = [
    { label: 'Front', url: dto.sprites.front_default },
    { label: 'Front shiny', url: dto.sprites.front_shiny },
    { label: 'Back', url: dto.sprites.back_default },
    { label: 'Back shiny', url: dto.sprites.back_shiny },
    { label: 'Artwork', url: dto.sprites.other?.['official-artwork']?.front_default },
    { label: 'Artwork shiny', url: dto.sprites.other?.['official-artwork']?.front_shiny },
    { label: 'Home', url: dto.sprites.other?.home?.front_default },
    { label: 'Home shiny', url: dto.sprites.other?.home?.front_shiny },
    { label: 'Showdown', url: dto.sprites.other?.showdown?.front_default },
    { label: 'Showdown shiny', url: dto.sprites.other?.showdown?.front_shiny }
  ];

  return entries
    .filter((entry): entry is { label: string; url: string } => Boolean(entry.url))
    .map((entry) => ({
      label: entry.label,
      url: entry.url
    }));
}
