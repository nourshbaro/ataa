// import React, { useEffect } from 'react';
// import { useRouter } from 'expo-router';
// import { useAuth } from '@/context/UserContext';

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.replace('/(auth)/login');
//     }
//   }, [isAuthenticated]);

//   return isAuthenticated ? children : null;
// };

// export default ProtectedRoute;