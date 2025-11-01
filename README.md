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