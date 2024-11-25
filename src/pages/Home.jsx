import React from "react";
import { Typography } from "antd";

const Home = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography.Title level={1} style={{ color: "#1890ff" }}>
        Ласкаво просимо до Grain Elevator System
      </Typography.Title>
      <Typography.Text>
        Авторізуйтесь в системі щоб почати роботу.
      </Typography.Text>
    </div>
  );
};

export default Home;
