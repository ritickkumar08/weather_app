skySnap ☁️
A weather forecasting web app built using JavaScript, Tailwind CSS, and the OpenWeatherMap API.

Overview:
skySnap is a simple yet smart weather forecast web app that brings live weather updates right to your screen.
It automatically detects your location (with permission) or allows you to search by city name.
From temperature and humidity to wind speed and pressure — everything’s displayed cleanly, with dynamic visuals that adapt to the current weather.

goal:- The goal was to create a smooth, interactive, and informative experience using clean UI and logical code flow.

Features :-
-> Location-based weather detection
   -> On first visit, the app asks for location permission.
   -> If granted, it fetches live data for your current city (temperature, wind, atmosphere, and visibility).

-> Manual city search
   -> If location access is denied, you can still search any city manually.
   -> The UI updates instantly with fresh weather data.
   -> A dropdown keeps track of recently searched cities for quick access.

-> Smart weather classification
   -> Weather conditions are grouped into categories like Sunny, Cloudy, Rainy, Stormy, Foggy, etc.
   -> Each category comes with icons and matching background visuals for better experience.

-> Temperature toggle
   -> Switch between °C and °F easily.
   -> The toggle affects only today’s main temperature.

-> Dynamic weather visuals
   -> Backgrounds automatically change according to the current condition (rainy, cloudy, clear, etc.).
   -> Smooth and subtle transitions for a polished look.

-> Extended 5-day forecast
   -> Displays upcoming weather predictions with date, temperature, wind, and humidity in neatly styled cards.

-> Custom alerts
   -> Displays a special alert when extreme temperatures occur (like above 40°C).


JavaScript Flow :

-> Global setup and selectors
      DOM elements like input fields, buttons, and display sections are captured.
      Default background image and temperature unit are initialized.

-> Function: getWeatherByCity(city)
      Takes city name as input.
      etches weather data from OpenWeatherMap using the fetch() API.
      If successful, calls displayWeather(data) to update the UI.
I     If the request fails (e.g., city not found), triggers showError(message).

-> Function: getWeatherByLocation()
      Uses the browser’s navigator.geolocation to get latitude and longitude.
      Sends coordinates to the API to fetch location-based weather data.
      Updates the UI through displayWeather() similar to manual city search.

-> Function: displayWeather(data)
      Extracts details such as temperature, humidity, wind, pressure, and visibility.
      Updates respective DOM elements dynamically.
      Calls setBackground(condition) to update visuals based on weather type.
      Also checks temperature — if above 40°C, triggers a custom alert.

-> Function: setBackground(condition)
      Decides which background image to display based on weather condition (clear, rain, clouds, etc.).
      Updates the main container background dynamically.

-> Function: classifyWeather(condition)
      Converts raw API conditions (like “Drizzle” or “Thunderstorm”) into simplified categories (Sunny, Cloudy, Rainy, etc.).
      Returns a clean label and relevant emoji for display.

-> Function: toggleTemperature()
      Converts temperature between Celsius and Fahrenheit when the toggle button is clicked.
      Updates the label accordingly.

-> Function: storeCity(city) and loadRecentCities()
      Manages recent searches using local/session storage.
      Updates dropdown dynamically.
      Clicking a city name re-fetches its weather data.

-> Function: fetchForecast(city)
      Fetches 5-day forecast data using another API endpoint.
      Calls displayForecast(forecastData) to render forecast cards with date, temperature, wind, and humidity.

-> Event Listeners
      Input box: listens for Enter key to search city.
      “Use Current Location” button: triggers location-based fetch.
      Temperature toggle: switches units.
      Dropdown: loads weather data for selected city.

Tech Stack :
   -> Frontend: HTML, Tailwind CSS
   -> Logic: Vanilla JavaScript
   -> API: OpenWeatherMap API
   -> Version Control: Git & GitHub

How It Works ?
   On load, the app asks for location access.
   If allowed → shows weather for your current location.
   If denied → defaults to a fallback city, and you can search manually.
   Searching for a city updates the display instantly.
   Recently searched cities appear in a dropdown.
   Clicking any saved city refreshes the data.
   The temperature toggle button lets you view readings in °C or °F.
   A 5-day forecast section presents upcoming conditions with relevant icons.

Future Improvements :
   -> Add theme transitions (sunrise/sunset animation).
   -> Integrate air quality index data.
   -> Add voice-based city search for accessibility.
   -> Improve offline fallback support.

Developer : Ritick Kumar
“skySnap — snaps the weather conditions to present to you.” Built with ❤️ and logic.