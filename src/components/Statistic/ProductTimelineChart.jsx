import React from 'react';
import { Line } from 'react-chartjs-2';

const ProductTimelineChart = ({ data }) => {
    if (!data || Object.keys(data || {}).length === 0) {
        return <p style={{ textAlign: 'center' }}>Дані для побудови графіка відсутні.</p>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
        }); // Формат DD.MM
    };

	const uniqueDates = [
        ...new Set(
            Object.values(data).flatMap((timelineData) => Object.keys(timelineData))
        ),
    ].sort((a, b) => new Date(a) - new Date(b)); // Сортування дат

    const labels = uniqueDates.map(formatDate);

    // Створення datasets для кожного Продукту
    const datasets = Object.entries(data).map(([productName, timelineData]) => {
		const productData = [];
        let previousValue = 0; // Початкове значення, якщо немає даних на першу дату

		uniqueDates.forEach((date, index) => {
            const currentValue = timelineData[date] !== undefined ? timelineData[date] : previousValue;
            const nextValue = timelineData[uniqueDates[index + 1]] || 0;

            // Додавання значення, якщо воно не нульове або якщо наступне значення не дорівнює 0
            if (currentValue !== 0 || nextValue !== 0 || previousValue !== 0) {
                productData.push(currentValue);
            } else {
                productData.push(null); // Використання `null`, щоб розривати лінію
            }

            // Оновлення попереднього значення
            if (timelineData[date] !== undefined) {
                previousValue = timelineData[date];
            }
        });

        return {
            label: productName, // Назва Продукту
            data: productData, // Значення ваги для всіх дат
            backgroundColor: getRandomColor(),
            borderColor: getRandomColor(),
            borderWidth: 2,
            fill: false,
        };
    });

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
    )}, 1.0)`;

export default ProductTimelineChart;

