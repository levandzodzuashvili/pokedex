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

let allPokemon = []; // Array to store all loaded Pokémon ამას გამოიყენებ რო შეინახო ერეიში ყველა ელემენტი
let lastPokemonId = 50;
const loadMorePokemons = 10;

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
    allPokemon = allPokemon.concat(pokemon); // Add new Pokémon to allPokemon array კონკატი გინდა იმისთვის რო გააერთიანოს ახალი დატა რაც მიიღებს პრომისესიდან
    displayPokemon(allPokemon); // ამას გამოიყენებ რო დაარენდერო ყველა პოკემონი
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
        <div class="pokemon-icon" data-id="${singlePokemon.id}" onclick="location.href='pokeinfo.html?id=${singlePokemon.id}'">
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
    allPokemon = allPokemon.concat(pokemon); //  აქედან დაამატებ ახალ პოკემონებს ყველა პოკემონის მასივში
    displayPokemon(allPokemon); // ამას გამოიყენებ რო დაარენდერო ყველა პოკემონი
    lastPokemonId += loadMorePokemons;
  });
});

getPokemon();

document.querySelectorAll(".pokemon-icon").forEach((icon) => {
  icon.addEventListener("click", async function () {
    const pokemonId = this.getAttribute("data-id");
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    const pokeInfo = await response.json();

    const pokeKey = pokeInfo.id;
    const pokeImg = pokeInfo.data.sprites.front_default;
    const pokeName = pokeInfo.name;
    const pokeAbilities = pokeInfo.abilities;
    const pokeBaseExp = pokeInfo.base_experience
      .map((ability) => ability.ability.name)
      .join(", ");
    const pokeHight = pokeInfo.height;
    const pokeWeight = pokeInfo.weight;
    const pokeForms = pokeInfo.forms.map((form) => form.name).join(", ");
    const pokeItems = pokeInfo.held_items
      .map((item) => item.item.name)
      .join(", ");
    const pokeStats = pokeInfo.stats
      .map((stat) => `${stat.stat.name}: ${stat.base_stat}`)
      .join(", ");
    const pokeTypes = pokeInfo.types.map((type) => type.type.name).join(", ");

    const pokeValue = `
      <div class="about-poke" href="pokeinfo.html">
        <img class="image" src="${pokeImg}" />
        <div class="nomeri">ID: ${pokeKey}</div>
        <div class="saxeli">Name: ${pokeName}</div>
        <div class="abilki">Abilities: ${pokeAbilities}</div>
        <div class="exp">Base Experience: ${pokeBaseExp}</div>
        <div class="simagle">Height: ${pokeHight}</div>
        <div class="weight">Weight: ${pokeWeight}</div>
        <div class="forms">Forms: ${pokeForms}</div>
        <div class="Items">Items: ${pokeItems}</div>
        <div class="stats">Stats: ${pokeStats}</div>
        <div class="types">Types: ${pokeTypes}</div>
      </div>
    `;

    localStorage.setItem(pokeKey, pokeValue);
    window.location.href = `pokeinfo.html?id=${pokeKey}`;
    displayPokemon(pokeValue);
  });
});
