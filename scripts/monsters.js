import { fetchAllMonsters } from "./monsters.mjs";

const dialog = document.querySelector("#monster-dialog");
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

function createCard(monster, lazyLoad) {
  const card = document.createElement("div");
  card.classList.add("card");
  if (lazyLoad) {
    card.innerHTML = `
    <h4>${monster.name}</h4>
    <dl class="monster-features">
      <dt>Size:</dt><dd>${monster.size || "Loading..."}</dd>
      <dt>Type:</dt><dd>${monster.type || "Loading..."}</dd>
      <dt>Alignment:</dt><dd>${monster.alignment || "Loading..."}</dd>
      <dt>Hit Points:</dt><dd>${monster.hitPoints || "Loading..."}</dd>
      <dt>Hit Dice:</dt><dd>${monster.hitDice || "Loading..."}</dd>
      <dt>Hit Point Roll:</dt><dd>${monster.hitPointsRoll || "Loading..."}</dd>
      <dt>Dexterity:</dt><dd>${monster.dexterity || "Loading..."}</dd>
      <dt>Constitution:</dt><dd>${monster.constitution || "Loading..."}</dd>
      <dt>Intelligence:</dt><dd>${monster.intelligence || "Loading..."}</dd>
      <dt>Wisdom:</dt><dd>${monster.wisdom || "Loading..."}</dd>
      <dt>Charisma:</dt><dd>${monster.charisma || "Loading..."}</dd>
      <dt>Languages:</dt><dd>${monster.languages || "Loading..."}</dd>
      <dt>XP:</dt><dd>${monster.xp || "Loading..."}</dd>
    </dl>
  `;
  } else {
    card.innerHTML = `
      <h4>${monster.name}</h4>
      <dl class="monster-features">
        <dt>Size:</dt><dd>${monster.size || "Not Available"}</dd>
        <dt>Type:</dt><dd>${monster.type || "Not Available"}</dd>
        <dt>Alignment:</dt><dd>${monster.alignment || "Not Available"}</dd>
        <dt>Hit Points:</dt><dd>${monster.hitPoints || "Not Available"}</dd>
        <dt>Hit Dice:</dt><dd>${monster.hitDice || "Not Available"}</dd>
        <dt>Hit Point Roll:</dt><dd>${monster.hitPointsRoll || "Not Available"}</dd>
        <dt>Dexterity:</dt><dd>${monster.dexterity || "Not Available"}</dd>
        <dt>Constitution:</dt><dd>${monster.constitution || "Not Available"}</dd>
        <dt>Intelligence:</dt><dd>${monster.intelligence || "Not Available"}</dd>
        <dt>Wisdom:</dt><dd>${monster.wisdom || "Not Available"}</dd>
        <dt>Charisma:</dt><dd>${monster.charisma || "Not Available"}</dd>
        <dt>Languages:</dt><dd>${monster.languages || "Not Available"}</dd>
        <dt>XP:</dt><dd>${monster.xp || "Not Available"}</dd>
      </dl>
     `;
  }
  return card;
}

async function populateCardsView(filterBy = "", lazyLoad = true) {
  let monsters = await fetchAllMonsters(lazyLoad);

  if (!monsters || monsters.length === 0) {
    console.error("No monsters data available to populate cards.");
    return;
  }

  sliderWrapper.innerHTML = "";

  if (filterBy) {
    monsters = monsters.filter((monster) =>
      monster.name.toLowerCase().replaceAll(" ", "").includes(filterBy)
    );
  }

  monsters.forEach((monster) => {
    const card = createCard(monster, lazyLoad);
    sliderWrapper.appendChild(card);
    card.addEventListener("click", (e) => {
      const monsterDetails = dialog.querySelector(".monster-details");
      monsterDetails.innerHTML = `
        <h4>${monster.name}</h4>
        <dl>
          <div class="item">
            <dt>Level:</dt>
            <dd>${monster.level}</dd>
          </div>
          <div class="item">
            <dt>Range:</dt>
            <dd>${monster.range || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Components:</dt>
            <dd>${monster.components || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Material:</dt>
            <dd>${monster.material || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Ritual:</dt>
            <dd>${monster.ritual || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Duration:</dt>
            <dd>${monster.duration || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Concentration:</dt>
            <dd>${monster.concentration || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Casting Time:</dt>
            <dd>${monster.castingTime || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Attack Type:</dt>
            <dd>${monster.attackType || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Damage:</dt>
            <dd>${
              monster.damage
                ? monster.damage?.damage_type?.name || monster.damage
                : "N/A"
            }</dd>
          </div>
          <div class="item">
            <dt>School:</dt>
            <dd>${monster.school ? monster.school.name : "N/A"}</dd>
          </div>
        </dl>
        <p>${monster.description || "No description available."}</p>
      `;
      dialog.showModal();
    });
  });

  if (lazyLoad) populateCardsView(filterBy, false);
}

populateCardsView();
