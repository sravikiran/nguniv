import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// Import objects for state transfer
import { TransferState, makeStateKey } from "@angular/platform-browser";

import { Pokemon } from "./pokemon";

// Create keys for every state
const POKEMONS_KEY = makeStateKey("pokemons");
const POKEMON_DETAILS_KEY = makeStateKey("pokemon_details");

@Injectable({
  providedIn: "root"
})
export class PokemonService {
  private baseUrl: string = "https://pokeapi.co/api/v2";

  constructor(private http: HttpClient,
     private state: TransferState
    ) {}

  listPokemons() {
    // Get the state object
    let pokemons = this.state.get(POKEMONS_KEY, null);
    // Resolve the object, if it exists
    if (pokemons) {
      return Promise.resolve(pokemons);
    }

    // Otherwise make the API call
    return this.http
      .get(`${this.baseUrl}/pokedex/1/`)
      .toPromise()
      .then((res: any) => {
        let pokemons: Pokemon[] = [];
        let reducedPokemonEntries = res.pokemon_entries.splice(0, 50);

        reducedPokemonEntries.forEach(entry => {
          let pokemon = new Pokemon();
          pokemon.name = entry.pokemon_species.name;
          pokemon.id = entry.entry_number;
          pokemon.imageurl = `https://rawgit.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

          pokemons.push(pokemon);
        });
        // Set value to state
        this.state.set(POKEMONS_KEY, pokemons);
        return pokemons;
      });
  }

  getDetails(id: number) {
    let pokemonDetails: Pokemon = this.state.get(
      POKEMON_DETAILS_KEY,
      null
    );
    if (pokemonDetails && pokemonDetails.id === id) {
      return Promise.resolve(pokemonDetails);
    }

    return this.http
      .get(`${this.baseUrl}/pokemon/${id}/`)
      .toPromise()
      .then((res: any) => {
        let response = res;
        let pokemon = new Pokemon();
        pokemon.name = response.name;
        pokemon.id = response.id;
        pokemon.imageurl = `https://rawgit.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

        response.types.forEach(type => {
          pokemon.types.push(type.type.name);
        });

        response.stats.forEach(stat => {
          pokemon.stats.push({
            name: stat.stat.name,
            value: stat.base_stat
          });
        });

        for (let sprite in response.sprites) {
          if (response.sprites[sprite]) {
            pokemon.sprites.push({
              name: sprite,
              imagePath: response.sprites[sprite]
            });
          }
        }

        this.state.set(POKEMON_DETAILS_KEY, pokemon);
        return pokemon;
      });
  }
}
