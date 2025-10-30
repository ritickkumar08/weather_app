// index.js
// Weather Forecast Application (skySnap)
// Handles API calls, UI updates, and user interactions
//// https://api.openweathermap.org/data/2.5/weather?q=gumla&appid=7ba69110ea3e8a7bf4ad655cdd25a2de&units=metric

//the generated API key from https://openweathermap.org/api
const API_KEY = "7ba69110ea3e8a7bf4ad655cdd25a2de";

//selecting all the need nodes that would be manipulated later -----------------------------------------------------------------------------------
const cityInput = document.querySelector('inputCity') //points at the input node
const userLocation = document.querySelector('userLocation') //points at the button for 
const navBar = document.querySelector('navBar')//pointin at the navigation bar as a whole
const logo = document.querySelector('logo') //pointing at the logo of the webapp
const detailsArea = document.querySelector('detailsArea') //points at the whole area where the information about the weather conditions is displayed
const tempratureMain = document.querySelector('tempratureMain') //the area where the information is displayed
const tempIconEl = tempratureMain?.querySelector('i') || null
const tempTextEl = tempratureMain?.querySelector('h2') || null
const toggleBtn = tempratureMain?.querySelector('button[aria-label]') || null

// little info boxes -----------------------------------------------------------------------------------
const windBox = document.querySelector(".wind")
const atmosphereBox = document.querySelector(".atmosphere")
const temperatureBox = document.querySelector(".temperature")
const visibilityBox = document.querySelector(".visibility")

//some dynamic creations variables -----------------------------------------------------------------------------------
let recentDropDown
let errorPopup
let extremeAlert

//state variables -----------------------------------------------------------------------------------
let currentTempC = null
let isCelsius = true //will be furthur be updated by the users toggles

//utility helpers -----------------------------------------------------------------------------------
function toFahrenhiet(Celsius) {
    //formula to convert the data to fahrenhiet.
    return ((Celsius * 9) / 5) + 32
}




// fecth function -----------------------------------------------------------------------------------
//1. fetching the data and returning it in a json format.
async function fetchJSON(url) {
    try {
        const res = await fetch(url)
        if (!res.ok) {
            const text = await res.text().catch(() => "")
            throw new Error(`API error: ${res.status} ${res.statusText} ${txt ? "_" + txt : ""}`)
        }
        return await res.json();
    } catch (error) {
        throw (error)
    }
}

//function to fetch weather by city
async function getWeatherByCity(city) {
    if (!city) throw new Error('enter a city name')
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cencodeURIComponent(city)}&appid=${API_KEY}&units=metric` // we are not using await 
    //because we are returning a function call, and the function fetches the url checks for error and then return it to furthur functions.
    return fetchJSON(url)
}

//function to get the forcast data.
async function getForecastByCity(city) {
    if (!city) throw new Error("Empty city");
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cencodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    return fetchJSON(url)
}

//function to get the weather by coordinates, that is by location.
async function getWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
    return fetchJSON(url)
}

//function to get forcast by coordinates
async function getForcastByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
    return fetchJSON(url)
}


//display functions -----------------------------------------------------------------------------------
function displayCurrentWeather(data) {
    if (!data) return;
    //data fields : main.temp, weather[0].main, weather[0].description, name, wind, main.humidity, visibility.
    const name = data.name ? `${data.name}, ${data.sys?.country || ""}` : ""
    const tempC = Number(data.main?.temp ?? 0)
    currentTempC = tempC
    isCelsius = true //reseting the toggle display to celsius by default when loading new city

    //icon
    const iconCode = data.weather?.[0]?.description || ""
    const weatherMain = data.weather?.[0]?.main || data.weather?.[0]?.description || "";

    //build main text
    if (tempTextEl) {
        const desc = data.weather?.[0]?.description || ""
        tempTextEl.innerHTML = `${tempC.toFixed(1)} °C <p class="font-light text-3xl">${desc}</p><p class="text-sm mt-1">${name}</p>`;
    } else {
        //
        tempMain.innerHTML = `<div class="ml-6"><img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="icon"><h2>${tempC.toFixed(1)} °C</h2><p>${data.weather?.[0]?.description || ""}</p><p>${name}</p></div>`;
    }

    //wind box
    if (windBox) {
        const speed = data.wind?.speed ?? "N/A"
        const pressure = data.wind?.deg ?? "N/A";
        windBox.innerHTML = `
        <div class="ml-3 mt-1"><h3 class="text-xl">💨Wind</h3>
        <div>
        <p class="ml-3 mt-2">Wind Speed : ${speed} m/s</p>
        <p class="ml-3 mt-1">Direction : ${deg}°</p>
        </div>`
    }

    //atmosphere
    if (atmosphereBox) {
        const humidity = data.main?.humidity ?? "N/A";
        const pressure = data.main?.pressure ?? "N/A";
        atmosphereBox.innerHTML = `
      <div class="ml-3 mt-1"><h3 class="text-xl">☁️🌁Atmosphere</h3></div>
      <div>
        <p class="ml-3 mt-2">Humidity : ${humidity}%</p>
        <p class="ml-3 mt-1">Pressure : ${pressure} hPa</p>
      </div>`
    }

    //temperature details
    if (temperatureBox) {
        const feels = data.main?.feels_like ?? "N/A";
        temperatureBox.innerHTML = `
      <div class="ml-3 mt-1"><h3 class="text-xl">🔥❄️Temperature</h3></div>
      <div>
        <p class="ml-3 mt-2">Feels Like : ${feels} °C</p>
      </div>`
    }

    // visibility / precipitation
    if (visibilityBox) {
        const vis = data.visibility ?? "N/A";
        visibilityBox.innerHTML = `
      <div class="ml-3 mt-1"><h3 class="text-xl">🌁🔭Visibility</h3></div>
      <div>
        <p class="ml-3 mt-1">Visibility : ${vis === "N/A" ? "N/A" : (vis / 1000).toFixed(1) + " km"}</p>
      </div>`
    }

    //   extreme temperature alert
    if (tempC > 40) {
        showExtremeAlert(`temperature is ${tempC.toFixed(1)} °C — extreme heat. Stay hydrated and avoid outdoor activity.`)
    }

    //attach toggle button state(c)
    if (toggleBtn) {
        toggleBtn.textContent = "°C"
    }
}

//function to display the forcast for the coming 5 days.
function displayForcast(forcastData) {
    if (!forcastData || !forcastData.list) {
        foreCastContainer.innerHTML = "<div class='col-span-5'>No forecast data</div>"
        return
    }
    // Pick one forecast per day; choose items with "12:00:00" if present. Group by date.
    const list = forecastData.list;
    const byDate = {};
    list.forEach((item) => {
        const dtTxt = item.dt_txt; // "2025-10-28 12:00:00"
        const date = dtTxt.split(" ")[0];
        if (!byDate[date]) byDate[date] = [];
        byDate[date].push(item);
    });

    // pick midday if exists, else pick the median item
    const selected = [];
    Object.keys(byDate).forEach((date) => {
        const arr = byDate[date];
        // find 12:00:00
        let midday = arr.find((it) => it.dt_txt.includes("12:00:00"));
        if (!midday) {
            // pick the item with time closest to 12:00 (approx)
            midday = arr[Math.floor(arr.length / 2)];
        }
        selected.push(midday);
    });

    // limit to next 5 days (excluding today; we include next days including today trimmed)
    // We'll show up to 5 unique dates (including today if present)
    const show = selected.slice(1, 6);

    // Clear container
    clearChildren(forecastContainer);

    show.forEach((item) => {
    const dateLabel = new Date(item.dt * 1000).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    const temp = item.main?.temp ?? "N/A";
    const wind = item.wind?.speed ?? "N/A";
    const humidity = item.main?.humidity ?? "N/A";
    const icon = item.weather?.[0]?.icon ?? "";
    // create card
    const card = document.createElement("div");
    card.className = "flex flex-col items-center justify-center p-3 rounded-lg bg-slate-800/60";
    card.innerHTML = `
      <div class="font-semibold">${dateLabel}</div>
      <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="icon" />
      <div class="mt-1">${temp.toFixed ? temp.toFixed(1) + " °C" : temp}</div>
      <div class="text-sm mt-1">💨 ${wind} m/s</div>
      <div class="text-sm">💧 ${humidity}%</div>`
    
    forecastContainer.appendChild(card);
  });
}

//search handler--------------------------------------------------
async function handleSearch() {
    const city = (cityInput?.value || "").trim();
    if(!city){
        showError("please enter a city name before searching.")
        return
    }try {
        const [current, forecast] = await Promise.all([getWeatherByCity(city), getForecastByCity(city)])
        displayCurrentWeather(current)
        displayForcast(forecast)
        saveRecentSearch(current.name || city)
    } catch (error) {
        console.log(error);
        showError(error?.message || "failed to fetch weather. check for your network")
    }
}