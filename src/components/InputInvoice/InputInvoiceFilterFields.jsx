import { Col, DatePicker, Input, Row } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

const InputInvoiceFilterFields = ({ filters, onFilterChange }) => {
    return (
        <div className="filter-fields">
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Input
                        placeholder="Номер накладної"
                        name="invoiceNumber"
                        value={filters.invoiceNumber || ''}
                        onChange={onFilterChange}
                    />
                </Col>
                <Col span={8}>
                    <DatePicker
                        placeholder="Дата прибуття"
                        name="arrivalDate"
                        style={{ width: '100%' }}
                        value={filters.arrivalDate ? dayjs(filters.arrivalDate) : null}
    					onChange={(date, dateString) =>
        					onFilterChange({
            					target: { name: 'arrivalDate', value: date?.toISOString() || '' },
       						 })
						} 
                    />
                </Col>
				<Col span={8}>
                    <Input
                        placeholder="Физична вага"
                        name="physicalWeight"
                        value={filters.physicalWeight || ''}
                        onChange={onFilterChange}

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

				<Col span={8}>
                    <Input
                        placeholder="Номер транспортного засобу"
                        name="vehicleNumber"
                        value={filters.vehicleNumber || ''}
                        onChange={onFilterChange}
                    />
                </Col>

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

export default InputInvoiceFilterFields;
