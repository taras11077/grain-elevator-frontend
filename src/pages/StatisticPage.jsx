import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatistic } from '../asyncThunks/statisticThunk';
import ChartComponent from '../components/Statistic/ChartComponent.jsx';
import { Button, Modal, Typography, message } from 'antd'
import './StatisticPage.css'

const StatisticPage = () => {
	const { Title } = Typography;
    const dispatch = useDispatch();
    const { supplierData, productData, loading, error } = useSelector((state) => state.statistic);

    useEffect(() => {
        dispatch(fetchStatistic());
    }, [dispatch]);

    if (loading) return <p>Завантаження...</p>;
    if (error) return <p>Помилка: {error}</p>;

    return (
		<>
			<Title level={1} style={{ textAlign: 'center', color: 'steelblue', margin: 20 }}>
				Статистичні показники 
			</Title>
			<Title level={4} style={{ textAlign: 'center', color: 'steelblue', margin: 30 }}>
				завантаженності підприємства.
			</Title>
			<div className="chart-container">
				<ChartComponent data={supplierData} title="Загальна вага по Постачальникам" />
			</div>
			<div className="chart-container">
				<ChartComponent data={productData} title="Загальна вага по Продукції" />
			</div>
		</>
    );
};

export default StatisticPage;
