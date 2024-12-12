import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const NotFoundPage = () => {
    return (
        <Title style={{ textAlign: 'center', marginTop: '150px', color: 'red' }}>
            Сторінку не знайдено.
        </Title>
    );
};

export default NotFoundPage;