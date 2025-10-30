# weather_app
// https://api.openweathermap.org/data/2.5/weather?q=gumla&appid=7ba69110ea3e8a7bf4ad655cdd25a2de&units=metric


//writing the flow of the webapp
1. the user visits.
-> a dialogue box appears asking for the location access.
-> if the user allows the location access fetch the weather data such as temperature, wind information, temperature, atmosphere  and
   visiblity and display them at the dedicated slot.
-> initial display is in degree celsius but the user has a toggle button to switch it to fahrenheit

2. when the user declines the location permission. we continue with normal flow.
-> like displaying the home screen with the weather information of a default se location.
-> in the home page we have an option for user to enter the city name and get the weather information displayed.
-> and also to choose if now they want weather information according to the location access.
 
3. if the user chooses to enter the city namme 
-> we update the information accordingly we also give verdicts depending on the cases such as 
   function classifyWeather(conditionMain) {
   switch (conditionMain.toLowerCase()) {
        case 'clear':
        return 'Sunny';
        case 'clouds':
        return 'Cloudy';
        case 'rain':
        case 'drizzle':
        return 'Rainy';
        case 'thunderstorm':
        return 'Stormy';
        case 'snow':
        return 'Snowy';
        case 'mist':
        case 'haze':
        case 'fog':
        case 'smoke':
        return 'Foggy';
        case 'dust':
        case 'sand':
        case 'ash':
        return 'Dusty';
        case 'tornado':
        case 'squall':
        return 'Extreme';
        default:
        return 'Uncategorized';
        }
    }
    -> also add some emoji accordingly

4. if the user chooses to give permission for the location access we just do the same with the location we get.


5. additionally: 
 -> we have a toggle button to get the weather conditions to fahrenheit.
 -> we will also provide forcast weather for the 5 days in future in same format 
 -> 
