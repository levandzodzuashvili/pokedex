// document.querySelectorAll(".pokemon-icon").forEach((icon) => {
//   icon.addEventListener("click", async function () {
//     const pokemonId = this.getAttribute("data-id");
//     const response = await fetch(
//       `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
//     );
//     const pokeInfo = await response.json();

//     const pokeKey = singlePokemon.id;
//     const pokeImg = pokeInfo.data.sprites.front_default;
//     const pokeName = pokeInfo.name;
//     const pokeAbilities = pokeInfo.abilities;
//     const pokeBaseExp = singlePokemon.base_experience
//       .map((ability) => ability.ability.name)
//       .join(", ");
//     const pokeBaseExp = singlePokemon.base_experience
//     const pokeHight = singlePokemon.height;
//     const pokeWeight = singlePokemon.weight;
//     const pokeForms = data.forms.map((form) => form.name).join(", ");
//     const pokeItems = data.held_items
//       .map((item) => item.item.name)
//       .join(", ");
//     const pokeStats = data.stats
//       .map((stat) => `${stat.stat.name}: ${stat.base_stat}`)
//       .join(", ");
//     const pokeTypes = data.types.map((type) => type.type.name).join(", ");

//     const pokeValue = `
//     <div class="about-poke" href="pokeinfo.html">
//       <img class="image" src="${pokeImg}" />
//       <div class="nomeri">ID: ${pokeKey}</div>
//       <div class="saxeli">Name: ${pokeName}</div>
//       <div class="abilki">Abilities: ${pokeAbilities}</div>
//       <div class="exp">Base Experience: ${pokeBaseExp}</div>
//       <div class="simagle">Height: ${pokeHight}</div>
//       <div class="weight">Weight: ${pokeWeight}</div>
//       <div class="forms">Forms: ${pokeForms}</div>
//       <div class="Items">Items: ${pokeItems}</div>
//       <div class="stats">Stats: ${pokeStats}</div>
//       <div class="types">Types: ${pokeTypes}</div>
//     </div>
//   `;

//     localStorage.setItem(pokeKey, pokeValue);
//     window.location.href = `pokeinfo.html?id=${pokeKey}`;
//   });
// });
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
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("id");
console.log(myParam);
const pokedex = document.getElementById("pokedex");
const getPokemon = () => {
  let promises = [];

  const url = `https://pokeapi.co/api/v2/pokemon/${myParam}`;
  promises.push(fetch(url).then((res) => res.json()));

  Promise.all(promises).then((result) => {
    const pokemon = result.map((data) => ({
      id: data.id,
      name: data.name,
      image: data.sprites["front_default"],
      types: data.types.map((typeInfo) => typeInfo.type.name),
      abilities: data.abilities
        .map((ability) => ability.ability.name)
        .join(", "),
      base_experience: data.base_experience,
      height: data.height,
      weight: data.weight,
      forms: data.forms.map((form) => form.name).join(", "),
      held_items: data.held_items.map((item) => item.item.name).join(", "),
      stats: data.stats
        .map((stat) => `${stat.stat.name}: ${stat.base_stat}`)
        .join(", "),
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
      <div class="pokemon-icon" data-id="${singlePokemon.id}" onclick="location.href='pokeinfo.html?id=${singlePokemon.id}'">
        <img class="pic" src="${singlePokemon.image}" />
        <div class="info">
        <div class="order">${singlePokemon.id}</div>
        <div class="txt">${singlePokemon.name}</div>
        <div class="abilki">${singlePokemon.abilities}</div>
        <div class="exp">${singlePokemon.base_experience}</div>
        <div class="simagle">${singlePokemon.height}</div>
        <div class="weight">${singlePokemon.weight}</div>
        <div class="forms">${singlePokemon.forms}</div>
        <div class="held-items">${singlePokemon.held_items}</div>
        <div class="stats">${singlePokemon.stats}</div>
        </div>
        <div class="type-container">${typePills}</div>
      </div>`;
    })
    .join("");
  pokedex.innerHTML = pokemonString;
};
getPokemon();
