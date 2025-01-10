import { Col, DatePicker, Input, Row } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

const EmployeeFilterFields = ({ filters, onFilterChange }) => {
    return (
        <div className="filter-fields">
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Input
                        placeholder="Їм`я"
                        name="firstName"
                        value={filters.firstName || ''}
                        onChange={onFilterChange}
                    />
                </Col>
				<Col span={8}>
                    <Input
                        placeholder="Призвище"
                        name="lastName"
                        value={filters.lastName || ''}
                        onChange={onFilterChange}
                    />
                </Col>
            </Row>
			
			<Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
				<Col span={8}>
                    <Input
                        placeholder="Роль"
                        name="roleTitle"
                        value={filters.roleTitle || ''}
                        onChange={onFilterChange}
                    />
                </Col>
				<Col span={8}>
                    <Input
                        placeholder="Пол"
                        name="gender"
                        value={filters.gender || ''}
                        onChange={onFilterChange}
                    />
                </Col>
            </Row>

			<Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
				<Col span={8}>
                    <Input
                        placeholder="Email"
                        name="email"
                        value={filters.email || ''}
                        onChange={onFilterChange}
                    />
                </Col>
				<Col span={8}>
                    <Input
                        placeholder="Номер телефону"
                        name="phone"
                        value={filters.phone || ''}
                        onChange={onFilterChange}
                    />
                </Col>
            </Row>

			<Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
				<Col span={8}>
                    <Input
                        placeholder="Місто"
                        name="city"
                        value={filters.productCategory || ''}
                        onChange={onFilterChange}
                    />
                </Col>
				<Col span={8}>
                    <Input
                        placeholder="Країна"
                        name="country"
                        value={filters.productWeight || ''}
                        onChange={onFilterChange}

                    />
                </Col> 
            </Row>

			<Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
				<Col span={8}>
                    <DatePicker
                        placeholder="Дата народження"
                        name="birthDate"
                        style={{ width: '100%' }}
						value={filters.birthDate ? dayjs(filters.birthDate, 'YYYY-MM-DD') : null} // збереження внутрішнього формату для фільтрації
						format="DD-MM-YYYY" //показуємо користувачеві дружній формат
						onChange={(date) => {
							const isoDate = date ? dayjs(date).format('YYYY-MM-DD') : ''; // формат для фільтрації
							onFilterChange({
								target: { name: 'birthDate', value: isoDate }, // надсилання ISO-формату на сервер
							});
						}}
					/>
                </Col>
				<Col span={8}>
                    <DatePicker
                        placeholder="Остання активність"
                        name="lastSeenOnline"
                        style={{ width: '100%' }}
						value={filters.lastSeenOnline ? dayjs(filters.lastSeenOnline, 'YYYY-MM-DD') : null} // збереження внутрішнього формату для фільтрації
						format="DD-MM-YYYY" //показуємо користувачеві дружній формат
						onChange={(date) => {
							const isoDate = date ? dayjs(date).format('YYYY-MM-DD') : ''; // формат для фільтрації
							onFilterChange({
								target: { name: 'lastSeenOnline', value: isoDate }, // надсилання ISO-формату на сервер
							});
						}}
					/>
                </Col>               
            </Row>

			<Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={8}>
                    <Input
                        placeholder="HR"
                        name="createdByName"
                        value={filters.createdByName || ''}
                        onChange={onFilterChange}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default EmployeeFilterFields;
