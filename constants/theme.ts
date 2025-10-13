import { AppTheme } from "@/types/theme";

export const lightTheme: AppTheme = {
    mode: 'light',
    colors: {
        primary: '#541926',
        secondary: '#9E8743',
        white: '#FFFFFF',
        black: '#000000',
        inputBackground: '#1c1c1c',
        transparent: 'transparent',
        tabBackground: '#322232',
        containerBackground: '#373737',
        skeletonBase: '#3A3A3A',

        accent: '#007BFF',
        background: '#FFFFFF',
        surface: '#F2F2F2',
        textPrimary: '#000000',
        textSecondary: '#555555',
        border: '#E5E5E5',
        error: '#D9534F',
        success: '#2ECC71',
        warning: '#F4BC1C',
        info: '#007BFF',
        disabled: '#B0B0B0',
        loadingSpinner: '#007BFF',
        overlay: 'rgba(0, 0, 0, 0.05)',
        gradient: ['#FFFFFF', '#F4F4F4'],
        pending: '#CC8A00',
        inReview: '#37474F',
        resolved: '#00674F',
        rejected: '#FF4C4C',
        skeletonHighlight: '#F4F4F4',
    },
};

// export const darkTheme: AppTheme = {
//     mode: 'dark',
//     colors: {
//         primary: '#FFFFFF',              // Main text color
//         primaryLight: '#CCCCCC',         // Less emphasis text
//         accent: '#3399FF',               // Blue for links, buttons
//         background: '#121212',           // Main background
//         surface: '#1C1C1C',              // Cards, modals
//         textPrimary: '#FFFFFF',          // Headlines
//         textSecondary: '#AAAAAA',        // Subtext
//         border: '#2C2C2C',               // Dividers, card edges
//         error: '#FF6B6B',
//         success: '#00B894',
//         warning: '#F4D35E',
//         info: '#3399FF',
//         disabled: '#666666',
//         loadingSpinner: '#3399FF',
//         overlay: 'rgba(255, 255, 255, 0.05)',
//         white: '#FFFFFF',
//         gradient: ['#1A1A1A', '#2A2A2A'], // Optional background gradient
//         pending: '#FFD93B',
//         inReview: '#61A0FF',
//         resolved: '#00B894',
//         rejected: '#FF6B6B',
//         skeletonBase: '#2C2C2C',       // Matches border tone
// skeletonHighlight: '#3A3A3A',  // Slightly lighter shimmer
//     },
// };
