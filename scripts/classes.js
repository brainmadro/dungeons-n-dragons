import { fetchAllClasses } from "./classes.mjs";

const dialog = document.querySelector("#class-dialog");
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

function createCard(charClass, lazyLoad) {
  const card = document.createElement("div");

  card.classList.add("card");

  if (lazyLoad) {
    card.innerHTML = `
    <h4>${charClass.name}</h4>
    <dl class="class-features">
      <dt>Hit Dice: </dt><dd>${charClass.hitDie || "Loading..."}</dd>
      <dt>Saving Throws:</dt><dd>${charClass.savingThrows || "Loading..."}</dd> 
    </dl>
    <span><dt>Proficiencies:</dt>${charClass.proficiencies || "Loading..."}</span>
  `;
  } else {
    card.innerHTML = `
      <h4>${charClass.name}</h4>
      <dl class="class-features">
        <dt>Hit Dice: </dt><dd>${charClass.hitDie || "N/A"}</dd>
        <dt>Saving Throws:</dt><dd>${charClass.savingThrows || "N/A"}</dd> 
      </dl>
      <span><dt>Proficiencies:</dt>${charClass.proficiencies || "N/A"}</span>
     `;
  }
  return card;
}

async function populateCardsView(filterBy = "", lazyLoad = true) {
  let classes = await fetchAllClasses(lazyLoad);

  if (!classes || classes.length === 0) {
    console.error("No classes data available to populate cards.");
    return;
  }

  sliderWrapper.innerHTML = "";

  if (filterBy) {
    classes = classes.filter((c) =>
      c.name.toLowerCase().replaceAll(" ", "").includes(filterBy)
    );
  }

  classes.forEach((charClass) => {
    const card = createCard(charClass, lazyLoad);
    sliderWrapper.appendChild(card);
    card.addEventListener("click", (e) => {
      const classDetails = dialog.querySelector(".class-details");
      classDetails.innerHTML = `
        <h4>${charClass.name}</h4>
        <dl>
          <div class="item">
            <dt>Hit Dice: </dt>
            <dd>${charClass.hitDie}</dd>
          </div>
          <div class="item">
            <dt>Proficiencies:</dt>
            <dd>${charClass.proficiencies}</dd> 
          </div>
          <div class="item">  
            <dt>Saving Throws:</dt>
            <dd>${charClass.savingThrows}</dd>
          </div>
      `;
      dialog.showModal();
    });
  });

  if (lazyLoad) populateCardsView(filterBy, false);
}

populateCardsView();
