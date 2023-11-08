import React from 'react'
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { getlineChart } from '../store/slices/userSlice';
import moment from "moment"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
const LineChart = () => {
    const totalUsers = useSelector(getlineChart);
    var totalNumber = []
    var month = []

    totalUsers?.map((item) =>
        totalNumber.push(item?.users)
    )

    totalUsers?.map((item) =>
        month.push(moment(item?.month).format("MMM"))
    )
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top',

            },
            title: {
                display: true,
                text: 'Total Users',
            },
        },
    };
    const labels = month;

    const data = {
        labels,
        datasets: [
            {
                label: '',
                data: totalNumber,
                borderColor: 'rgb(100%, 35%, 54%)',
                backgroundColor: 'rgb(100%, 35%, 54%)',
            },
        ],
    };
    return (
        <>
            <Line
                options={options}
                data={data}
            />
        </>
    )
}
export default LineChart