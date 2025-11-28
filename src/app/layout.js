import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ToastProvider from "./components/toast";

export const metadata = {
  title: "Task App",
  description: "Simple Task Management App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black dark:bg-black dark:text-white flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
