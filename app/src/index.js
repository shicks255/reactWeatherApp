import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
    constructor(props)
    {
        super(props);
    }
    render()
    {
        return (
            <WeatherCard />
        );
    }
}

class WeatherCard extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            daysOfTheWeek: [0, 1, 2, 3, 4, 5, 6],
        }
    }

    render()
    {
        const days = this.state.daysOfTheWeek;
        let allDays = days.map((step, day) =>
        {
            const box = <DayBox dayOfWeek={step}/>
            return (box);
        });

        return(allDays);
    }
}

class DayBox extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            day: getDayOfWeek(props.dayOfWeek),
            dayNumber: props.dayOfweek
        }
    }
    render()
    {
        const thing = <div className="dayBoxDiv">
            {this.state.day}
        </div>
        return thing;
    }
}

function getDayOfWeek(dayNumber)
{
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