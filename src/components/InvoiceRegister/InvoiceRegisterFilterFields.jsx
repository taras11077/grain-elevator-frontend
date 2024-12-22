import { Col, DatePicker, Input, Row } from 'antd'
import dayjs from 'dayjs'
import React from 'react'


const InvoiceRegisterFilterFields = ({ filters, onFilterChange }) => {
    return (
        <div className="filter-fields">
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Input
                        placeholder="Номер реєстра"
                        name="registerNumber"
                        value={filters.registerNumber || ''}
                        onChange={onFilterChange}
                    />
                </Col>
                <Col span={8}>
                    <DatePicker
                        placeholder="Дата прибуття"
                        name="arrivalDate"
                        style={{ width: '100%' }}
						value={filters.arrivalDate ? dayjs(filters.arrivalDate, 'YYYY-MM-DD') : null} // збереження внутрішнього формату для фільтрації
						format="DD-MM-YYYY" //вивід користувачеві дружній формат
						onChange={(date) => {
							const isoDate = date ? dayjs(date).format('YYYY-MM-DD') : ''; // формат для фільтрації
							onFilterChange({
								target: { name: 'arrivalDate', value: isoDate }, // надсилання ISO-формату на сервер
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
                        name="physicalWeightReg"
                        value={filters.physicalWeight || ''}
                        onChange={onFilterChange}

                    />
                </Col> 
               	<Col span={8}>
                    <Input
                        placeholder="Залікова вага"
                        name="accWeightReg"
                        value={filters.accWeightReg || ''}
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

export default InvoiceRegisterFilterFields;
