import { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [placeData, setPlaceData] = useState({});
  const [city, setCity] = useState("Hyderabad");
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    getWeatherData();
  }, []);

  const getWeatherData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/${city}`);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      console.log("API Response:", data);

      // Check if data contains valid placeData
      if (!data || (!data.placeData && (!data.current || !data.location))) {
        throw new Error("Invalid or missing data structure");
      }

      // Fallback to handle different data structures
      const placeData = data.placeData || data;

      setPlaceData({
        cel: placeData.current.temp_c || "N/A",
        fdegree: placeData.current.temp_f || "N/A",
        city: placeData.location.name || "Unknown Location",
        condition: placeData.current.condition?.text || "No Data",
        canDo: placeData.canDo || "No activity suggestion available",
        forecast: placeData.forecast,
        icon: placeData.current.condition?.icon || "",
      });

      setHourlyWeather(placeData.forecast?.forecastday?.[0]?.hour || []);
      setForecast(placeData.forecast?.forecastday || []);
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
    }
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
    <div className="App w-full h-[110vh] flex justify-center items-center flex-col p-5">
      <h1 className="text-3xl font-bold mt-20 my-8">Weather App</h1>
      <form
        onSubmit={onSearchGo}
        className="w-full md:w-4/5 flex flex-col justify-center items-center"
      >
        <div className="flex w-full md:w-3/5 items-center gap-3">
          <input
            type="search"
            value={city}
            placeholder="Enter city, Country (optional)"
            className="w-full px-3"
            onChange={onChangeCity}
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-full bg-gray-700 text-white font-semibold"
          >
            Go
          </button>
        </div>
      </form>

      <div className="h-full w-11/12 md:w-3/4 lg:w-3/5 my-10">
        <div className="weather w-full flex flex-col justify-center items-center border-2 rounded-2xl p-4 bg-transparent  border-gray-500">
          <h3 className="font-semibold text-xl">{placeData.city}</h3>
          <img src={placeData.icon} alt="icon" />
          <p className="cel">
            {`${placeData.cel}`}
            <sup>o</sup>C
          </p>
          <p>{placeData.condition}</p>
          <p>{placeData.canDo}</p>
        </div>
        <div className="hourly-weather w-full">
          <h1 className="text-base font-semibold my-3">Hourly Based</h1>
          <ul className="border-2 rounded-2xl p-4 bg-transparent flex gap-5 border-gray-500 w-full custom-scrollbar">
            {hourlyWeather.map((time, index) => (
              <li key={index} className="min-w-20 min-h-28">
                <div className="flex flex-col justify-between items-center w-full h-full">
                  <p>
                    {new Date(time.time).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      hour12: false,
                    })}
                  </p>
                  <img src={time.condition.icon} alt="icon" />
                  <h4 className="text-base md:text-lg font-semibold">
                    {`${time.temp_c}`}
                    <sup>o</sup>C
                  </h4>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="weather-days  border-2 rounded-2xl bg-transparent border-gray-500">
          <h1 className="text-base font-semibold my-3">2-Day Forecast</h1>
          <ul>
            {forecast.map((day, index) => (
              <li
                key={index}
                className={`${
                  index !== forecast.length - 1 &&
                  "border-0 border-b border-b-gray-500"
                }`}
              >
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
