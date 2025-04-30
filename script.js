document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityField").value.trim();
    console.log('Nombre de la ciudad: ', city);

    if (city) {

        Swal.fire({
            title: 'Clima App',
            text: "Buscando información...",
            icon: "info",
            showConfirmButton: false,
            allowOutsideClick: false
        });

        getCoordinates(city);
    } else {

        Swal.fire({
            title: "Clima App",
            text: "Se necesita un nombre de ciudad",
            icon: "error",
        });

        showError("Se necesita un nombre de ciudad");
    }
});

async function getCoordinates(city) {
    console.log('Entra a la función getCoordinates');
    showError("");
    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        console.log('Respuesta de la API search: ', response);

        if (!response.ok) {

            Swal.fire({
                title: "Clima App",
                text: "Ciudad no encontrada",
                icon: "error",
            });

            throw new Error("Ciudad no encontrada");
        }

        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            
            Swal.fire({
                title: "Clima App",
                text: "Ubicación no encontrada",
                icon: "error",
            });
            
            throw new Error("Ubicación no encontrada");
        }

        console.log('Datos de la ubicación: ', data.results[0]);

        const { latitude, longitude, name, country } = data.results[0];

        console.log('Latitud: ', latitude);
        console.log('Longitud: ', longitude);
        console.log('Nombre de la ciudad: ', name);
        console.log('País: ', country);

        getWeather(latitude, longitude, name, country);
    } catch (error) {

        Swal.fire({
            title: "Clima App",
            text: "Se produjo un error al buscar la ciudad",
            icon: "error",
        });

        showError(error.message);
    }
}

async function getWeather(latitude, longitude, city, country) {
    console.log('Entra a la función getWeather');
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        console.log('Respuesta de la API forecast: ', response);

        if (!response.ok) {

            Swal.fire({
                title: "Clima App",
                text: "Error al obtener el clima",
                icon: "error",
            });

            throw new Error("Weather data not available");
        }

        const data = await response.json();

        console.log('Datos del clima: ', data.current_weather);

        displayWeather(data.current_weather, city, country);
    } catch (error) {

        Swal.fire({
            title: "Clima App",
            text: "Error al obtener el clima",
            icon: "error",
        });

        showError(error.message);
    }
}

function displayWeather(weather, city, country) {

    Swal.close();

    console.log('Entra a la función displayWeather');

    const weatherContainer = document.getElementById("weatherContainer");
    const cityHeader = document.getElementById("cityName");
    const temp = document.getElementById("temperature");
    const condition = document.getElementById("condition");
    const windSpeed = document.getElementById("windSpeed");

    const weatherCondition = weatherDescriptions(weather.weathercode);

    weatherContainer.style.display = "block";
    cityHeader.textContent = `${city}, ${country}`;
    temp.textContent = `Temperatura: ${weather.temperature}°C`;
    condition.textContent = `Condición: ${weatherCondition}`;
    windSpeed.textContent = `Velocidad del viento: ${weather.windspeed} km/h`;
}

function showError(message) {
    const weatherContainer = document.getElementById("weatherContainer");
    weatherContainer.style.display = "none";
    const errorPara = document.getElementById("errorMessage");
    errorPara.textContent = message;
}

const weatherDescriptions = (codigo) => {
    switch (codigo) {
        case 0:
            return "Despejado";
        case 1:
            return "Parcialmente nublado";
        case 2:
            return "Nublado";
        case 3:
            return "Lluvia ligera";
        case 4:
            return "Lluvia moderada";
        case 5:
            return "Tormenta eléctrica";
        default:
            return "Desconocido";
    }

    //TODO: Agregar más condiciones para los códigos de clima
    /** Code	Description
        0	Clear sky
        1, 2, 3	Mainly clear, partly cloudy, and overcast
        45, 48	Fog and depositing rime fog
        51, 53, 55	Drizzle: Light, moderate, and dense intensity
        56, 57	Freezing Drizzle: Light and dense intensity
        61, 63, 65	Rain: Slight, moderate and heavy intensity
        66, 67	Freezing Rain: Light and heavy intensity
        71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
        77	Snow grains
        80, 81, 82	Rain showers: Slight, moderate, and violent
        85, 86	Snow showers slight and heavy
        95 *	Thunderstorm: Slight or moderate
        96, 99 *	Thunderstorm with slight and heavy hail 
    */

}