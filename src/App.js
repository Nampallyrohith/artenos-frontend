import { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    placeData: {},
    city: "Hyderabad",
    hourlyWeather: [],
    forecast: [],
  };

  componentDidMount() {
    this.getWeatherData();
  }

  getWeatherData = async () => {
    const { city } = this.state;
    const option = {
      method: "GET",
    };
    const response = await fetch(`http://localhost:5000/${city}`, option);
    const data = await response.json();
    this.setState({
      placeData: {
        cel: data.current.temp_c,
        fdegree: data.current.temp_f,
        city: data.location.name,
        condition: data.current.condition.text,
        canDo: data.canDo,
        forecast: data.forecast,
        icon: data.current.condition.icon,
      },
      hourlyWeather: data.forecast.forecastday[0].hour,
      forecast: data.forecast.forecastday,
    });
  };

  onChangeCity = (e) => {
    this.setState({ city: e.target.value });
  };

  onSearchGo = (e) => {
    const { city } = this.state;
    e.preventDefault();
    if (city === "") {
      alert("Please Enter City that you want");
    } else {
      this.getWeatherData();
    }
  };

  render() {
    const { placeData, city, hourlyWeather, forecast } = this.state;
    console.log(placeData);
    return (
      <div className="App">
        <h1>Weather App</h1>
        <form onSubmit={this.onSearchGo}>
          <input
            type="search"
            value={city}
            placeholder="Enter City..."
            onChange={this.onChangeCity}
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
  }
}

export default App;
