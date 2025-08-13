async function fetchAllMonsters(lazyLoad = true) {
  
  if (
    localStorage.getItem("monsters") &&
    JSON.parse(localStorage.getItem("monsters")).length == 334
  ) {
    return JSON.parse(localStorage.getItem("monsters"));
  }

  const res = await fetch("https://www.dnd5eapi.co/api/monsters");
  const data = await res.json();

  await fetchMonsterDetails(data.results, 0, lazyLoad);

  return data.results;
}

async function fetchMonsterDetails(monsters, index, lazyLoad) {
  const monster = monsters[index];
  const cacheMonsters = JSON.parse(localStorage.getItem("monsters")) || [];

  if (cacheMonsters.find((s) => s.index === monster.index)) {
    monsters[index] = cacheMonsters.find((s) => s.index === monster.index);
  } else {
    const monsterRes = await fetch(`https://www.dnd5eapi.co${monster.url}`);
    const monsterData = await monsterRes.json();
    monster.size = monsterData.size;
    monster.type = monsterData.type;
    monster.alignment = monsterData.alignment;
    monster.hitPoints = monsterData.hit_points;
    monster.hitDice = monsterData.hit_dice;
    monster.hitPointsRoll = monsterData.hit_points_roll;
    monster.strength = monsterData.strength;
    monster.dexterity = monsterData.dexterity;
    monster.constitution = monsterData.constitution;
    monster.intelligence = monsterData.intelligence;
    monster.wisdom = monsterData.wisdom;
    monster.charisma = monsterData.charisma;
    monster.languages = monsterData.languages;
    monster.xp = monsterData.xp;

    localStorage.setItem("monsters", JSON.stringify([...cacheMonsters, monster]));
  }

  if ((lazyLoad && index < 11) || (!lazyLoad && index < monsters.length - 1)) {
    return fetchMonsterDetails(monsters, index + 1, lazyLoad);
  }
}

export { fetchAllMonsters };
