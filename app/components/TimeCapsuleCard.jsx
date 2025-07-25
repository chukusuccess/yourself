import { ClockCircleFilled } from "@ant-design/icons";
import { Card, Typography, Badge, Rate } from "antd";
import dayjs from "dayjs";
import React from "react";

const { Title, Paragraph, Text } = Typography;

const TimeCapsuleCard = ({ capsule }) => {
  const d = dayjs(capsule.unlockDate);
  const now = dayjs();

  const month = d.format("MMM"); // "Jul"
  const day = d.format("D"); // "20"
  const year = d.format("YYYY"); // "2020"

  const isFuture = d.isAfter(now, "day");
  const ribbonText = isFuture ? (
    <ClockCircleFilled className="text-cyan-500" />
  ) : (
    "seen"
  );
  const ribbonColor = isFuture ? "#d0d0d0" : "cyan";

  return (
    <Badge.Ribbon text={ribbonText} color={ribbonColor} placement="start">
      <Card
        hoverable
        // onClick={onClick}
        bodyStyle={{ padding: 16 }}
        style={{ width: "100%" }}
        className="subtle-shadow"
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
            <Title
              level={5}
              style={{ margin: "0 0 0 1.75rem", fontSize: "small" }}
            >
              {capsule.title || "Untitled Message"}
            </Title>
            <Paragraph
              ellipsis={{ rows: 2 }}
              style={{ marginBottom: 0, color: "#a2a2a2", fontSize: "smaller" }}
            >
              {/* From {capsule.from} to {capsule.to} */}
              {capsule.messageText}
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
    </Badge.Ribbon>
  );
};

export default TimeCapsuleCard;
