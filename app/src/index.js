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

            console.log(this.state.showInfo);
            const addInfo = this.state.showInfo == null ?
                '' : <AdditionalInfo weather={this.state.weatherInfo} step={this.state.showInfo}/>;

            return (
                <div>
                    {weatherCard}
                    {addInfo}
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
            today: props.today,
            weather: props.weather,
            showInfo: props.showInfo,
        }
    }

    render()
    {
        const days = this.state.nextFiveDays;
        let nextFiveDays = days.map((step, day) =>
        {
            const weatherForDay = getWeatherForDay(this.state.weather, this.state.today, step);
            const box = <DayBox
                key={step}
                today={this.state.today}
                offset={step}
                weather={weatherForDay}
                onClick={(step, weather) => this.props.onClick(step, weather)}
                showInfo={this.state.showInfo}
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
            dayNumber: props.offset,
            weather: props.weather,
            showInfo: props.showInfo,
        }
    }

    componentDidMount()
    {
        this.getHigh();
        this.getLow();
    }

    render()
    {
        const box =
            <div className="dayBoxDiv">
                <div className="test" onClick={(step, weather) => this.props.onClick(this.state.dayNumber, this.state.weather)}>
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
        this.state.weather.map((weatherItem, i) =>
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
        this.state.weather.map((weatherItem, i) =>
        {
            if (weatherItem.main.temp_min < low)
                low = weatherItem.main.temp_min;
        });

        low = convertToFahrenheit(low);
        this.setState({low: low});
    }
}

class AdditionalInfo extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            weatherInfo: props.weatherInfo,
            step: props.showInfo,
        }
    }

    render()
    {
        return (
            <div>penis</div>
        );
    }
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
    if (dayNumber === 1)
        return "Monday";
    if (dayNumber === 2)
        return "Tuesday";
    if (dayNumber === 3)
        return "Wednesday";
    if (dayNumber === 4)
        return "Thursday";
    if (dayNumber === 5)
        return "Friday";
    if (dayNumber === 6)
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