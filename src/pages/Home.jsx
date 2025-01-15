import { Typography } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
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

const AuthRequest = () => (
  <div>
    <Typography.Title className="home-title">
      Ласкаво просимо до Grain Elevator System
    </Typography.Title>
    <Typography.Text className="home-text">
      Для початку роботи авторізуйтесь в системі.
    </Typography.Text>
    <NavLink className="nav-link" to="/login">
      <button className="nav-button">Вхід</button>
    </NavLink>
  </div>
);

const UserGreeting = ({ name }) => (
  <div>
    <Typography.Title className="home-greeting">
      Вітаю, {name}!
    </Typography.Title>
    <Typography.Title className="home-text">
      {getRandomMotivation()}
    </Typography.Title>
  </div>
);

const Home = () => {
  const { token, userData } = useSelector((state) => state.auth);
  return (
    <div className="home-container">
      {!token ? <AuthRequest /> : <UserGreeting name={userData?.name} />}
    </div>
  );
};

export default Home;
