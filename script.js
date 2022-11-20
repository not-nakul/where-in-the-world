let themeSwitch = document.getElementById("themeSwitch");
let themeSwitchIcon = document.getElementById("themeSwitchIcon");
let themeSwitchText = document.getElementById("themeSwitchText");
let userSearchInput = document.getElementById("searchInput");
let contentContainer = document.getElementById("contentContainer");
let placeholder = document.getElementById("placeholder");
let tipContainer = document.getElementById("tipContainer");
let spinnerElement = document.getElementById("spinnerElement");
let detailsPane = document.getElementById("detailsPane");
let backButton = document.getElementById("backButton");
let mainContainer = document.getElementById("mainContainer");
let detailsContent = document.getElementById("detailsContent");
let dropwdownLinks = document.getElementById("dropwdownLinks");
let homeButton = document.getElementById("homeButton");
let errorMessage = document.getElementById("errorMessage");

// logic for changing from dark to light mode and vice-versa
themeSwitch.addEventListener("click", (event) => {
  if (themeSwitchIcon.textContent === "dark_mode") {
    themeSwitchIcon.textContent = "light_mode";
    themeSwitchText.textContent = "Light Mode";
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (themeSwitchIcon.textContent === "light_mode") {
    themeSwitchIcon.textContent = "dark_mode";
    themeSwitchText.textContent = "Dark Mode";
    document.documentElement.setAttribute("data-theme", "light");
  }
});

// logic to display the dropdown menu
document.addEventListener("click", (event) => {
  const isDropdownButton = event.target.matches("[data-dropdown-button]");
  if (!isDropdownButton && event.target.closest("[data-dropdown]") != null) {
    return;
  }

  let currentDropdown;
  if (isDropdownButton) {
    currentDropdown = event.target.closest("[data-dropdown]");
    currentDropdown.classList.toggle("active");
  }

  document.querySelectorAll("[data-dropdown].active").forEach((dropdown) => {
    if (dropdown === currentDropdown) {
      return;
    }

    dropdown.classList.remove("active");
  });
});

// appending and displaying the data
let appendResults = (result) => {
  let countryCard = document.createElement("div");
  countryCard.classList.add("country-card");
  contentContainer.appendChild(countryCard);

  let { name, flags, population, region, capital } = result;

  let flagImage = document.createElement("img");
  flagImage.src = flags.png;
  countryCard.appendChild(flagImage);

  let textContainer = document.createElement("div");
  textContainer.classList.add("card-text");
  countryCard.appendChild(textContainer);

  let countryName = document.createElement("h3");
  countryName.textContent = name.common;
  textContainer.appendChild(countryName);

  let countryPopulation = document.createElement("p");
  countryPopulation.textContent = "Population: " + population.toLocaleString();
  textContainer.appendChild(countryPopulation);

  let countryRegion = document.createElement("p");
  countryRegion.textContent = "Region: " + region;
  textContainer.appendChild(countryRegion);

  let countryCapital = document.createElement("p");
  countryCapital.textContent = "Capital: " + capital;
  textContainer.appendChild(countryCapital);

  // logic to display the detailed view
  flagImage.addEventListener("click", (event) => {
    detailsPane.style.transform = "translateX(0%)";
    mainContainer.style.display = "none";

    if (event.target.src === result.flags.png) {
      let detailedImage = document.createElement("img");
      detailedImage.src = result.flags.png;
      detailsContent.appendChild(detailedImage);

      let detailedText = document.createElement("div");
      detailedText.classList.add("details-text");
      detailsContent.appendChild(detailedText);

      let detailedName = document.createElement("h3");
      detailedName.textContent = result.name.common;
      detailedText.appendChild(detailedName);

      let nativeName = result.name.nativeName;
      let detailedNativeName = document.createElement("p");
      detailedNativeName.textContent =
        "Native Name: " + Object.values(nativeName)[0].official;
      detailedText.appendChild(detailedNativeName);

      let detailedPopulation = document.createElement("p");
      detailedPopulation.textContent =
        "Population: " + result.population.toLocaleString();
      detailedText.appendChild(detailedPopulation);

      let detailedRegion = document.createElement("p");
      detailedRegion.textContent = "Region: " + result.region;
      detailedText.appendChild(detailedRegion);

      let detailedSubRegion = document.createElement("p");
      detailedSubRegion.textContent = "Sub Region: " + result.subregion;
      detailedText.appendChild(detailedSubRegion);

      let detailedCapital = document.createElement("p");
      detailedCapital.textContent = "Capital: " + result.capital;
      detailedText.appendChild(detailedCapital);

      let detailedDomain = document.createElement("p");
      detailedDomain.textContent = "Top Level Domain: " + result.tld;
      detailedText.appendChild(detailedDomain);

      let currencies = result.currencies;
      let detailedCurrencies = document.createElement("p");
      detailedCurrencies.textContent =
        "Currency: " +
        Object.values(currencies)[0].name +
        " (" +
        Object.values(currencies)[0].symbol +
        ")";
      detailedText.appendChild(detailedCurrencies);

      let detailedLanguages = document.createElement("p");
      detailedLanguages.textContent =
        "Languages: " + Object.values(result.languages);
      detailedText.appendChild(detailedLanguages);
    }
  });

  backButton.addEventListener("click", (event) => {
    detailsPane.style.transform = "translateX(100%)";
    mainContainer.style.display = "";
    detailsContent.textContent = "";
  });
};

const displayResults = (searchResults) => {
  spinnerElement.style.display = "none";
  searchResults.map(appendResults);
};

// displaying all of the countries on the initial load
let url = "https://restcountries.com/v3.1/all";

let options = {
  method: "GET",
};

fetch(url, options)
  .then((response) => response.json())
  .then((data) => {
    let searchResults = data;
    displayResults(searchResults);
  });

// logic for filtering search results
userSearchInput.addEventListener("keydown", (event) => {
  if (event.target.value.trim() === "") {
    return;
  }

  // if (event.target.value.trim() === "*" && event.key === "Enter") {
  //   let url = "https://restcountries.com/v3.1/all";

  //   let options = {
  //     method: "GET",
  //   };

  //   fetch(url, options)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       let searchResults = data;
  //       displayResults(searchResults);
  //     });

  //   event.target.value = "";
  //   contentContainer.textContent = "";
  //   placeholder.style.display = "none";
  //   return;
  // }

  if (event.key === "Enter") {
    let enteredInput = event.target.value;
    url = "https://restcountries.com/v3.1/name/" + enteredInput;

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          return;
        }

        return response.json();
      })
      .then((data) => {
        let searchResults = data;
        displayResults(searchResults);
      })
      .catch((error) => {
        errorMessage.style.display = "flex";
        tipContainer.style.display = "none";
      });

    event.target.value = "";
    contentContainer.textContent = "";
    spinnerElement.style.display = "";
    // placeholder.style.display = "none";
    homeButton.style.display = "flex";
    errorMessage.style.display = "none";
    tipContainer.style.display = "";
  }
});

// logic for filtering the cards by region
dropwdownLinks.addEventListener("click", (event) => {
  if (event.target.id === "dropwdownLinks") {
    return;
  }

  let regionId = event.target.id;
  if (regionId === "asia") {
    url = "https://restcountries.com/v3.1/region/" + regionId;
  } else if (regionId === "africa") {
    url = "https://restcountries.com/v3.1/region/" + regionId;
  } else if (regionId === "europe") {
    url = "https://restcountries.com/v3.1/region/" + regionId;
  } else if (regionId === "oceania") {
    url = "https://restcountries.com/v3.1/region/" + regionId;
  } else if (regionId === "americas") {
    url = "https://restcountries.com/v3.1/region/" + regionId;
  }

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      let searchResults = data;
      displayResults(searchResults);
    });

  contentContainer.textContent = "";
  spinnerElement.style.display = "";
  homeButton.style.display = "flex";
});

// logic to clear all the filters and return to the initial state
homeButton.addEventListener("click", (event) => {
  url = "https://restcountries.com/v3.1/all";

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      let searchResults = data;
      displayResults(searchResults);
    });

  contentContainer.textContent = "";
  spinnerElement.style.display = "";
  homeButton.style.display = "none";
  errorMessage.style.display = "none";
  tipContainer.style.display = "";
});
