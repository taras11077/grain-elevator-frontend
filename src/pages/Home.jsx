import { Modal, Typography } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/Auth/LoginForm'
import './Home.css'

const motivationalQuotes = [
  'Ваші зусилля сьогодні стануть результатами завтра!',
  'Ніколи не здавайтеся, адже ви ближче до успіху, ніж здається.',
  'Кожен день — це новий шанс стати кращим.',
  'Ваша наполегливість — це ключ до успіху.',
  'Мрії здійснюються завдяки вашим діям!',
  'Ви здатні на більше, ніж ви думаєте.',
  'Нехай сьогоднішній день буде продуктивним і успішним.',
  'Сміливо рухайтесь до своєї мети, навіть якщо кроки маленькі.',
];

const getRandomMotivation = () => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};

const AuthRequest = ({ showLoginModal }) => (
  <div>
    <Typography.Title className="home-title">
      	Ласкаво просимо до Grain Elevator System
    </Typography.Title>
    <Typography.Text className="home-text">
      	Для початку роботи авторізуйтесь в системі.
    </Typography.Text>
	<div>
		<button className="nav-button" onClick={showLoginModal}>
			Вхід
		</button>
	</div>
  </div>
);

const UserGreeting = ({ name }) => (
  <div>
    <Typography.Title className="home-greeting">Вітаю, {name}!</Typography.Title>
    <Typography.Title className="home-text">{getRandomMotivation()}</Typography.Title>
  </div>
);

const Home = () => {
  const { token, userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);

  const closeModal = () => {
    setLoginModalVisible(false);
  };

  const handleCancel = () => {
    setLoginModalVisible(false);
    navigate('/');
  };

  return (
    <div className="home-container">
      {!token ? (
        <>
          <AuthRequest showLoginModal={() => setLoginModalVisible(true)} />
          <Modal
            title="Авторизація"
            open={isLoginModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <LoginForm closeModal={closeModal} />
          </Modal>
        </>
      ) : (
        <UserGreeting name={userData?.name} />
      )}
    </div>
  );
};

export default Home;

