import { Typography } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStatistic, fetchTimelineStatistic } from '../asyncThunks/statisticThunk'
import ProductBarChart from '../components/Statistic/ProductBarChart.jsx'
import ProductTimelineChart from '../components/Statistic/ProductTimelineChart.jsx'
import SupplierBarChart from '../components/Statistic/SupplierBarChart.jsx'
import SupplierTimelineChart from '../components/Statistic/SupplierTimelineChart.jsx'
import './StatisticPage.css'

const StatisticPage = () => {
	const { Title } = Typography;
    const dispatch = useDispatch();
	const { 
		bySupplier, 
		byProduct, 
		bySupplierTimeline, 
		byProductTimeline, 
		loading, 
		error 
	} = useSelector(state => state.statistic);

    useEffect(() => {
        dispatch(fetchStatistic());
		dispatch(fetchTimelineStatistic());
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
				<h2 className="chart-title">Загальна вага по Постачальникам</h2>
				<SupplierBarChart data={bySupplier} />
			</div>
			<div className="chart-container">
				<h2 className="chart-title">Загальна вага по Найменуванню продукції</h2>
				<ProductBarChart data={byProduct} />
			</div>

			<div className="chart-container">
				<h2 className="chart-title">Графік надходження по Постачальникам</h2>
				<SupplierTimelineChart data={bySupplierTimeline} />
			</div>
			<div className="chart-container">
				<h2 className="chart-title">Графік надходження по Найменуванню продукції</h2>
				<ProductTimelineChart data={byProductTimeline} />
			</div>

		</>
    );
};

export default StatisticPage;
