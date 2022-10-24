//hooks
import { useState } from 'react'
// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faLocationDot, faDroplet, faWind } from '@fortawesome/free-solid-svg-icons'
// styles
import './App.css';


function App() {
  const [cityInput, setCityInput] = useState('')

  const [cityElement, setCityElement] = useState('')
  const [tempElement, setTempElement] = useState('')
  const [descElement, setDescElement] = useState('')
  const [weatherIconElement, setWeatherIconElement] = useState('')
  const [countryElement, setCountryElement] = useState('')
  const [humidityElement, setHumidityElement] = useState('')
  const [windElement, setWindElement] = useState('')

  const [errorGetData, setErrorGetData] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [backgroundImg, setBackgrounImg] = useState('')



  const getBackgroundPhoto = async (search) => {
    const apiURL = `https://api.unsplash.com/photos/random?query=${search}&orientation=landscape&client_id=${process.env.REACT_APP_UNSPLASH_KEY}`
    const res = await fetch(apiURL)
    const data = await res.json()
    setBackgrounImg(data.urls.raw)
  }


  const getWeatherData = async (city) => {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt&appid=${process.env.REACT_APP_OPENWEATHER_KEY}`
    const res = await fetch(apiURL)
    const data = await res.json()
    console.log(data)
    if (data.cod === '400') {
      setErrorGetData(true)
      return setErrorMessage('Você precisa buscar pelo nome de uma cidade!')
    } else if (data.cod === '404') {
      setErrorGetData(true)
      return setErrorMessage(`Nenhum resultado encontrado para: ${city}`)
    } else {
      setErrorGetData(false)
    }

    try {
      await getBackgroundPhoto(city)
    } catch (error) {
      console.log(error)
    }

    return data
  }

  const showWeatherData = async (city) => {
    
    const data = await getWeatherData(city)

    setCityElement(data.name)
    setTempElement(parseInt(data.main.temp))
    setDescElement(data.weather[0].description)
    setWeatherIconElement(`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`)
    setCountryElement(`https://countryflagsapi.com/png/${data.sys.country}`)
    setHumidityElement(`${data.main.humidity}%`)
    setWindElement(`${data.wind.speed} km/h`)
  }

  const handleClickButton = (e) => {
    e.preventDefault()
    showWeatherData(cityInput)
  }

  return (
    <div className="App">
      {
        backgroundImg && <style>{`body{ background-image: url(${backgroundImg});}`}</style>
      }
      <div className="container">
        <form className="form" onSubmit={handleClickButton}>
          <h2>Veja o clima de qualquer cidade em tempo real</h2>
          <div className="form-input-container">
            <input
              type="text"
              placeholder='Digite o nome de uma cidade'
              onChange={(e) => setCityInput(e.target.value)}
            />
            <button type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </form>
        <div id='error' className={errorGetData ? '' : 'hide'}>
          <p>{errorMessage}</p>
        </div>
        <div id="weather-data" className={cityElement ? '' : 'hide'}>
          <h3>
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{cityElement}</span>
            <img src={countryElement} alt="Country flag" id='country' />
          </h3>
          <p id="temperature">
            <span>{tempElement}</span>&deg;C
          </p>
          <div id="description-container">
            <p id="description">{descElement}</p>
            <img src={weatherIconElement} alt="Weather conditions" id="weather-icon" />
          </div>
          <div id="details-container">
            <p id="humidity">
              <FontAwesomeIcon icon={faDroplet} />
              <span>{humidityElement}</span>
            </p>
            <p id="wind">
              <FontAwesomeIcon icon={faWind} />
              <span>{windElement}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
