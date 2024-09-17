import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    h1: {
      fontSize: "3.5rem",
      fontWeight: "bolder",
    },
    h2: {
      fontSize: "3rem",
      fontWeight: "bolder",
    },
    h3: {
      fontSize: "2.5rem",
      fontWeight: "bold",
    },
    h4: {
      fontSize: "2rem",
      fontWeight: "bold",
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: "bold",
    },
    body1: {
      fontSize: "1.25rem",
      fontWeight: "400",
    },
    body2: {
      fontSize: "1rem",
      fontWeight: "400",
    },
  },
});

export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
