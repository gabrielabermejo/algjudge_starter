import { BrowserRouter } from "react-router-dom";
import Navbar from "./presentation/components/Navbar";
import AppRouter from "./presentation/routes/AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRouter />
    </BrowserRouter>
  );
}
