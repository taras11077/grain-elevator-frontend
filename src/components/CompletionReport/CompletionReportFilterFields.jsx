import { Col, DatePicker, Input, Row } from 'antd'
import dayjs from 'dayjs'
import React from 'react'


const CompletionReportFilterFields = ({ filters = {}, onFilterChange }) => {
    return (
        <div className="filter-fields">
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Input
                        placeholder="Номер акта"
                        name="reportNumber"
                        value={filters.reportNumber || ''}
                        onChange={onFilterChange}
                    />
                </Col>
                <Col span={8}>
                    <DatePicker
                        placeholder="Дата складання"
                        name="reportDate"
                        style={{ width: '100%' }}
						value={filters.reportDate ? dayjs(filters.reportDate, 'YYYY-MM-DD') : null} // збереження внутрішнього формату для фільтрації
						format="DD-MM-YYYY" //вивід користувачеві дружній формат
						onChange={(date) => {
							const isoDate = date ? dayjs(date).format('YYYY-MM-DD') : ''; // формат для фільтрації
							onFilterChange({
								target: { name: 'reportDate', value: isoDate }, // надсилання ISO-формату на сервер
							});
						}}
					/>
                </Col>
				
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={8}>
                    <Input
                        placeholder="Постачальник"
                        name="supplierTitle"
                        value={filters.supplierTitle || ''}
                        onChange={onFilterChange}
                    />
                </Col>
                <Col span={8}>
                    <Input
                        placeholder="Продукція"
                        name="productTitle"
                        value={filters.productTitle || ''}
                        onChange={onFilterChange}
                    />
                </Col>
            </Row>

			<Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
				<Col span={8}>
                    <Input
                        placeholder="Физична вага"
                        name="physicalWeightReport"
                        value={filters.physicalWeightReport || ''}
                        onChange={onFilterChange}
                    />
                </Col> 
               	<Col span={8}>
                    <Input
                        placeholder="Загальна сума"
                        name="totalCost"
                        value={filters.totalCost || ''}
                        onChange={onFilterChange}
                    />
                </Col>
            </Row>

			<Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={8}>
                    <Input
                        placeholder="Автор документу"
                        name="createdByName"
                        value={filters.createdByName || ''}
                        onChange={onFilterChange}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default CompletionReportFilterFields;
