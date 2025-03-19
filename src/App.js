import { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [placeData, setPlaceData] = useState({});
  const [city, setCity] = useState("Hyderabad");
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    if (city) {
      getWeatherData();
    }
  }, [city]);

  const getWeatherData = async () => {
    const response = await fetch(`http://localhost:5000/${city}`);
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    console.log("API Response:", data);

    if (!data.placeData || !data.placeData.current) {
      throw new Error("Invalid data structure");
    }

    setPlaceData({
      cel: data.placeData.current.temp_c,
      fdegree: data.placeData.current.temp_f,
      city: data.placeData.location.name,
      condition: data.placeData.current.condition.text,
      canDo: data.placeData.canDo || "No activity suggestion available",
      forecast: data.placeData.forecast,
      icon: data.placeData.current.condition.icon,
    });
    setHourlyWeather(data.placeData.forecast.forecastday[0]?.hour || []);
    setForecast(data.placeData.forecast.forecastday || []);
  };

  const onChangeCity = (e) => {
    setCity(e.target.value);
  };

  const onSearchGo = (e) => {
    e.preventDefault();
    if (!city) {
      alert("Please enter a city");
    } else {
      getWeatherData();
    }
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <form onSubmit={onSearchGo}>
        <input
          type="search"
          value={city}
          placeholder="Enter City..."
          onChange={onChangeCity}
        />
        <button type="submit">Go</button>
      </form>

      <div className="weather-container">
        <div className="weather">
          <h3>{placeData.city}</h3>
          <img src={placeData.icon} alt="icon" />
          <p className="cel">
            {`${placeData.cel}`}
            <sup>o</sup>C
          </p>
          <p>{placeData.condition}</p>
          <p>{placeData.canDo}</p>
        </div>
        <div className="hourly-weather">
          <span>Hourly Based</span>
          <ul>
            {hourlyWeather.map((time, index) => (
              <li key={index}>
                <div>
                  <p>
                    {new Date(time.time).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      hour12: false,
                    })}
                  </p>
                  <img src={time.condition.icon} alt="icon" />
                  <h4>
                    {`${time.temp_c}`}
                    <sup>o</sup>C
                  </h4>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="weather-days">
          <span>2-Day Forecast</span>
          <ul>
            {forecast.map((day, index) => (
              <li key={index}>
                <div>
                  <p>
                    {new Date(day.date).toLocaleDateString("en-GB", {
                      weekday: "short",
                    })}
                  </p>
                  <img src={day.day.condition.icon} alt="icon" />
                  <div className="min-max">
                    <p>
                      {`${day.day.mintemp_c}`}
                      <sup>o</sup>C (min)
                    </p>
                    <p>
                      {`${day.day.maxtemp_c}`}
                      <sup>o</sup>C (max)
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
