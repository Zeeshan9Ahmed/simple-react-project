import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { getareaChart } from '../store/slices/userSlice';
import moment from "moment"  
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);
const AreaChart = () => {
  const totalGames = useSelector(getareaChart); 
  var totalNumber = []
  var month = []

  totalGames?.map((item ) =>  
      totalNumber.push(item?.game)
  )

  totalGames?.map((item ) => 
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
            text: 'Total Games',
        },
    },
}; 
  const data = {
       labels: month,
       datasets: [
        {
          fill: true,
          label: '',
          data: totalNumber,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
      };
    return (
        <>
           <Line data={data} options={options} style={{ width: 50, height: 50 }} />
        </>
    )
}
export default AreaChart