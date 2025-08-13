async function fetchAllClasses() {
  try {
    if (
      localStorage.getItem("classes") &&
      JSON.parse(localStorage.getItem("classes")).length == 12
    ) {
      return JSON.parse(localStorage.getItem("classes"));
    }
  
    const res = await fetch("https://www.dnd5eapi.co/api/classes");
    const data = await res.json();
  
    await fetchClassDetails(data.results);
  
    return data.results;    
  } catch (error) {
    console.error("Error fetching classes:", error);
    return [];
  }
}

async function fetchClassDetails(classes, index = 0) {
  const charClass = classes[index];
  const cacheClasses = JSON.parse(localStorage.getItem("classes")) || [];

  if (cacheClasses.find((s) => s.index === charClass.index)) {
    classes[index] = cacheClasses.find((s) => s.index === charClass.index);
  } else {
    try {
      const classRes = await fetch(`https://www.dnd5eapi.co${charClass.url}`);
      const classData = await classRes.json();
      charClass.hitDie = classData.hit_die;
      charClass.proficiencies = classData.proficiencies.map((p) => p.name).join(", ");
      charClass.savingThrows = classData.saving_throws.map((s) => s.name).join(", ");
  
      localStorage.setItem("classes", JSON.stringify([...cacheClasses, charClass]));
    } catch (error) {
      console.error(`Error fetching class details for ${charClass.index}:`, error);
    }
  }

  if (index < classes.length - 1) {
    return fetchClassDetails(classes, index + 1);
  }
}

export { fetchAllClasses };
