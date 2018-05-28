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
            const div = <div className="dayBoxDiv" key={step}>Here</div>;
            return (div);
        });

        return(allDays);
    }
}

class DayBox extends React.Component {
    constructor(props)
    {
        super(props);
    }
    render()
    {
        return('this is a day box');
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);