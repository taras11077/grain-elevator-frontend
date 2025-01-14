import React from 'react';
import { Line } from 'react-chartjs-2';

const SupplierTimelineChart = ({ data, title }) => {
    if (!data || Object.keys(data).length === 0) {
        return <p style={{ textAlign: 'center' }}>Дані для побудови графіка відсутні.</p>;
    }

	 // Функція для форматування дат
	 const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
        }); // Формат DD.MM
    };

	const labels = Object.keys(Object.values(data)[0]).map(formatDate);

	// Створення datasets для кожного продукту
	const datasets = Object.entries(data).map(([supplierName, timelineData]) => ({
		label: supplierName, // Назва Постачальника
		data: Object.values(timelineData), // Значення ваги
		backgroundColor: getRandomColor(),
		borderColor: getRandomColor(),
		borderWidth: 1,
		fill: false,
	}));

	const chartData = {
		labels,
		datasets,
	};

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Час (Дні)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Вага (тонни)',
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

// Генератор випадкових кольорів для графіків
const getRandomColor = () =>
    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
    )}, 0.6)`;

export default SupplierTimelineChart;
