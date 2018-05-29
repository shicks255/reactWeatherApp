import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
    constructor(props)
    {
        const today = new Date();

        super(props);
        this.state = {
            today: today,
        }
    }
    render()
    {
        return (
            <WeatherCard today={this.state.today} />
        );
    }
}

class WeatherCard extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            nextFiveDays: [0, 1, 2, 3, 4],
            today: props.today,
        }
    }

    render()
    {
        const days = this.state.nextFiveDays;
        let nextFiveDays = days.map((step, day) =>
        {
            const box = <DayBox key={step} today={this.state.today} offset={step}/>
            return (box);
        });

        return(nextFiveDays);
    }
}

class DayBox extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            day: getDayOfWeek(props.today, props.offset),
            date: getDate(props.today, props.offset),
            dayNumber: props.offset
        }
    }
    render()
    {
        const box = <div className="dayBoxDiv">
            {this.state.day}
            <br/>
            {this.state.date}
            <br/>

        </div>
        return box;
    }
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

    if (dayNumber === 0)
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

ReactDOM.render(
    <App />,
    document.getElementById('root')
);