import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Task App",
  description: "Simple Task Management App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black dark:bg-black dark:text-white">
        <Navbar />
        <main className="p-8">{children}</main>
      </body>
    </html>
  );
}
