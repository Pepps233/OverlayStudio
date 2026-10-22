"use client";

import React, {createContext, useContext, useSyncExternalStore, useEffect, ReactNode} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getStoredTheme(): Theme {
    return localStorage.getItem("theme") === "dark" ? "dark" : "light";
}

function subscribeToTheme(onChange: () => void) {
    window.addEventListener("storage", onChange);
    window.addEventListener("themechange", onChange);
    return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener("themechange", onChange);
    };
}

function getServerTheme(): Theme {
    return "light";
}

export function ThemeProvider({children}: { children: ReactNode }) {
    const theme = useSyncExternalStore(subscribeToTheme, getStoredTheme, getServerTheme);

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        localStorage.setItem("theme", getStoredTheme() === "light" ? "dark" : "light");
        window.dispatchEvent(new Event("themechange"));
    };

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
