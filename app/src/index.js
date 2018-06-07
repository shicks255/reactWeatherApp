import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import $ from "jquery";

class App extends React.Component {
    constructor(props)
    {
        const today = new Date();

        super(props);
        this.state = {
            today: today,
            showInfo: null,
        }
    }

    componentDidMount()
    {
        let self = this;
        $.getJSON( 'http://api.openweathermap.org/data/2.5/forecast?zip=08807,us&appid=1724328d4099634fe0e88f74d30f3072',
            function(data)
            {
                self.setState({weather: data});
            });
    }

    render()
    {
        if (this.state.weather)
        {
            const weatherCard = <WeatherCard
                    showInfo={this.state.showInfo}
                    today={this.state.today}
                    weather={this.state.weather}
                    onClick={(step, weather) => this.handleClick(step, weather)}/>

            return (
                <div>
                    {weatherCard}
                    {this.state.showInfo != null && <AdditionalInfo weatherInfo={this.state.weatherInfo} step={this.state.showInfo}/>}
                </div>
            );
        }
        else
            return ('');
    }

    handleClick(step, weather)
    {
        this.setState({
            showInfo: step,
            weatherInfo: weather
        });
    }
}

class WeatherCard extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            nextFiveDays: [0, 1, 2, 3, 4, 5],
        }
    }

    render()
    {
        const days = this.state.nextFiveDays;
        let nextFiveDays = days.map((step, day) =>
        {
            const weatherForDay = getWeatherForDay(this.props.weather, this.props.today, step);
            const box = <DayBox
                key={step}
                today={this.props.today}
                offset={step}
                weather={weatherForDay}
                onClick={(step, weather) => this.props.onClick(step, weather)}
                selected={this.props.showInfo === step}
            />

            return (box);
        });

        return(
            <div className="weatherCard">
                {nextFiveDays}
            </div>
        );
    }
}

class DayBox extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            day: getDayOfWeek(props.today, props.offset),
            date: getDate(props.today, props.offset),
        }
    }

    componentDidMount()
    {
        this.getHigh();
        this.getLow();
    }

    render()
    {
        const selectedDayBox = this.props.selected ?
                'test selected' : 'test';
        console.log(selectedDayBox);
        const box =
            <div className="dayBoxDiv">
                <div className={selectedDayBox} onClick={() => this.props.onClick(this.props.offset, this.props.weather)}>
                    <b>{this.state.day}</b>
                    <br/>
                    {this.state.date}
                    <br/>

                    High: {this.state.high}  {'\u2109'}
                    <br/>
                    Low: {this.state.low} {'\u2109'}

                </div>
            </div>
        return box;
    }

    getHigh()
    {
        let high = 0;
        this.props.weather.map((weatherItem, i) =>
        {
            if (weatherItem.main.temp_max > high)
                high = weatherItem.main.temp_max;
        });

        high = convertToFahrenheit(high);
        this.setState({high: high});
    }

    getLow()
    {
        let low = 1000;
        this.props.weather.map((weatherItem, i) =>
        {
            if (weatherItem.main.temp_min < low)
                low = weatherItem.main.temp_min;
        });

        low = convertToFahrenheit(low);
        this.setState({low: low});
    }
}

class AdditionalInfo extends React.Component {
    render()
    {
        const weather = this.props.weatherInfo.map((weather,i) =>
        {
            const date = new Date(weather.dt_txt);
            let time = date.getHours();
            if (time > 12)
                time = time - 12;
            time -= 4;

            const cloudInfo = getCloudInfo(weather.clouds);
            const rainInfo = getRainInfo(weather.rain);
            const windInfo = getWindInfo(weather.wind);
            const weatherInfo = getWeatherInfo(weather.weather);

            return (
                <div key={i} className="hoursBox">
                    {time}:00
                    <br/>
                    {cloudInfo}
                    <br/>
                    {rainInfo}
                    <br/>
                    {windInfo}
                </div>
            )
        });

        return (
            <div className="addedInfoBox">
                {weather}
            </div>
        );
    }
}

function getCloudInfo(weather)
{
    return weather.all + " % cloud coverage";
}

function getRainInfo(weather)
{
    return weather['3h'] + " inches rain accumlation the past 3 hours.";
}

function getWindInfo(weather)
{
    console.log(weather);

}

function getWeatherInfo(weatherArray)
{

}


//this will filter out only the dates for the parameters
function getWeatherForDay(weather, today, step)
{
    const day = new Date(today);
    day.setDate(day.getDate() + step);

    const year = day.getFullYear();
    let month = day.getMonth() + 1;
    if (month < 10)
        month = "0" + month;
    let date = day.getDate();
    if (date < 10)
        date = "0" + date;
    let dateString = year + "-" + month + "-" + date;

    let weatherThisDay =
        weather.list.filter((weather, i) =>
        {
            return weather.dt_txt.includes(dateString);
        });

    return weatherThisDay;
}

function getDate(today, offset)
{
    const newDate = new Date(today);
    newDate.setDate(newDate.getDate() + offset);

    const dayOfMonth = newDate.getDate();
    const month = newDate.getMonth() + 1;

    return month + "/" + dayOfMonth;
}

function getDayOfWeek(today, offset)
{
    const dayNumber = (today.getDay() + offset);

    if (dayNumber === 0 || dayNumber === 7)
        return "Sunday";
    if (dayNumber === 1 || dayNumber == 8)
        return "Monday";
    if (dayNumber === 2 || dayNumber == 9)
        return "Tuesday";
    if (dayNumber === 3 || dayNumber == 10)
        return "Wednesday";
    if (dayNumber === 4 || dayNumber == 11)
        return "Thursday";
    if (dayNumber === 5 || dayNumber == 12)
        return "Friday";
    if (dayNumber === 6 || dayNumber == 13)
        return "Saturday";
}

function convertToFahrenheit(kelvin)
{
    let far = kelvin * (9/5);
    far -= 459.67;

    return Math.round(far);
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);