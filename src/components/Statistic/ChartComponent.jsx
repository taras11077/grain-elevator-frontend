import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import React from 'react'
import { Bar } from 'react-chartjs-2'

const ChartComponent = ({ data, title }) => {
	Chart.register(CategoryScale);
    const chartData = {
        labels: Object.keys(data), // Назви постачальників або продуктів
        datasets: [
            {
                label: 'Фізична вага',
                data: Object.values(data), // Значення фізичної ваги
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
                font: {
                    size: 20, 
                },
                color: 'steelblue', 
                padding: {
                    top: 10,
                    bottom: 20, 
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default ChartComponent;
