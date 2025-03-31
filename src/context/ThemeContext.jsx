import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

const ThemeContext = createContext();

// Ortak tema değerleri
const commonComponents = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        transition: "background-color 0.3s ease, color 0.3s ease",
        scrollBehavior: "smooth",
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
        borderRadius: "8px",
        fontWeight: 600,
        boxShadow: "none",
      },
      contained: {
        "&:hover": {
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: "12px",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    defaultProps: {
      elevation: 0,
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: "10px",
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: "12px",
        padding: "8px",
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
        },
      },
    },
  },
};

// Açık tema
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // Daha canlı bir mavi
      light: "#60a5fa",
      dark: "#1e40af",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#10b981", // Güzel bir yeşil
      light: "#34d399",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
      gradient: "linear-gradient(45deg, #2563eb 30%, #60a5fa 90%)",
      gradientHover: "linear-gradient(45deg, #1e40af 30%, #3b82f6 90%)",
      card: "#ffffff",
      cardHover: "#f8fafc",
    },
    text: {
      primary: "#111827",
      secondary: "#4b5563",
      tertiary: "#6b7280",
      disabled: "#9ca3af",
    },
    divider: "rgba(0, 0, 0, 0.06)",
    success: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#b91c1c",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
      contrastText: "#ffffff",
    },
    info: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#1d4ed8",
      contrastText: "#ffffff",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
    },
  },
  components: {
    ...commonComponents,
    MuiCssBaseline: {
      ...commonComponents.MuiCssBaseline,
      styleOverrides: {
        body: {
          ...commonComponents.MuiCssBaseline.styleOverrides.body,
          backgroundColor: "#f9fafb",
          color: "#111827",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
          },
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#111827",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          fontWeight: 500,
          "&.MuiChip-colorSuccess": {
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            color: "#059669",
          },
          "&.MuiChip-colorError": {
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "#b91c1c",
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          "& .MuiSwitch-switchBase": {
            padding: 0,
            margin: 2,
            transitionDuration: "300ms",
            "&.Mui-checked": {
              transform: "translateX(16px)",
              color: "#fff",
              "& + .MuiSwitch-track": {
                backgroundColor: "#2563eb",
                opacity: 1,
                border: 0,
              },
            },
          },
          "& .MuiSwitch-thumb": {
            boxSizing: "border-box",
            width: 22,
            height: 22,
          },
          "& .MuiSwitch-track": {
            borderRadius: 26 / 2,
            backgroundColor: "#d1d5db",
            opacity: 1,
          },
        },
      },
    },
  },
});

// Koyu tema
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6", // Daha parlak bir mavi
      light: "#60a5fa",
      dark: "#2563eb",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#10b981", // Canlı bir yeşil
      light: "#34d399",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0f172a", // Koyu bir lacivert
      paper: "#1e293b", // Biraz daha açık bir lacivert
      gradient: "linear-gradient(45deg, #3b82f6 30%, #60a5fa 90%)",
      gradientHover: "linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)",
      card: "#1e293b",
      cardHover: "#293548",
    },
    text: {
      primary: "#f9fafb",
      secondary: "#e5e7eb",
      tertiary: "#d1d5db",
      disabled: "#9ca3af",
    },
    divider: "rgba(255, 255, 255, 0.08)",
    success: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#b91c1c",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
      contrastText: "#ffffff",
    },
    info: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#1d4ed8",
      contrastText: "#ffffff",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
    },
  },
  components: {
    ...commonComponents,
    MuiCssBaseline: {
      ...commonComponents.MuiCssBaseline,
      styleOverrides: {
        body: {
          ...commonComponents.MuiCssBaseline.styleOverrides.body,
          backgroundColor: "#0f172a",
          color: "#f9fafb",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e293b",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
          },
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e293b",
          color: "#f9fafb",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.25)",
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          fontWeight: 500,
          "&.MuiChip-colorSuccess": {
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            color: "#34d399",
          },
          "&.MuiChip-colorError": {
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            color: "#f87171",
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          "& .MuiSwitch-switchBase": {
            padding: 0,
            margin: 2,
            transitionDuration: "300ms",
            "&.Mui-checked": {
              transform: "translateX(16px)",
              color: "#fff",
              "& + .MuiSwitch-track": {
                backgroundColor: "#3b82f6",
                opacity: 1,
                border: 0,
              },
            },
          },
          "& .MuiSwitch-thumb": {
            boxSizing: "border-box",
            width: 22,
            height: 22,
          },
          "& .MuiSwitch-track": {
            borderRadius: 26 / 2,
            backgroundColor: "#4b5563",
            opacity: 1,
          },
        },
      },
    },
  },
});

export function ThemeProvider({ children }) {
  // localStorage'dan kaydedilmiş tema tercihini al, yoksa sistem tercihini kullan
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode) {
      return savedMode;
    }
    // Sistem tercihini kontrol et
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Tema değişikliklerini takip et ve localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("theme", mode);

    // HTML ve body elementlerine tema classlarını ekle
    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.style.colorScheme = mode;

    // HTML'e dark sınıfını ekle veya kaldır
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Meta teması güncelle
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        mode === "dark" ? "#0f172a" : "#ffffff"
      );
    }
  }, [mode]);

  // Sistem teması değişikliklerini dinle
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      // Eğer kullanıcı manuel olarak bir tema seçmediyse sistem temasını kullan
      const userPreference = localStorage.getItem("userThemePreference");
      if (!userPreference) {
        setMode(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Tema geçişi için fonksiyon
  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      // Kullanıcının manuel olarak bir tema seçtiğini işaretle
      localStorage.setItem("userThemePreference", "true");
      return newMode;
    });
  };

  // Memoize edilmiş tema
  const theme = useMemo(
    () => (mode === "dark" ? darkTheme : lightTheme),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useCustomTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useCustomTheme must be used within a ThemeProvider");
  }
  return context;
};
