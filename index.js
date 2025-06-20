async function fetchData() {
    try {
      const inputName = document.getElementById("pokemonName").value.toLowerCase().trim();
      if (inputName == "niha") /*if you know you know*/{
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = "I love you so much ♡";
        errorMessage.style.color = "pink";
        return;
      }
      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${inputName}`);
      if (!speciesResponse.ok) throw new Error("Pokémon species not found");
  
      const speciesData = await speciesResponse.json();
      const allVarieties = speciesData.varieties;
      const defaultVariety = allVarieties.find(v => v.is_default);
      const baseResponse = await fetch(defaultVariety.pokemon.url);
      const baseData = await baseResponse.json();
      displayPokemon(baseData);
  
      const baseType = baseData.types[0].type.name;
      const formsContainer = document.getElementById("pokemonForms");
      formsContainer.innerHTML = "";
  
      const filteredForms = allVarieties.filter(v => !v.pokemon.name.includes("cap"));
  
      const pokemonBox = document.getElementById("pokemon");
      pokemonBox.classList.remove("single-column");
  
      if (filteredForms.length > 1) {
        const formLabel = document.createElement("p");
        formLabel.textContent = "Forms:";
        formLabel.style.fontWeight = "600";
        formLabel.style.marginTop = "10px";
        formLabel.style.color = "#fff";
        formsContainer.appendChild(formLabel);
  
        for (let variety of filteredForms) {
          const formResponse = await fetch(variety.pokemon.url);
          const formData = await formResponse.json();
          const formName = formatAbilityName(variety.pokemon.name.replace(/-/g, ' '));
  
          const btn = document.createElement("button");
          btn.textContent = formName;
          btn.onclick = () => displayPokemon(formData);
  
          let formType1 = formData.types[0].type.name;
          let formType2 = formData.types[1]?.type.name || formType1;
  
          let color = getTypeColor(formType1);
          if (formType1 === baseType) {
            color = getTypeColor(formType2);
            if (formType2 === baseType) {
              color = getTypeColor(formType1);
            }
          }
  
          btn.style.backgroundColor = color;
          formsContainer.appendChild(btn);
        }
      } else {
        pokemonBox.classList.add("single-column");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = document.getElementById("errorMessage");
      errorMessage.textContent = "Could not find Pokémon. Please check your input.";
      errorMessage.style.color = "red";
    }
  }
  
  function displayPokemon(data) {
    const nameDisplay = document.getElementById("pokemonNameDisplay");
    const img = document.getElementById("pokemonSprite");
    const typesDiv = document.getElementById("pokemonTypes");
    const abilitiesDiv = document.getElementById("pokemonAbilities");
    const statsDiv = document.getElementById("pokemonStats");
    const container = document.getElementById("pokemon");
  
    container.classList.remove("fade");
    void container.offsetWidth;
    container.classList.add("fade");
    container.style.display = "flex";
  
    nameDisplay.textContent = formatAbilityName(data.name);
    nameDisplay.style.display = "block";
    img.src = data.sprites.front_default;
    img.style.display = "block";
  
    typesDiv.innerHTML = "";
    const firstType = data.types[0].type.name;
    const color = getTypeColor(firstType);
    nameDisplay.style.color = color;
  
    data.types.forEach(t => {
      const span = document.createElement("span");
      span.textContent = t.type.name;
      span.classList.add("type-pill");
      span.style.backgroundColor = getTypeColor(t.type.name);
      typesDiv.appendChild(span);
    });
    typesDiv.style.display = "flex";
  
    abilitiesDiv.innerHTML = "";
    const normalAbilities = [];
    let hiddenAbility = "";
  
    data.abilities.forEach(a => {
      if (a.is_hidden) hiddenAbility = a.ability.name;
      else normalAbilities.push(a.ability.name);
    });
  
    const labelStyle = `font-weight: 600; color: ${color}; font-size: 1rem;`;
  
    if (normalAbilities.length) {
      const label = document.createElement("p");
      label.textContent = "Abilities:";
      label.style = labelStyle;
      abilitiesDiv.appendChild(label);
      normalAbilities.forEach(ab => {
        const p = document.createElement("p");
        p.textContent = formatAbilityName(ab);
        p.style.color = "#fff";
        p.style.margin = "2px 0";
        abilitiesDiv.appendChild(p);
      });
    }
  
    if (hiddenAbility) {
      const label = document.createElement("p");
      label.textContent = "Hidden Ability:";
      label.style = labelStyle;
      label.style.marginTop = "10px";
      abilitiesDiv.appendChild(label);
      const p = document.createElement("p");
      p.textContent = formatAbilityName(hiddenAbility);
      p.style.color = "#fff";
      p.style.margin = "2px 0";
      abilitiesDiv.appendChild(p);
    }
    abilitiesDiv.style.display = "block";
  
    statsDiv.innerHTML = "";
    const statsLabel = document.createElement("p");
    statsLabel.textContent = "Stats:";
    statsLabel.style = labelStyle;
    statsDiv.appendChild(statsLabel);
  
    data.stats.forEach(s => {
      const name = formatStatName(s.stat.name);
      const val = s.base_stat;
      const row = document.createElement("div");
      row.classList.add("stat-row");
  
      const label = document.createElement("span");
      label.classList.add("stat-label");
      label.textContent = name;
  
      const value = document.createElement("span");
      value.classList.add("stat-value");
      value.textContent = val;
  
      const bar = document.createElement("div");
      bar.classList.add("stat-bar");
      bar.style.width = `${Math.min(val, 200)}px`;
      bar.style.backgroundColor = getStatColor(val);
  
      const barWrap = document.createElement("div");
      barWrap.classList.add("bar-container");
      barWrap.appendChild(bar);
  
      row.appendChild(label);
      row.appendChild(value);
      row.appendChild(barWrap);
      statsDiv.appendChild(row);
    });
  
    statsDiv.style.display = "block";
    container.style.borderColor = color;
  }
  
  function getTypeColor(type) {
    const typeColors = {
      normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
      grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
      ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
      rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
      steel: '#B7B7CE', fairy: '#D685AD',
    };
    return typeColors[type] || '#fff';
  }
  
  function getStatColor(val) {
    if (val < 50) return "#e53935";
    if (val < 60) return "#fb8c00";
    if (val < 90) return "#fdd835";
    if (val < 120) return "#9ccc65";
    if (val < 140) return "#388e3c";
    return "#1e88e5";
  }
  
  function formatAbilityName(name) {
    return name.split(/[\s-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  
  function formatStatName(name) {
    const map = {
      "hp": "HP", "attack": "Attack", "defense": "Defense",
      "special-attack": "Sp. Atk", "special-defense": "Sp. Def", "speed": "Speed"
    };
    return map[name] || name;
  }
  
