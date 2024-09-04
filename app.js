const colors = {
  fire: "#FDDFDF",
  grass: "#DEFDE0",
  electric: "#FCF7DE",
  water: "#DEF3FD",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#98d7a5",
  bug: "#f8d5a3",
  dragon: "#97b3e6",
  psychic: "#eaeda1",
  flying: "#F5F5F5",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
};

const pokedex = document.getElementById("pokedex");

const loadMoreButton = document.getElementById("load-more");

const getPokemon = () => {
  let promises = [];
  for (let i = 1; i <= 50; i++) {
    const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    promises.push(fetch(url).then((res) => res.json()));
  }
  Promise.all(promises).then((result) => {
    const pokemon = result.map((data) => ({
      id: data.id,
      name: data.name,
      image: data.sprites["front_default"],
      types: data.types.map((typeInfo) => typeInfo.type.name),
    }));
    displayPokemon(pokemon);
  });
};

const displayPokemon = (pokemon) => {
  const pokemonString = pokemon
    .map((singlePokemon) => {
      const typePills = singlePokemon.types
        .map(
          (type) =>
            `<a href="#" class="pill" style="background-color:${
              colors[type] || "#FFFFFF"
            }">${type}</a>`
        )
        .join("");

      return `
        <div class="pokemon-icon">
          <img class="pic" src="${singlePokemon.image}" />
          <div class="info">
          <div class="order">${singlePokemon.id}</div>
          <div class="txt">${singlePokemon.name}</div>
          </div>
          <div class="type-container">${typePills}</div>
        </div>`;
    })
    .join("");
  pokedex.innerHTML = pokemonString;
};

getPokemon();

let lastPokemonId = 50;
const loadMorePokemons = 10;

loadMoreButton.addEventListener("click", function () {
  let promises = [];

  for (let i = lastPokemonId + 1; i <= lastPokemonId + loadMorePokemons; i++) {
    promises.push(
      fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then((res) => res.json())
    );
  }

  Promise.all(promises).then((result) => {
    const pokemon = result.map((data) => ({
      id: data.id,
      name: data.name,
      image: data.sprites.front_default,
      types: data.types.map((typeInfo) => typeInfo.type.name),
    }));
    displayPokemon(pokemon);
    lastPokemonId += loadMorePokemons;
  });
});
