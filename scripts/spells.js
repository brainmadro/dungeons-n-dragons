import { fetchAllSpells } from "./spells.mjs";

const dialog = document.querySelector("#spell-dialog");
const searchForm = document.querySelector("#search-form");
const sliderWrapper = document.querySelector(".slider-wrapper");
const dialogCloseButton = dialog.querySelector('.close-button');

dialogCloseButton.addEventListener('click', () => {
	dialog.close();
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(searchForm);
  const searchTerm = formData.get("search").toLowerCase().replaceAll(" ", "");
  populateCardsView(searchTerm, false);
});

function createCard(spell, lazyLoad) {
  const card = document.createElement("div");

  card.classList.add("card");

  if (lazyLoad) {
    card.innerHTML = `
    <h4>${spell.name}</h4>
    <dt>Level: ${spell.level}</dt>
    <p class="truncated">${spell.description || "Loading"}</p>
    <dl class="spell-features">
      <dt>Range:</dt><dd>${spell.range || "Loading..."}</dd>
      <dt>Components:</dt><dd>${spell.components || "Loading..."}</dd>
      <dt>Ritual:</dt><dd>${spell.ritual || "Loading..."}</dd>
      <dt>Duration:</dt><dd>${spell.duration || "Loading..."}</dd>
      <dt>Concentration:</dt><dd>${spell.concentration || "Loading..."}</dd>
      <dt>Casting Time:</dt><dd>${spell.castingTime || "Loading..."}</dd>
      <dt>Attack Type:</dt><dd>${spell.attackType || "Loading..."}</dd>
      <dt>Damage:</dt><dd>${
        spell.damage
        ? spell.damage?.damage_type?.name || spell.damage
        : "Loading..."
      }</dd>
      <dt>School:</dt><dd>${spell.school ? spell.school.name : "Loading..."}</dd>
    </dl>
    <span><dt>Material:</dt>${spell.material || "Loading..."}</span>
  `;
  } else {
    card.innerHTML = `
      <h4>${spell.name}</h4>
      <dt>Level: ${spell.level}</dt>
      <p class="truncated">${spell.description || "No description available."}</p>
      <dl class="spell-features">
        <dt>Range: </dt><dd>${spell.range || "N/A"}</dd>
        <dt>Components:</dt><dd>${spell.components || "N/A"}</dd>   
        <dt>Ritual:</dt><dd>${spell.ritual || "N/A"}</dd>      
        <dt>Duration:</dt><dd>${spell.duration || "N/A"}</dd>      
        <dt>Concentration:</dt><dd>${spell.concentration || "N/A"}</dd>      
        <dt>Casting Time:</dt><dd>${spell.castingTime || "N/A"}</dd>      
        <dt>Attack Type:</dt><dd>${spell.attackType || "N/A"}</dd>      
        <dt>Damage:</dt><dd${spell.damage ? spell.damage?.damage_type?.name || spell.damage : "N/A"}</dd>      
        <dt>School:</dt><dd>${spell.school ? spell.school.name : "N/A"}</dd>
      </dl>
      <span><dt>Material:</dt>${spell.material || "N/A"}</span>
     `;
  }
  return card;
}

async function populateCardsView(filterBy = "", lazyLoad = true) {
  let spells = await fetchAllSpells(lazyLoad);
  console.log('Spells fetched:', spells.length, spells[0], spells[1], lazyLoad);
  if (!spells || spells.length === 0) {
    console.error("No spells data available to populate cards.");
    return;
  }

  sliderWrapper.innerHTML = "";

  if (filterBy) {
    spells = spells.filter((spell) =>
      spell.name.toLowerCase().replaceAll(" ", "").includes(filterBy)
    );
  }

  spells.forEach((spell) => {
    const card = createCard(spell, lazyLoad);
    sliderWrapper.appendChild(card);
    card.addEventListener("click", (e) => {
      const spellDetails = dialog.querySelector(".spell-details");
      spellDetails.innerHTML = `
        <h4>${spell.name}</h4>
        <dl>
          <div class="item">
            <dt>Level:</dt>
            <dd>${spell.level}</dd>
          </div>
          <div class="item">
            <dt>Range:</dt>
            <dd>${spell.range || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Components:</dt>
            <dd>${spell.components || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Material:</dt>
            <dd>${spell.material || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Ritual:</dt>
            <dd>${spell.ritual || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Duration:</dt>
            <dd>${spell.duration || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Concentration:</dt>
            <dd>${spell.concentration || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Casting Time:</dt>
            <dd>${spell.castingTime || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Attack Type:</dt>
            <dd>${spell.attackType || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Damage:</dt>
            <dd>${
              spell.damage
                ? spell.damage?.damage_type?.name || spell.damage
                : "N/A"
            }</dd>
          </div>
          <div class="item">
            <dt>School:</dt>
            <dd>${spell.school ? spell.school.name : "N/A"}</dd>
          </div>
        </dl>
        <p>${spell.description || "No description available."}</p>
      `;
      dialog.showModal();
    });
  });

  if (lazyLoad) populateCardsView(filterBy, false);
}

populateCardsView();
