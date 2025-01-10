import { Col, DatePicker, Input, Row } from 'antd'
import React from 'react'


const RoleFilterFields = ({ filters, onFilterChange }) => {
	return (
		<div className="filter-fields">
			<Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
			<Col span={8}>
					<Input
						placeholder="Роль"
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

export default RoleFilterFields;
