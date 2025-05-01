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
        case 2:
        case 3:
            return "Mayormente soleado";
        case 45:
        case 48:
            return "Niebla y escarcha";
        case 51:
        case 53:
        case 55:
            return "Lluvia ligera";
        case 56:
        case 57:
            return "Lluvia helada ligera";
        case 61:
        case 63:
        case 65:
            return "Lluvia moderada";
        case 66:
        case 67:
            return "Lluvia helada";
        case 71:
        case 73:
        case 75:
            return "Nieve ligera";
        case 77:
            return "Granos de nieve";
        case 80:
        case 81:
        case 82:
            return "Chubascos de lluvia";
        case 85:
        case 86:
            return "Chubascos de nieve";
        case 95:
            return "Tormenta ligera o moderada";
        case 96:
        case 99:
            return "Tormenta con granizo ligero o fuerte";
        default:
            return "Desconocido";
    }
}