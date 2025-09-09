import React, { useState, useRef, useEffect } from "react";
import SearchInput from "../../components/SearchInput";
import Pagination from "../../components/Pagination";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import CreatSensor from "../Modais/CreateSensor";

const Sensores = () => {
  const [sensores, setSensores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false); // state para modal
  const inputRef = useRef(null);
  const itemsPerPage = 10;

  // Buscar sensores da API
  useEffect(() => {
    const fetchSensores = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/sensores/");
        setSensores(res.data.results || res.data);
      } catch (error) {
        console.error("❌ Erro ao carregar sensores:", error);
      }
    };
    fetchSensores();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleSaveSensor = (newSensor) => {
    setSensores((prev) => [newSensor, ...prev]); // adiciona sensor novo na lista
  };

  // Filtragem e paginação
  const filtered = sensores.filter((sensor) => {
    const searchLower = search.toLowerCase();
    return (
      sensor.nome?.toLowerCase().includes(searchLower) ||
      sensor.gateway_id?.toLowerCase().includes(searchLower) ||
      sensor.empresa_nome?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.max(Math.ceil(filtered.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 w-full min-h-screen flex flex-col bg-gray-50">
      {/* Cabeçalho */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Sensores</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            inputRef={inputRef}
            focused={focused}
            placeholder="Pesquisar Sensores..."
          />
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
          >
            + Novo Sensor
          </button>
        </div>
      </header>

      <div className="bg-white shadow-lg rounded-2xl flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold uppercase sticky top-0 shadow-md">
              <tr>
                <th className="py-4 px-6 text-left">Nome</th>
                <th className="py-4 px-6 text-center">Sensor ID</th>
                <th className="py-4 px-6 text-center">Armazém</th>
                <th className="py-4 px-6 text-center">Empresa</th>
                <th className="py-4 px-6 text-center">Data de Instalação</th>
                <th className="py-4 px-6 text-center">Preferências</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {paginated.length > 0 ? (
                paginated.map((sensor) => (
                  <tr key={sensor.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6 font-medium text-left">{sensor.nome}</td>
                    <td className="py-4 px-6 font-medium text-center">{sensor.gateway_id}</td>
                    <td className="py-4 px-6 font-medium text-center">{sensor.armazem_nome}</td>
                    <td className="py-4 px-6 font-medium text-center">{sensor.empresa_nome}</td>
                    <td className="py-4 px-6 text-center">{sensor.dataInstalacao}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition"
                        title="Editar preferências"
                      >
                        <FaPencilAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500 italic">
                    Nenhum sensor encontrado 🚫
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-50 border-t">
          <span className="text-sm text-gray-600">{filtered.length} sensor(es) encontradas</span>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* Modal Criar Sensor */}
      {createModalOpen && (
        <CreatSensor
          onClose={() => setCreateModalOpen(false)}
          onSave={handleSaveSensor}
        />
      )}
    </div>
  );
};

export default Sensores;
