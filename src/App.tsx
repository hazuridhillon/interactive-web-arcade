import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Overworld } from "./components/Overworld";
import NotFound from "./components/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Overworld />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
