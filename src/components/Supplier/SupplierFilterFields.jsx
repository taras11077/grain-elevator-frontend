import { Col, DatePicker, Input, Row } from 'antd'
import React from 'react'


const SupplierFilterFields = ({ filters, onFilterChange }) => {
    return (
        <div className="filter-fields">
			<Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
			<Col span={8}>
                    <Input
                        placeholder="Постачальник"
                        name="title"
                        value={filters.title || ''}
                        onChange={onFilterChange}
                    />
                </Col>
                <Col span={8}>
                    <Input
                        placeholder="Автор"
                        name="createdByName"
                        value={filters.createdByName || ''}
                        onChange={onFilterChange}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default SupplierFilterFields;
