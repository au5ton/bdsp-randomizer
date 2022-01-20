
// https://pokeapi.co/api/v2/pokedex/1/

export interface Pokemon {
  name: string;
  imageUrl: string;
}

export interface Member extends Pokemon {
  uuid: string;
  nickname?: string;
}

export async function getPokemon(): Promise<Pokemon[]> {
  const res = await fetch('https://pokeapi.co/api/v2/pokedex/1/');
  const data = await res.json();
  return data.pokemon_entries.map((e: any) => ({
    name: e.pokemon_species.name,
    imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${e.entry_number}.png`
  }));
}

// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle(array: any[]) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}