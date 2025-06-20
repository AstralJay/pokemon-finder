async function fetchData() {
    try {
      const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      if (!response.ok) throw new Error("Could not fetch resource");
  
      const data = await response.json();
  
      const pokemonSprite = data.sprites.front_default;
      const imgElement = document.getElementById("pokemonSprite");
      imgElement.src = pokemonSprite;
      imgElement.style.display = "block";
  
      const pokemonNameDisplay = document.getElementById("pokemonNameDisplay");
      pokemonNameDisplay.textContent = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
      pokemonNameDisplay.style.display = "block";
  
      const pokemonTypesDisplay = document.getElementById("pokemonTypes");
      pokemonTypesDisplay.innerHTML = "";
  
      const firstType = data.types[0].type.name;
      const firstColor = getTypeColor(firstType);
      pokemonNameDisplay.style.color = firstColor;
  
      data.types.forEach((typeObj, index) => {
        if (index < 2) {
          const type = typeObj.type.name;
          const span = document.createElement("span");
          span.textContent = type;
          span.classList.add("type-pill");
          span.style.backgroundColor = getTypeColor(type);
          pokemonTypesDisplay.appendChild(span);
        }
      });
      pokemonTypesDisplay.style.display = "flex";
  
      const abilitiesDisplay = document.getElementById("pokemonAbilities");
      abilitiesDisplay.innerHTML = "";
  
      const normalAbilities = [];
      let hiddenAbility = "";
  
      data.abilities.forEach(abilityObj => {
        if (abilityObj.is_hidden) {
          hiddenAbility = abilityObj.ability.name;
        } else {
          normalAbilities.push(abilityObj.ability.name);
        }
      });
  
      const labelStyle = `font-weight: 600; color: ${firstColor}; font-size: 1rem;`;
  
      if (normalAbilities.length > 0) {
        const label = document.createElement("p");
        label.textContent = "Abilities:";
        label.style = labelStyle;
        abilitiesDisplay.appendChild(label);
  
        normalAbilities.forEach(ability => {
          const p = document.createElement("p");
          p.textContent = formatAbilityName(ability);
          p.style.color = "#fff";
          p.style.margin = "2px 0";
          abilitiesDisplay.appendChild(p);
        });
      }
  
      if (hiddenAbility) {
        const label = document.createElement("p");
        label.textContent = "Hidden Ability:";
        label.style = labelStyle;
        label.style.marginTop = "10px";
        abilitiesDisplay.appendChild(label);
  
        const p = document.createElement("p");
        p.textContent = formatAbilityName(hiddenAbility);
        p.style.color = "#fff";
        p.style.margin = "2px 0";
        abilitiesDisplay.appendChild(p);
      }
  
      abilitiesDisplay.style.display = "block";
  
      const statsDisplay = document.getElementById("pokemonStats");
      statsDisplay.innerHTML = "";
  
      const statsLabel = document.createElement("p");
      statsLabel.textContent = "Stats:";
      statsLabel.style = labelStyle;
      statsDisplay.appendChild(statsLabel);
  
      data.stats.forEach(statObj => {
        const statName = formatStatName(statObj.stat.name);
        const statValue = statObj.base_stat;
  
        const statRow = document.createElement("div");
        statRow.classList.add("stat-row");
  
        const label = document.createElement("span");
        label.classList.add("stat-label");
        label.textContent = statName;
  
        const value = document.createElement("span");
        value.classList.add("stat-value");
        value.textContent = statValue;
  
        const bar = document.createElement("div");
        bar.classList.add("stat-bar");
        bar.style.width = `${Math.min(statValue, 200)}px`;
        bar.style.backgroundColor = getStatColor(statValue);
  
        const barContainer = document.createElement("div");
        barContainer.classList.add("bar-container");
        barContainer.appendChild(bar);
  
        statRow.appendChild(label);
        statRow.appendChild(value);
        statRow.appendChild(barContainer);
        statsDisplay.appendChild(statRow);
      });
  
      statsDisplay.style.display = "block";
  
      const pokemonContainer = document.getElementById("pokemon");
      pokemonContainer.style.display = "flex";
      pokemonContainer.style.animation = "none";
      void pokemonContainer.offsetWidth;
      pokemonContainer.style.animation = "fadeInScale 0.4s ease-out forwards";
      pokemonContainer.style.borderColor = firstColor;
  
    } catch (error) {
      console.error(error);
      document.getElementById("pokemon").style.display = "none";
    }
  }
  
  function getTypeColor(type) {
    const typeColors = {
      normal: '#A8A77A',
      fire: '#EE8130',
      water: '#6390F0',
      electric: '#F7D02C',
      grass: '#7AC74C',
      ice: '#96D9D6',
      fighting: '#C22E28',
      poison: '#A33EA1',
      ground: '#E2BF65',
      flying: '#A98FF3',
      psychic: '#F95587',
      bug: '#A6B91A',
      rock: '#B6A136',
      ghost: '#735797',
      dragon: '#6F35FC',
      dark: '#705746',
      steel: '#B7B7CE',
      fairy: '#D685AD',
    };
    return typeColors[type] || '#000';
  }
  
  function getStatColor(value) {
    if (value < 50) return "#e53935";
    if (value < 60) return "#fb8c00";
    if (value < 90) return "#fdd835";
    if (value < 120) return "#9ccc65";
    if (value < 140) return "#388e3c";
    return "#1e88e5";
  }
  
  function formatAbilityName(name) {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  function formatStatName(name) {
    const map = {
      "hp": "HP",
      "attack": "Attack",
      "defense": "Defense",
      "special-attack": "Sp. Atk",
      "special-defense": "Sp. Def",
      "speed": "Speed"
    };
    return map[name] || name;
  }
  
