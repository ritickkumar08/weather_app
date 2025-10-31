// index.js
// Weather Forecast Application (skySnap)
// Handles API calls, UI updates, and user interactions
//// https://api.openweathermap.org/data/2.5/weather?q=gumla&appid=7ba69110ea3e8a7bf4ad655cdd25a2de&units=metric

//the generated API key from https://openweathermap.org/api
const API_KEY = "7ba69110ea3e8a7bf4ad655cdd25a2de";

//selecting all the need nodes that would be manipulated later -----------------------------------------------------------------------------------
const inputCity = document.querySelector('.inputCity') //points at the input node
const useLocationBtn = document.querySelector('.userLocation') //points at the button for 
const nav = document.querySelector('nav')//pointin at the navigation bar as a whole
const detailsArea = document.querySelector('.detailsArea') //points at the whole area where the information about the weather conditions is displayed
const tempratureMain = document.querySelector('.tempratureMain') //the area where the information is displayed
const tempIconEl = tempratureMain?.querySelector('i') || null
const tempTextEl = tempratureMain?.querySelector('h2') || null
const toggleBtn = tempratureMain?.querySelector('button[aria-label]') || null


// console.log({ tempratureMain, cityInput, navBar, detailsArea });

//info boxes -----------------------------------------------------------------------------------
const windBox = document.querySelector(".wind")
const atmosphereBox = document.querySelector(".atmosphere")
const temperatureBox = document.querySelector(".temperature")
const visibilityBox = document.querySelector(".visibility")

//to render forecast cards: creates container under detailsArea
let forecastContainer = document.querySelector(".forecastContainer")
if (!forecastContainer) {
    forecastContainer = document.createElement("section")
    // forecastContainer.className = "forecastContainer max-w-6xl mx-auto grid grid-row-5 sm:grid-cols-5 gap-4 mt-6 px-4 py-6 border-2 rounded-2xl shadow-xl shadow-slate-600"
    // Insert after the grid inside detailsArea if possible, otherwise append
    const main = document.querySelector("main");
    const detailsArea = document.querySelector(".detailsArea");
    // Insert forecastContainer inside main, right after detailsArea
    main.insertBefore(forecastContainer, detailsArea.nextSibling);
}


//some dynamic creations variables -----------------------------------------------------------------------------------
let recentDropdown
let errorPopup
let extremeAlert

//state variables -----------------------------------------------------------------------------------
let currentTempC = null
let isCelsius = true //will be furthur be updated by the users toggles
const RECENT_KEY = "skySnap_recentCities";
const MAX_RECENTS = 6;

//utility helpers -----------------------------------------------------------------------------------
function cToF(Celsius) {
    //formula to convert the data to fahrenhiet.
    return ((Celsius * 9) / 5) + 32
}

function formatDateFromUnix(ts) {
    const d = new Date(ts * 1000)
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
}

function clearChildren(el) {
    while (el.firstChild) el.removeChild(el.firstChild)
}


// ---------- Error UI ----------
function ensureErrorPopup() {
    if (errorPopup) return
    errorPopup = document.createElement("div")
    errorPopup.id = "skysnap_error"
    errorPopup.className = "fixed left-1/2 -translate-x-1/2 top-8 z-50 p-4 rounded-lg shadow-lg text-black hidden"
    errorPopup.style.background = "linear-gradient(90deg,#ffefb5,#ffb5b5)"
    errorPopup.style.minWidth = "260px"
    errorPopup.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)"
    document.body.appendChild(errorPopup)
}

function showError(message, timeout = 5000) {
    ensureErrorPopup()
    errorPopup.innerHTML = `<strong class="block mb-1">Error</strong><div>${message}</div>`
    errorPopup.classList.remove("hidden")
    if (errorPopup.hideTimeout) clearTimeout(errorPopup.hideTimeout)
    errorPopup.hideTimeout = setTimeout(() => {
        errorPopup.classList.add("hidden")
    }, timeout);
}
// ---------- Extreme temp alert ----------
function ensureExtremeAlert() {
    if (extremeAlert) return
    extremeAlert = document.createElement("div")
    extremeAlert.id = "skysnap_extreme"
    extremeAlert.className = "fixed right-4 bottom-4 z-40 p-3 rounded-lg shadow-lg text-white hidden"
    extremeAlert.style.background = "linear-gradient(90deg,#ff4d4d,#ff9900)"
    extremeAlert.style.boxShadow = "0 8px 30px rgba(0,0,0,0.4)"
    document.body.appendChild(extremeAlert)
}

function showExtremeAlert(message, timeout = 6000) {
    ensureExtremeAlert()
    extremeAlert.innerHTML = `<strong>Alert</strong><div>${message}</div>`
    extremeAlert.classList.remove("hidden")
    if (extremeAlert.hideTimeout) clearTimeout(extremeAlert.hideTimeout)
    extremeAlert.hideTimeout = setTimeout(() => {
        extremeAlert.classList.add("hidden")
    }, timeout)
}


// ---------- Recent searches dropdown ----------
function ensureRecentDropdown() {
    if (recentDropdown) return recentDropdown;

    // Create wrapper
    recentDropdown = document.createElement("div")
    recentDropdown.className = "recentDropdown relative inline-block ml-3"
    recentDropdown.innerHTML = `
    <button class="recentToggle bg-slate-800 px-4 py-2 rounded-md">Recent ▼</button>
    <div class="recentList absolute right-0 mt-2 w-44 bg-slate-900 text-slate-50 rounded-md p-2 shadow-lg hidden"></div>`

    // append to nav if exists, otherwise to header
    const navUl = nav?.querySelector("ul")
    if (navUl) {
        const li = document.createElement("li")
        li.appendChild(recentDropdown)
        navUl.appendChild(li)
    } else {
        document.querySelector(".navBar")?.appendChild(recentDropdown)
    }

    // toggle behavior
    const toggle = recentDropdown.querySelector(".recentToggle")
    const list = recentDropdown.querySelector(".recentList")
    toggle.addEventListener("click", (e) => {
        e.stopPropagation()
        list.classList.toggle("hidden")
        populateRecentList()
    });

    // click outside closes it
    document.addEventListener("click", (e) => {
        if (!recentDropdown.contains(e.target)) {
            list.classList.add("hidden")
        }
    });

    return recentDropdown
}

function saveRecentSearch(city) {
    if (!city) return
    const raw = localStorage.getItem(RECENT_KEY)
    let arr = raw ? JSON.parse(raw) : []
    // normalize city (case-insensitive)
    const normalized = city.trim()
    arr = arr.filter((c) => c.toLowerCase() !== normalized.toLowerCase())
    arr.unshift(normalized)
    if (arr.length > MAX_RECENTS) arr = arr.slice(0, MAX_RECENTS)
    localStorage.setItem(RECENT_KEY, JSON.stringify(arr))
    populateRecentList()
}

function loadRecentSearches() {
    ensureRecentDropdown()
    populateRecentList()
}

function populateRecentList() {
    ensureRecentDropdown()
    const list = recentDropdown.querySelector(".recentList")
    clearChildren(list)
    const raw = localStorage.getItem(RECENT_KEY)
    const arr = raw ? JSON.parse(raw) : []
    if (!arr || arr.length === 0) {
        list.innerHTML = `<div class="text-sm text-slate-400 p-2">No recent searches</div>`
        return;
    }
    arr.forEach((city) => {
        const btn = document.createElement("button")
        btn.className = "block w-full text-left px-2 py-1 rounded hover:bg-slate-800"
        btn.textContent = city
        btn.addEventListener("click", () => {
            list.classList.add("hidden")
            inputCity.value = city
            handleSearch()
        })
        list.appendChild(btn)
    })

    // Clear recent button
    const clr = document.createElement("button")
    clr.className = "mt-2 block px-2 py-1 text-sm text-amber-200 hover:underline"
    clr.textContent = "Clear recent"
    clr.addEventListener("click", () => {
        localStorage.removeItem(RECENT_KEY)
        populateRecentList()
    })
    list.appendChild(clr)
}

// ---------- Background switching ----------
// Sets background image for the main details area based on weather condition + time (day/night)
function setBackground(condition, icon = "") {
  const c = (condition || "").toLowerCase()
  const isNight = icon.endsWith("n")
  let imagePath = "/src/resources/default.jpg"

  if (c.includes("thunder")) imagePath = "/src/resources/thunder.jpg"
  else if (c.includes("rain") || c.includes("drizzle")) imagePath = "/src/resources/rainy.jpg"
  else if (c.includes("snow")) imagePath = "/src/resources/snow.jpg"
  else if (c.includes("mist") || c.includes("fog") || c.includes("haze")) imagePath = "/src/resources/mist.jpg"
  else if (c.includes("cloud")) imagePath = isNight ? "/src/resources/night-cloudy.jpg" : "/src/resources/cloudy.jpg"
  else if (c.includes("clear")) imagePath = isNight ? "/src/resources/night-clear.jpg" : "/src/resources/clear.jpg"

  const detailsArea = document.querySelector(".detailsArea")
  if (detailsArea) {
    detailsArea.style.backgroundImage = `url('${imagePath}')`
    detailsArea.style.backgroundSize = "cover"
    detailsArea.style.backgroundPosition = "center"
    detailsArea.style.backgroundRepeat = "no-repeat"
    detailsArea.style.transition = "background-image 0.8s ease-in-out"
  } else {
    console.warn("detailsArea not found for background update")
  }
}

// get only the background image path for a condition to be used inside the forecast grids
function getBackgroundImageForForecast(condition, icon = "") {
  const c = (condition || "").toLowerCase();
  const isNight = icon.endsWith("n");

  if (c.includes("thunder")) return "/src/resources/thunder.jpg";
  if (c.includes("rain") || c.includes("drizzle")) return "/src/resources/rainy.jpg";
  if (c.includes("snow")) return "/src/resources/snow.jpg";
  if (c.includes("mist") || c.includes("fog") || c.includes("haze")) return "/src/resources/mist.jpg";
  if (c.includes("cloud")) return isNight ? "/src/resources/night-cloudy.jpg" : "/src/resources/cloudy.jpg";
  if (c.includes("clear")) return isNight ? "/src/resources/night-clear.jpg" : "/src/resources/clear.jpg";
  return "/src/resources/default.jpg";
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
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric` // we are not using await 
    //because we are returning a function call, and the function fetches the url checks for error and then return it to furthur functions.
    return fetchJSON(url)
}

//function to get the forcast data.
async function getForecastByCity(city) {
    if (!city) throw new Error("Empty city");
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    return fetchJSON(url)
}

//function to get the weather by coordinates, that is by location.
async function getWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    return fetchJSON(url)
}

//function to get forcast by coordinates
async function getForecastByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
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
    const icon = data.weather?.[0]?.icon; 
    // console.log(icon);
    // console.log(iconCode);

    //build main text
    if (tempTextEl) {
        const desc = data.weather?.[0]?.description || ""
        tempTextEl.innerHTML = `${tempC.toFixed(1)} °C <p class="font-light text-3xl">${desc}</p><p class="text-sm mt-1">${name}</p>`;
    } else {
        tempMain.innerHTML = `<div class="ml-6"><img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="icon"><h2>${tempC.toFixed(1)} °C</h2><p>${data.weather?.[0]?.description || ""}</p><p>${name}</p></div>`;
    }

    //wind box
    if (windBox) {
        const speed = data.wind?.speed ?? "N/A"
        const deg = data.wind?.deg ?? "N/A";

        // getting the direction for the wind
        let dirLabel = "N/A";
        if (deg !== "N/A") {
            const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
            dirLabel = directions[Math.round(deg / 45) % 8];
        }

        windBox.innerHTML = `
        <div class="bg-black/40 p-3 text-sm sm:text-base rounded-xl">
            <h3 class="text-lg sm:text-xl mb-2">💨Wind</h3>
            <p>Wind Speed : ${speed} m/s</p>
            <p>Direction : ${deg}° ${dirLabel}</p>
        </div>`
    }

    //atmosphere
    if (atmosphereBox) {
        const humidity = data.main?.humidity ?? "N/A";
        const pressure = data.main?.pressure ?? "N/A";
        atmosphereBox.innerHTML = `
        <div class="bg-black/40 p-3 text-sm sm:text-base rounded-xl">
            <h3 class="text-lg sm:text-xl mb-2">☁️🌁Atmosphere</h3>
            <p>Humidity : ${humidity}%</p>
            <p>Pressure : ${pressure} hPa</p>
        </div>`
    }

    //temperature details
    if (temperatureBox) {
        const feels = data.main?.feels_like ?? "N/A";
        const temp = data.main?.temp ?? null;
        const humidity = data.main?.humidity ?? null;

        // Approximate dew point calculation using Magnus formula (only if temp & humidity exist)
        let dewPoint = "N/A";
        if (temp !== null && humidity !== null) {
            const a = 17.27;
            const b = 237.7;
            const alpha = (a * temp) / (b + temp) + Math.log(humidity / 100);
            dewPoint = (b * alpha) / (a - alpha);
            dewPoint = dewPoint.toFixed(1) + " °C";
        }
        temperatureBox.innerHTML = `
        <div class="bg-black/40 p-3 text-sm sm:text-base rounded-xl">
            <h3 class="text-lg sm:text-xl mb-2">🔥❄️Temperature</h3>
            <p>Feels Like : ${feels} °C</p>
            <p>Dew Point : ${dewPoint}</p>
        </div>`
    }

    // visibility / precipitation
    if (visibilityBox) {
        const vis = data.visibility ?? "N/A";
        visibilityBox.innerHTML = `
        <div class="bg-black/40 p-3 text-sm sm:text-base rounded-xl">
            <h3 class="text-lg sm:text-xl mb-2">🌁🔭Visibility</h3>
            <p>Visibility : ${vis === "N/A" ? "N/A" : (vis / 1000).toFixed(1) + " km"}</p>
        </div>`
    }

    //background switch
    setBackground(weatherMain,icon);

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
function displayForecast(forecastData) {
    if (!forecastData || !forecastData.list) {
        forecastContainer.innerHTML = "<div class='col-span-5'>No forecast data</div>"
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
        const weatherMain = item.weather?.[0]?.main || item.weather?.[0]?.description || "";
        // get matching background image for each forecast card
        const bgImage = getBackgroundImageForForecast(weatherMain,icon);

        // create card with dynamic background image
        const card = document.createElement("div");
        card.className = "flex flex-col items-center justify-center p-3 rounded-lg text-white shadow-md shadow-slate-700 hover:scale-105 transition-transform duration-200";
        card.style.backgroundImage = `url('${bgImage}')`;
        card.style.backgroundSize = "cover";
        card.style.backgroundPosition = "center";
        card.style.backgroundBlendMode = "overlay";
        card.style.backgroundColor = "rgba(0,0,0,0.5)";
        card.innerHTML = `
            <div class="font-semibold">${dateLabel}</div>
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="icon" />
            <div class="mt-1">${temp.toFixed ? temp.toFixed(1) + " °C" : temp}</div>
            <div class="text-sm mt-1">💨Wind : ${wind} m/s</div>
            <div class="text-sm">💧Humidity : ${humidity}%</div>`

        forecastContainer.appendChild(card);
    });
}

//search handler--------------------------------------------------
async function handleSearch() {
    const city = (inputCity?.value || "").trim();
    if (!city) {
        showError("please enter a city name before searching.")
        return
    } try {
        const [current, forecast] = await Promise.all([getWeatherByCity(city), getForecastByCity(city)])
        displayCurrentWeather(current)
        displayForecast(forecast)
        saveRecentSearch(current.name || city)
    } catch (error) {
        console.log(error);
        showError(error?.message || "failed to fetch weather. check for your network")
    }
}

//toggle button for the unit chnage -----------------------------------------------------------
function setupToggle() {
    if (!toggleBtn) return
    toggleBtn.addEventListener("click", () => {
        if (currentTempC == null) return;
        isCelsius = !isCelsius
        if (isCelsius) {
            //show C
            if (tempTextEl) {
                tempTextEl.innerHTML = `${currentTempC.toFixed(1)} °C ${tempTextEl.querySelector ? tempTextEl.querySelector("p")?.outerHTML ?? "" : ""}`;
            }
            toggleBtn.textContent = "°C"
        } else {
            //show F
            const f = cToF(currentTempC);
            if (tempTextEl) {
                tempTextEl.innerHTML = `${f.toFixed(1)} °F ${tempTextEl.querySelector ? tempTextEl.querySelector("p")?.outerHTML ?? "" : ""}`;
            }
            toggleBtn.textContent = "°F";
        }
    })
}


//geolocation flow------------------------------------------------------------------------
function handleGeoLocation() {
    if (!navigator.geolocation) {
        showError("geolocation is not supported by your browser")
        return
    }
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const [current, forecast] = await Promise.all([getWeatherByCoords(latitude, longitude), getForecastByCoords(latitude, longitude)])
                displayCurrentWeather(current)
                displayForecast(forecast)
                saveRecentSearch(current.name || `${latitude.toFixed(2)},${longitude.toFixed(2)}`)
            } catch (error) {
                console.error(err)
                showError("unable to fetch weather for current location" + (err.message || ""))
            }
        },
        (err) => {
            console.error(err);
            showError("Permission denied or unable to get your location")
        },
        { enableHighAccuracy: false, timeout: 8000 }
    )
}

//Input enter Key handling
if (inputCity) {
    inputCity.addEventListener("keyup", (e) => {
        if (e.key === "Enter") handleSearch()
    })
}

// click handlers
if (useLocationBtn) useLocationBtn.addEventListener("click", handleGeoLocation);

// wire up toggle
setupToggle();

//load recent page load
window.addEventListener("load", () => {
    try {
        loadRecentSearches();
    } catch (error) {
        console.warn("failed to load recent searches", error);
    }
})