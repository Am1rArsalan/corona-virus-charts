import React, { useRef, useState , useEffect} from 'react' ; 
import MyChart from './chart';
import pomber from '../api';
import { Chart } from 'chart.js';
import {
    extractDataSet, extractDatesAndConfirmed,
    getRandomBackgroundColor, getRandomBorderColor, formatDate
} from './helper'
import WithClass from './WithClass';
import Button from './button';
import classes from './mychart.module.scss';


export default function (props) {
    const [confirmed, setConfirmed] = useState([]);
    const [dates, setDates] = useState([]);
    const [dataset, setDataset] = useState(null);
    const [from, setFrom] = useState('2020-1-22');
    const [to, setTo] = useState(formatDate(new Date()));
    const chartRef = useRef();

    useEffect(() => {
        console.log('Amir In Effect !!');
        const allCases = dataset ? confirmed : [];
        const alldays = dataset ? dates : ['day1', 'day2', 'day3'];
        const ctx = chartRef.current.getContext('2d');
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: alldays,
                datasets: [
                    {
                        label: "Total Corona Cases That Confirmed ",
                        data: allCases,
                        backgroundColor: getRandomBackgroundColor(confirmed.length),
                        borderColor: getRandomBorderColor(confirmed.length),
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
    }, [dates, confirmed, from, to, dataset])
    async function addDataset() {
        try {
            const response = await pomber.get('/covid19/timeseries.json');
            let resultPerDate = extractDataSet(response.data);
            const { dates, confirmed } = extractDatesAndConfirmed(resultPerDate);
            setDataset(resultPerDate);
            setDates(dates);
            setConfirmed(confirmed);
        } catch (error) {
            console.log('Error is ?? [ In Add Dataset function ]', error);
        }
    }

    return (
        <WithClass>
            <h1 className={classes.root_header}>
                {props.chartTitle}
            </h1>
            <MyChart
                chartRef={chartRef}
                chartId='world'
                height='210'
                width='500'
            />
            <WithClass classes={classes.root_btnsArea}>
                <Button
                    onAddDataset={addDataset}
                    text='Add dataset'
                />
            </WithClass>
        </WithClass>
    );
}



