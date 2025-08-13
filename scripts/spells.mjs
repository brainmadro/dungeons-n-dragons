async function fetchAllSpells(lazyLoad = true) {
  if (
    localStorage.getItem("spells") &&
    JSON.parse(localStorage.getItem("spells")).length == 319
  ) {
    return JSON.parse(localStorage.getItem("spells"));
  }

  const res = await fetch("https://www.dnd5eapi.co/api/spells");
  const data = await res.json();
  
  await fetchSpellDetails(data.results, 0, lazyLoad);

  return data.results;
}

async function fetchSpellDetails(spells, index, lazyLoad) {
  const spell = spells[index];
  const cacheSpells = JSON.parse(localStorage.getItem("spells")) || [];

  if (cacheSpells.find((s) => s.index === spell.index)) {
    spells[index] = cacheSpells.find((s) => s.index === spell.index);
  } else {
    const spellRes = await fetch(`https://www.dnd5eapi.co${spell.url}`);
    const spellData = await spellRes.json();
    spell.description = spellData.desc.join(" ");
    spell.higherLevel = spellData.higher_level
      ? spellData.higher_level.join(" ")
      : "";
    spell.range = spellData.range;
    spell.components = spellData.components.join(", ");
    spell.material = spellData.material ? spellData.material : "None";
    spell.ritual = spellData.ritual ? "Yes" : "No";
    spell.duration = spellData.duration;
    spell.concentration = spellData.concentration ? "Yes" : "No";
    spell.castingTime = spellData.casting_time;
    spell.attackType = spellData.attack_type ? spellData.attack_type : "None";
    spell.damage = spellData.damage ? spellData.damage : "None";
    spell.school = spellData.school;
    spell.classes = spellData.classes;

    localStorage.setItem("spells", JSON.stringify([...cacheSpells, spell]));
  }
  
  if ((lazyLoad && index < 11) || (!lazyLoad && index < spells.length - 1)) {
    return fetchSpellDetails(spells, index + 1, lazyLoad);
  }
}

export { fetchAllSpells };
