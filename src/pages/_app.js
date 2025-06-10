// "use client";

// import { Toaster } from "react-hot-toast";
// import "./globals.css";
// // import { AuthProvider } from "@/context/AuthContext";

// function MyApp({ Component, pageProps }) {
//   return (
//     // <AuthProvider>
//       <Component {...pageProps} />
//       <Toaster></Toaster>
//     // </AuthProvider>
//   );
// }

// export default MyApp;



"use client";

import { Toaster } from "react-hot-toast";
import Header from '../components/Header';
import "./globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* <Component {...pageProps} />
      <Toaster /> */}
      <Header />
      <main className="min-h-screen bg-gray-50">
        <Component {...pageProps} />
        <Toaster />
      </main>
    </>
    
  );
}

export default MyApp;

