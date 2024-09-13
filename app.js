document.addEventListener("DOMContentLoaded", () => {
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

  let pokeTeam = [];
  const pokedex = document.getElementById("pokedex");
  const loadMoreButton = document.getElementById("load-more");
  let selectedPokemon =
    JSON.parse(localStorage.getItem("selectedPokemon")) || [];

  if (!pokedex) {
    console.error("POKEDEX ELEMENT NOT FOUND");
    return;
  }

  let allPokemon = [];
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
      allPokemon = allPokemon.concat(pokemon);
      displayPokemon(allPokemon);
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
        const isSelected = selectedPokemon.some(
          (p) => p.id === singlePokemon.id
        );
        const selectButtonText = isSelected ? "Deselect" : "Select";

        return `
        <div class="pokemon-icon" data-id="${singlePokemon.id}" onclick="location.href='pokeinfo.html?id=${singlePokemon.id}'">
          <img class="pic" src="${singlePokemon.image}" />
          <div class="info">
            <div class="order">${singlePokemon.id}</div>
            <div class="txt">${singlePokemon.name}</div>
          </div>
          <div class="type-container">${typePills}</div>
          <button class="select-button">${selectButtonText}</button>
        </div>`;
      })
      .join("");

    pokedex.innerHTML = pokemonString;
    document.querySelectorAll(".select-button").forEach((button) => {
      button.addEventListener("contextmenu", handleSelectClick);
    });
  };

  const handleSelectClick = (event) => {
    event.preventDefault();
    const pokemonId = parseInt(event.target.parentElement.dataset.id);
    const pokemon = allPokemon.find((p) => p.id === pokemonId);

    if (!pokemon) return;

    const isAlreadySelected = selectedPokemon.some((p) => p.id === pokemon.id);

    if (isAlreadySelected) {
      selectedPokemon = selectedPokemon.filter((p) => p.id !== pokemon.id);
      event.target.textContent = "Select";
    } else {
      if (selectedPokemon.length < 5) {
        selectedPokemon.push(pokemon);
        event.target.textContent = "Deselect";
      }
    }

    localStorage.setItem("selectedPokemon", JSON.stringify(selectedPokemon));

    console.log("Selected Pokémon:", selectedPokemon); // Debugging line

    displaySelectedPokemon();
  };

  const displaySelectedPokemon = () => {
    const poketeamDiv = document.getElementById("poketeam");
    if (!poketeamDiv) return;

    poketeamDiv.innerHTML = "";
    selectedPokemon.forEach((pokemon) => {
      const selectedDiv = document.createElement("div");
      selectedDiv.className = "selected-pokemon";

      const img = document.createElement("img");
      img.src = pokemon.image;
      img.alt = pokemon.name;
      img.className = "pokemon-image";

      const nameDiv = document.createElement("div");
      nameDiv.textContent = pokemon.name;

      selectedDiv.appendChild(img);
      selectedDiv.appendChild(nameDiv);

      poketeamDiv.appendChild(selectedDiv);
    });
  };

  const updatePokeTeamDisplay = () => {
    const poketeamDiv = document.getElementById("poketeam");
    if (!poketeamDiv) return;

    poketeamDiv.innerHTML = ""; // Clear existing content

    pokeTeam.forEach((pokemon) => {
      const imgElement = document.createElement("img");
      imgElement.src = pokemon.image;
      imgElement.alt = pokemon.name;
      imgElement.className = "pokemon-image";

      poketeamDiv.appendChild(imgElement);
    });
  };

  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", function () {
      let promises = [];
      for (
        let i = lastPokemonId + 1;
        i <= lastPokemonId + loadMorePokemons;
        i++
      ) {
        promises.push(
          fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then((res) =>
            res.json()
          )
        );
      }

      Promise.all(promises).then((result) => {
        const pokemon = result.map((data) => ({
          id: data.id,
          name: data.name,
          image: data.sprites.front_default,
          types: data.types.map((typeInfo) => typeInfo.type.name),
        }));
        allPokemon = allPokemon.concat(pokemon);
        displayPokemon(allPokemon);
        lastPokemonId += loadMorePokemons;
      });
    });
  }

  getPokemon();
});
