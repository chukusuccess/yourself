import { ConfigProvider } from "antd";

const themeValues = {
  borderRadius: 10,
  hoverColor: "#D2D2D2",
  Button: {
    staticColor: "#5a5753",
  },
};

export const AntThemeProvider = ({ children }) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: themeValues.hoverColor,
        borderRadius: themeValues.borderRadius,
        fontFamily: "M PLUS Rounded 1c",
      },
      components: {
        Button: {
          colorPrimary: themeValues.Button.staticColor,
        },
        Input: {
          componentSize: "large",
        },
        Timeline: {
          dotBorderWidth: 5,
          dotBg: "#f5f5f5",
          tailWidth: 4,
        },
      },
    }}
  >
    {children}
  </ConfigProvider>
);
