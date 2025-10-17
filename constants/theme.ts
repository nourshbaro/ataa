import { AppTheme } from "@/types/theme";

export const lightTheme: AppTheme = {
    mode: "light",
    colors: {
        primary: "#60C3F4",          // Bright sky blue — main brand color
        secondary: "#D288EB",        // Lavender purple — secondary highlight
        white: "#FFFFFF",
        black: "#000000",
        inputBackground: "#e9e9e9ff",
        transparent: "transparent",
        tabBackground: "#F7F8FA",
        containerBackground: "#FFFFFF",
        skeletonBase: "#E3E7EB",
        skeletonHighlight: "#F5F7FA",

        accent: "#08557C",           
        background: "#f3f3f3ff",      
        surface: "#FFFFFF",          

        textPrimary: "#1A1A1A",
        textSecondary: "#797199",
        text: "#797199",

        border: "#E2E4E8",
        error: "#D64545",
        success: "#4CAF50",
        warning: "#EFB366",
        info: "#60C3F4",

        disabled: "#C7CCD2",
        loadingSpinner: "#9FC9D2",
        overlay: "rgba(0, 0, 0, 0.1)",

        gradient: ["#60C3F4", "#D288EB"],

        pending: "#EFB366",
        inReview: "#9FC9D2",
        resolved: "#4CAF50",
        rejected: "#D64545",
    },
};

export const darkTheme: AppTheme = {
    mode: "dark",
    colors: {
        primary: "#2A94C4",          // Muted blue
        secondary: "#B05FD0",        // Deeper purple
        white: "#FFFFFF",
        black: "#000000",
        inputBackground: "#1E1F22",
        transparent: "transparent",
        tabBackground: "#1A1B1D",
        containerBackground: "#1C1E20",
        skeletonBase: "#2A2D31",
        skeletonHighlight: "#3B3E42",

        accent: "#60C3F4",
        background: "#101214",
        surface: "#1C1E20",

        textPrimary: "#EAEAEA",
        textSecondary: "#AFA8C2",
        text: "#797199",

        border: "#33363A",
        error: "#F07373",
        success: "#81C784",
        warning: "#D49B53",
        info: "#2A94C4",

        disabled: "#4E7C85",
        loadingSpinner: "#9FC9D2",
        overlay: "rgba(0, 0, 0, 0.5)",

        gradient: ["#08557C", "#484124"],

        pending: "#D49B53",
        inReview: "#4E7C85",
        resolved: "#81C784",
        rejected: "#F07373",
    },
};
