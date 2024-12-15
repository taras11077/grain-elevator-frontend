import { Col, DatePicker, Input, Row } from 'antd'
import dayjs from 'dayjs'
import React from 'react'


const LaboratoryCardFilterFields = ({ filters, onFilterChange }) => {
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
            </Row>



			<Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col span={8}>
                    <Input
                        placeholder="Сміттева домішка"
                        name="weedImpurity"
                        value={filters.weedImpurity || ''}
                        onChange={onFilterChange}
                    />
                </Col>
                <Col span={8}>
                    <Input
                        placeholder="Вологість"
                        name="moisture"
                        value={filters.moisture || ''}
                        onChange={onFilterChange}
                    />
                </Col>

				<Col span={8}>
                    <Input
                        placeholder="Зернова домішка"
                        name="grainImpurity"
                        value={filters.grainImpurity || ''}
                        onChange={onFilterChange}
                    />
                </Col>
            </Row>

			<Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
               				<Col span={8}>
                    <Input
                        placeholder="Особливі замітки"
                        name="SpecialNotes"
                        value={filters.SpecialNotes || ''}
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

export default LaboratoryCardFilterFields;