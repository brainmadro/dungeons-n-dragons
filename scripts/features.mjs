async function fetchAllFeatures(lazyLoad = true) {
  if (
    localStorage.getItem("features") &&
    JSON.parse(localStorage.getItem("features")).length == 407
  ) {
    return JSON.parse(localStorage.getItem("features"));
  }

  const res = await fetch("https://www.dnd5eapi.co/api/features");
  const data = await res.json();

  await fetchFeatureDetails(data.results, 0, lazyLoad);

  return data.results;
}

async function fetchFeatureDetails(features, index, lazyLoad) {
  const feature = features[index];
  const cacheFeatures = JSON.parse(localStorage.getItem("features")) || [];

  if (cacheFeatures.find((s) => s.index === feature.index)) {
    features[index] = cacheFeatures.find((s) => s.index === feature.index);
  } else {
    const featureRes = await fetch(`https://www.dnd5eapi.co${feature.url}`);
    const featureData = await featureRes.json();
    feature.level = featureData.level;
    feature.description = featureData.desc.join(" ");
    feature.class = featureData.class ? featureData.class?.name : "None";
    feature.prerequisites = featureData.prerequisites
        
    localStorage.setItem("features", JSON.stringify([...cacheFeatures, feature]));
  }

  if ((lazyLoad && index < 11) || (!lazyLoad && index < features.length - 1)) {
    return fetchFeatureDetails(features, index + 1, lazyLoad);
  }
}

export { fetchAllFeatures };
