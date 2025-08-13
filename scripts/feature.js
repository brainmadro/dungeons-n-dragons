import { fetchAllFeatures } from "./features.mjs";

const dialog = document.querySelector("#feature-dialog");
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

function createCard(feature, lazyLoad) {
  const card = document.createElement("div");
  
  card.classList.add("card");

  if (lazyLoad) {
    card.innerHTML = `
    <h4>${feature.name}</h4>
    <dt>Level: ${feature.level}</dt>
    <p class="truncated">${feature.description || "Loading"}</p>
    <dl class="feature-features">
      <dt>Class:</dt><dd>${feature.class || "Loading..."}</dd>
      <dt>Prerequisites:</dt><dd>${feature.prerequisites || "Loading..."}</dd>
    </dl>
  `;
  } else {
    card.innerHTML = `
      <h4>${feature.name}</h4>
      <dt>Level: ${feature.level}</dt>
      <p class="truncated">${feature.description || "No description available."}</p>
      <dl class="feature-features">
        <dt>Class:</dt><dd>${feature.class || "N/A"}</dd>
      <dt>Prerequisites:</dt><dd>${feature.prerequisites || "N/A"}</dd>
      </dl>
     `;
  }
  return card;
}

async function populateCardsView(filterBy = "", lazyLoad = true) {
  let features = await fetchAllFeatures(lazyLoad);

  if (!features || features.length === 0) {
    console.error("No features data available to populate cards.");
    return;
  }
``
  sliderWrapper.innerHTML = "";

  if (filterBy) {
    features = features.filter((feature) =>
      feature.name.toLowerCase().replaceAll(" ", "").includes(filterBy)
    );
  }

  features.forEach((feature) => {
    const card = createCard(feature, lazyLoad);
    sliderWrapper.appendChild(card);
    card.addEventListener("click", (e) => {
      const featureDetails = dialog.querySelector(".feature-details");
      featureDetails.innerHTML = `
        <h4>${feature.name}</h4>
        <dl>
          <div class="item">
            <dt>Level:</dt>
            <dd>${feature.level}</dd>
          </div>
          <div class="item">
            <dt>Class:</dt>
            <dd>${feature.class || "N/A"}</dd>
          </div>
          <div class="item">
            <dt>Prerequisites:</dt>
            <dd>${feature.prerequisites || "N/A"}</dd>
          </div>
        </dl>
        <p>${feature.description || "No description available."}</p>
      `;
      dialog.showModal();
    });
  });

  if (lazyLoad) populateCardsView(filterBy, false);
}

populateCardsView();
