import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from "antd";

const Home = () => {
	const {token, userData} = useSelector(state => state.auth);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography.Title level={1} style={{ color: "#1890ff" }}>
        Ласкаво просимо до Grain Elevator System
      </Typography.Title>

		{!token ?  
			<Typography.Text>
				Для початку роботи авторізуйтесь в системі.
			</Typography.Text> 
			:
			<>
			<Typography.Title level={3} style={{ color: "#1890ff" }}>
				Вітаю, {userData.name}!
			</Typography.Title>
			<Typography.Title level={4} style={{ color: "#1890ff" }}>
				{/* Нехай твоя кава буде міцною, а день продуктивним! */}
				Дякую за наполегливу роботу. Нехай буде ще один успішний день!
			</Typography.Title>
			</>
			
			
		}

    </div>
  );
};

export default Home;
