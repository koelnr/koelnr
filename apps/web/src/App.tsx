import { Routes, Route } from "react-router";
import HomePage from "@/routes/home-page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
