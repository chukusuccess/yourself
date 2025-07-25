// components/MilestoneCard.tsx

import { Card, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";

const { Title, Paragraph, Text } = Typography;

const MilestoneCard = ({ title, description, date, onClick }) => {
  const d = dayjs(date);
  const month = d.format("MMM"); // "Jul"
  const day = d.format("D"); // "20"
  const year = d.format("YYYY"); // "2020"

  return (
    <Card
      hoverable
      onClick={onClick}
      bodyStyle={{ padding: 16 }}
      style={{ width: "100%" }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        {/* Left Section (80%) */}
        <div
          style={{
            flex: 5,
            paddingRight: 16,
            borderRight: "1px solid #d2d2d2",
          }}
        >
          <Title level={5} style={{ margin: 0, fontSize: "small" }}>
            {title}
          </Title>
          <Paragraph
            ellipsis={{ rows: 2 }}
            style={{ marginBottom: 0, color: "#a2a2a2", fontSize: "smaller" }}
          >
            {description}
          </Paragraph>
        </div>

        {/* Right Section (20%) - Date vertically */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <Text type="secondary" style={{ fontSize: 13 }}>
            {month}
          </Text>
          <Text strong style={{ fontSize: 24, lineHeight: 1 }}>
            {day}
          </Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {year}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default MilestoneCard;
