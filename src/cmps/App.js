import React, { Component } from 'react'
import classes from './app.module.scss';
import { Chart } from 'chart.js';
import axios from 'axios';
import Button from './AddDataSetButton';

const defaultPath = 'https://api.covid19api.com/world?from=';

class App extends Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
        this.state = {
            dates: [],
            confirmed: [],
            from: '2020-1-22',
            to: this.formatDate(new Date()) , 
            dataset : null 
        }
        console.log(this.state);
        this.addDataset = this.addDataset.bind(this);

    }
    parseDate(dateStr) {
        const ymd = dateStr.split('-');
        return new Date(ymd[0], ymd[1] - 1, ymd[2]);
    }
    datedDiff(first, second) {
        return Math.round((second - first) / (1000 * 60 * 60 * 24));
    }
    async addDataset() {
       try{     
        const response = await axios.get('https://pomber.github.io/covid19/timeseries.json');
        let resultPerDate = {};
        for (const key in response.data) {
            if (response.data.hasOwnProperty(key)) {
                for (let item of response.data[key]) {
                    if (resultPerDate[item.date]) {
                        resultPerDate = {
                            ...resultPerDate,
                            [item.date]: resultPerDate[item.date] + item.confirmed
                        }
                    } else {
                        resultPerDate = {
                            ...resultPerDate,
                            [item.date]: item.confirmed
                        }
                    }

                }
            }
        }
        console.log(resultPerDate);
        const dates = [];
        const confirmed = [];
        for (const key in resultPerDate) {
            if (resultPerDate.hasOwnProperty(key)) {
                const conf = resultPerDate[key];
                dates.push(key);
                confirmed.push(conf)
            }
        }
        this.setState({
            dataset: resultPerDate,
            dates: dates,
            confirmed: confirmed
        });
        console.log(this.state);
       }catch(error) { 
           console.log('Error is ?? [ Amir is here]' , error) ; 
       }
    }

    formatDate(date) {
        let month = '' + (date.getMonth() + 1);
        let day = '' + (date.getDate());
        let year = '' + (date.getFullYear());

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }

        return [year, month, day].join('-')
    }


    componentDidMount() {
        const allCases = this.state.dataset ? this.state.confirmed : [];
        const alldays = this.state.dataset ? this.state.dates : ['day1', 'day2', 'day3'];
        const ctx = this.chartRef.current.getContext('2d');
        new Chart(ctx, {
            type: "bar",
            data: {
                //Bring in data
                labels: alldays,
                datasets: [
                    {
                        label: "Corona virus In the World",
                        data: allCases,
                        backgroundColor: this.getBackgroundColors(),
                        borderColor: this.getBorderColors(),
                        borderCapStyle: 'butt',

                    }
                ]
            },
            options: {
                //Customize chart options
            }
        });
    }
    getBackgroundColors() {
        const materialColors =  [
            '#EF9A9A',
            '#64B5F6',
            '#FFECB3',
            '#DCEDC8',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            '#E57373',
            '#E1BEE7',
            '#9FA8DA',
            '#81D4FA',
            '#81C784',
            '#E6EE9C',
            '#FFEE58',
            '#CFD8DC',
            '#A7FFEB']

        const colors = [];
        for (let idx = 0; idx<this.state.confirmed.length; idx++) {
            colors.push(materialColors[Math.round(Math.random(14) * 10)]);
        }
        return colors;
    }
    getBorderColors() {
        const materialColors = [
            '#C62828',
            '#1565C0',
            '#FF6F00',
            '#33691E',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            '#D81B60',
            '#4527A0',
            '#1A237E',
            '#01579B',
            '#1B5E20',
            '#827717',
            '#F9A825',
            '#37474F',
            '#004D40'
        ]

        const colors = [];
        for (let idx = 0; idx < this.state.confirmed.length; idx++) {
            colors.push(materialColors[Math.round(Math.random(14) * 10)]);
        }
        return colors;
    }
    componentDidUpdate() {
        const allCases = this.state.dataset ? this.state.confirmed : [];
        const alldays = this.state.dataset ? this.state.dates : ['day1', 'day2', 'day3'];
        const ctx = this.chartRef.current.getContext('2d');
        new Chart(ctx, {
            type: "bar",
            data: {
                //Bring in data
                labels: alldays,
                datasets: [
                    {
                        label: "Confirmed Cases ",
                        data: allCases,
                        backgroundColor: this.getBackgroundColors(),
                        borderColor: this.getBorderColors(),
                        borderWidth: 1
                    }
                ]
            },
            options: {
                onHover: (event) => {
                    event.target.style.cursor = 'pointer'
                }
            }
        });
    }
    render() {
        return (
            <div className={classes.root}>
                <a 
                  className={classes.root_label}
                  href='https://github.com/AmirAhmadzadeh/corona-virus-charts'
                   >
                    AMIRHOSEYN <br /> AHMADZADEH
                </a>
                <canvas
                    ref={this.chartRef}
                    id='canvas'
                    height='220'
                    width='500'></canvas>

                <Button
                    onAddDataset={this.addDataset}
                    text='Show Data'
                />
            </div>
        )
    }
}


export default App; 