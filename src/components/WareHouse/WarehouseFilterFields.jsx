import { Col, Input, Row } from 'antd'
import React from 'react'

const WarehouseFilterFields = ({ filters, onFilterChange }) => {
    return (
        <div className="filter-fields">
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
                        placeholder="Категорія продукції"
                        name="productCategory"
                        value={filters.productCategory || ''}
                        onChange={onFilterChange}
                    />
                </Col>
				<Col span={8}>
                    <Input
                        placeholder="Автор"
                        name="modifiedById"
                        value={filters.modifyByName || ''}
                        onChange={onFilterChange}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default WarehouseFilterFields;
