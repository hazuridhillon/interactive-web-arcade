/**
 * App.tsx — Root component. Just a router with two pages.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Overworld } from "./components/Overworld";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Overworld />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
