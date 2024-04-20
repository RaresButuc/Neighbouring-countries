

let visitedCountries = [];
let currentIndex = -1;
let isLastClickPrevOrNext = false
const mainFunct = (element, selectedElement) => {
    selectedElement.innerHTML = `
    <img src="${element.flags.png}">
    <h1>Country name: ${element.name.common}</h1>
    <h2>Region: ${element.region}</h2>
    <h3>Subregion: ${element.subregion}</h3>
    <h4>Capital: ${element.capital}</h4>
    <h4>Population: ${element.population}</h4>
    <h4>Area: ${element.area} km²</h4>
`;
}
const processPrevBtn = (selectedElement) => {
    if (currentIndex > 0) {
        currentIndex--;
        mainFunc(visitedCountries[currentIndex], selectedElement);
    }
}

const processNextBtn = (selectedElement) => {
    if (currentIndex < visitedCountries.length - 1) {
        currentIndex++;
        mainFunc(visitedCountries[currentIndex], selectedElement);
    }
}
//2nd version
// const processPrevBtn = (selectedElement) => {
//     console.log("PrevBtn")
//     currentIndex--
//     console.log(currentIndex)
//     console.log(visitedCountries[currentIndex])
//     mainFunct(visitedCountries[currentIndex], selectedElement)
// }
// const processNextBtn = (selectedElement) => {
//     console.log("NextBtn")
//     currentIndex++
//     mainFunct(visitedCountries[currentIndex], selectedElement)
// }

const largest = (element1, element2, element3, key, selectedElement) => {
    if (!element1.borders) {
        selectedElement.innerHTML = `<h2>This country has no neighbours.</h2>`
    } else {
        element1.borders.forEach(borderCountry => {
            const currentNeighbor = countries.find(country => country.cca3 === borderCountry);

            if (currentNeighbor[key] > element2) {
                element2 = currentNeighbor[key];
                element3 = currentNeighbor;
                mainFunct(element3, selectedElement)
            }
        })
    }
    return
}

let languages;
const returnLanguages = (arrOfObjs) => {
    arrOfObjs.forEach(country => {
        languages = Object.keys(country.translations)
    });
    return languages
}
let allLanguages = []
const commonNames = (param1, param2) => {
    param1.forEach(country => {
        console.log(country.translations[param2])
        // country.translations.forEach(item => {
        //     // if(item === Object.keys(country.translations))
        // });
    })
}
let selectedCountry = {}
const loadEvent = function () {
    let largestPopulationNeighbor;
    let largestPopulation = 0;
    let largestAreaNeighbor;
    let largestArea = 0;

    //1. List the countries
    const options = document.querySelector("#all");
    const population = document.querySelector('#population')
    const area = document.querySelector('#area')
    options.insertAdjacentHTML("beforeend", `<option value="" selected="true" disabled>Select a country</option>`);

    countries.forEach((country, i) => {
        options.insertAdjacentHTML("beforeend", `<option id = ${i}> ${country.name.common} </option>`);
    });

    //2. Details of the selected country
    const main = document.querySelector("#country");
    main.innerHTML = `<h2>Protect the world with
    TrackAttack</h2>`

    //**************************************** */
    //Ex. 5
    const nav = document.querySelector("#toolbar")
    nav.insertAdjacentHTML("beforeend",
        `<button id="prev">Previous country</button>
        <button id="next">Next country</button>
        `)
    const prevBtn = document.querySelector("#prev");
    prevBtn.style.display = "none"
    const nextBtn = document.querySelector("#next");
    nextBtn.style.display = "none"

    //****************************************** */
    nav.insertAdjacentHTML("beforeend", `<select id=translations></select>`)
    const optionsOfTranslations = document.querySelector("#translations")
    optionsOfTranslations.insertAdjacentHTML("beforeend", `<option>Select a language</option>`);
    //6. Translations

    // console.log(selectedCountry)
    returnLanguages(countries)
    languages.forEach((language, i) => {
        optionsOfTranslations.insertAdjacentHTML("beforeend", `<option id="${i}">${language}</option>`);
    })
    //***********************************
    options.addEventListener("change", function () {
        const selectedValue = this.value;
        selectedCountry = countries.find(country => country.name.common === selectedValue);

        if (selectedCountry) {
            //console.log(selectedCountry)
            main.innerHTML = `
    <img src="${selectedCountry.flags.png}">
    <h1>Country name: ${Object.keys(selectedCountry.translations).includes(optionsOfTranslations.value)? selectedCountry.translations[optionsOfTranslations.value].common : selectedCountry.name.common}</h1>
    <h2>Region: ${selectedCountry.region}</h2>
    <h3>Subregion: ${selectedCountry.subregion}</h3>
    <h4>Capital: ${selectedCountry.capital}</h4>
    <h4>Population: ${selectedCountry.population}</h4>
    <h4>Area: ${selectedCountry.area} km²</h4>
`; //Show details of the country
        }

        const populationBtn = document.querySelector("#population");
        const areaBtn = document.querySelector("#area");
        //PopulationBtn and after AreaBtn
        //3.Largest population
        populationBtn.addEventListener("click", function () {
            largest(selectedCountry, largestPopulation, largestPopulationNeighbor, "population", main)

            //4. Largest area
            areaBtn.addEventListener("click", function () {
                largest(selectedCountry, largestArea, largestAreaNeighbor, "area", main)
            })
        })
        //AreaBtn and after PopulationBtn
        areaBtn.addEventListener("click", function () {
            largest(selectedCountry, largestArea, largestAreaNeighbor, "area", main)
            populationBtn.addEventListener("click", function () {
                largest(selectedCountry, largestPopulation, largestPopulationNeighbor, "population", main)
            })
        })

        //5. Previous and next buttons
        if (isLastClickPrevOrNext) {
            let tempVisitedCountries = JSON.parse(JSON.stringify(visitedCountries))
            // console.log(visitedCountries)
            for (let i = currentIndex + 1; i < visitedCountries.length; i++) {
                tempVisitedCountries.splice(i, 1)
            }
            visitedCountries = tempVisitedCountries
        }
        visitedCountries.push(selectedCountry)
        currentIndex = visitedCountries.length - 1;
        isLastClickPrevOrNext = false;
        //console.log("visited", visitedCountries)
        //console.log("current", currentIndex)
        prevBtn.style.display = "block"

    })
    prevBtn.addEventListener('click', function () {
        isLastClickPrevOrNext = true;

        currentIndex--
        // if(currentIndex <= 0){
        //     prevBtn.style.display = "block"
        // } 
        // console.log(currentIndex)
        // console.log(visitedCountries[currentIndex])
        mainFunct(visitedCountries[currentIndex], main)

        if (visitedCountries.length > 1) {
            nextBtn.style.display = "block"
        }
        return
    })
    nextBtn.addEventListener('click', function () {
        isLastClickPrevOrNext = true;
        currentIndex++
        mainFunct(visitedCountries[currentIndex], main)
    })

   
    optionsOfTranslations.addEventListener('change', function () {
        // const selectedValue = this.value;
        // console.log(selectedValue)
        //let selectedCountry = countries.find(country => Object.keys(country.translations).includes(selectedValue));
        console.log(selectedCountry)
        let key = optionsOfTranslations.value
        countries.forEach(country => {
            if (options.value === country.name.common) {
                main.innerHTML =
                    `<img src="${country.flags.png}">
          <h1>Country name: ${country.translations[key].common}</h1>
          <h2>Region: ${selectedCountry.region}</h2>
          <h3>Subregion: ${selectedCountry.subregion}</h3>
          <h4>Capital: ${selectedCountry.capital}</h4>
          <h4>Population: ${selectedCountry.population}</h4>
          <h4>Area: ${selectedCountry.area}  km²</h4>
          `
            }
        })
    })

    // console.log(allLanguages)

}
window.addEventListener("load", loadEvent);
