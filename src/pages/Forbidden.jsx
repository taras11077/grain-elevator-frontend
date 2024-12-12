import { Typography } from 'antd'
import React from 'react'

const { Title } = Typography;

const Forbidden = () => {
	return <Title style={{ color: 'red', textAlign: 'center', marginTop: '150px' }}>
				У доступі відмовлено!
			</Title>
  };
  
  export default Forbidden;
  