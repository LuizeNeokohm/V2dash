import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

// importa suas páginas
import Home from "./pages/Home";
import Empresas from "./pages/Empresas/Empresas";
import Sensores from "./pages/Sensores/Sensores";
import Armazens from "./pages/Armazens/Armazens";
import ArmazemDetalhe from "./pages/Armazens/ArmazemDetalhe";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen bg-blue-200 flex items-center justify-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/sensores" element={<Sensores />} />
            <Route path="/armazens" element={<Armazens />} />
            <Route
              path="/armazens/:empresa/:id"
              element={<ArmazemDetalhe />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
