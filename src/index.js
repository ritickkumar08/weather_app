// index.js
// Weather Forecast Application (skySnap)
// Handles API calls, UI updates, and user interactions
//// https://api.openweathermap.org/data/2.5/weather?q=gumla&appid=7ba69110ea3e8a7bf4ad655cdd25a2de&units=metric

//the generated API key from https://openweathermap.org/api
const API_KEY = "7ba69110ea3e8a7bf4ad655cdd25a2de";

//selecting all the need nodes that would be manipulated later -----------------------------------------------------------------------------------
const cityInput      = document.querySelector('inputCity') //points at the input node
const userLocation   = document.querySelector('userLocation') //points at the button for 
const navBar         = document.querySelector('navBar')//pointin at the navigation bar as a whole
const logo           = document.querySelector('logo') //pointing at the logo of the webapp
const detailsArea    = document.querySelector('detailsArea') //points at the whole area where the information about the weather conditions is displayed
const tempratureMain = document.querySelector('tempratureMain') //the area where the information is displayed
const tempIconEl     = tempratureMain?.querySelector('i') || null
const tempTextEl     = tempratureMain?.querySelector('h2') || null
const toggleBtn      = tempratureMain?.querySelector('button[aria-label]') || null

// little info boxes -----------------------------------------------------------------------------------
const windBox        = document.querySelector(".wind") 
const atmosphereBox  = document.querySelector(".atmosphere") 
const temperatureBox = document.querySelector(".temperature") 
const visibilityBox  = document.querySelector(".visibility") 

//some dynamic creations variables -----------------------------------------------------------------------------------
let recentDropDown
let errorPopup
let extremeAlert

//state variables -----------------------------------------------------------------------------------
let currentTempC = null
let isCelsius = true //will be furthur be updated by the users toggles

//utility helpers -----------------------------------------------------------------------------------
function toFahrenhiet(Celsius){
    //formula to convert the data to fahrenhiet.
    return ((Celsius * 9) / 5) + 32
}




// fecth function -----------------------------------------------------------------------------------
//1. fetching the data and returning it in a json format.
async function fetchJSON(url) {
    try {
        const res = await fetch(url)
        if(!res.ok){
            const text = await res.text().catch(()=>"")
            throw new Error (`API error: ${res.status} ${res.statusText} ${txt ? "_" + txt : ""}`)
        }
        return await res.json();
    } catch (error) {
        throw(error)
    }
}

//function to fetch weather by city
async function getWeatherByCity(city){
    if(!city) throw new Error('enter a city name')
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cencodeURIComponent(city)}&appid=${API_KEY}&units=metric` // we are not using await 
    //because we are returning a function call, and the function fetches the url checks for error and then return it to furthur functions.
    return fetchJSON(url)
}

//function to get the forcast data.
async function getWeatherByGeoLocation(city) {
    if(!city) throw new Error("Empty city");
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cencodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    return fetchJSON(url)
}

//function to get the weather by coordinates, that is by location.
async function getWeatherByCoords(lat,lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
    return fetchJSON(url)
}

//function to get forcast by coordinates
async function getForcastByCoords(lat,lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
    return fetchJSON(url)
}


//display functions -----------------------------------------------------------------------------------
function displayCurrentWeather(data){
    if(!data) return;
    //data fields : main.temp, weather[0].main, weather[0].description, name, wind, main.humidity, visibility.
    const name = data.name ? `${data.name}, ${data.sys?.country || ""}` : ""
    const tempC = Number(data.main ?.temp ?? 0)
    currentTempC = tempC
    isCelsius = true //reseting the toggle display to celsius by default when loading new city

    //icon
    const iconCode = data.weather?.[0]?.description || ""
    const weatherMain = data.weather?.[0]?.main || data.weather?.[0]?.description || ""; 

    //build main text
    if(tempTextEl){
        const desc = data.weather?.[0]?.description || ""
        tempTextEl.innerHTML = `${tempC.toFixed(1)} °C <p class="font-light text-3xl">${desc}</p><p class="text-sm mt-1">${name}</p>`;
    }else{
        //
        tempMain.innerHTML = `<div class="ml-6"><img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="icon"><h2>${tempC.toFixed(1)} °C</h2><p>${data.weather?.[0]?.description || ""}</p><p>${name}</p></div>`;
    }
}