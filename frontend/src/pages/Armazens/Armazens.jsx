import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import SearchInput from "../../components/SearchInput";
import Pagination from "../../components/Pagination";
import CreatArmazem from "../Modais/CreatArmazem";
import { Link } from "react-router-dom";

const Armazens = () => {
  const [armazens, setArmazens] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [focused, setFocused] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const inputRef = useRef(null);
  const itemsPerPage = 10;

  // === Buscar Armazens da API ===
  useEffect(() => {
    const fetchArmazens = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/armazens/");
        setArmazens(res.data.results || res.data);
      } catch (error) {
        console.error("❌ Erro ao carregar armazens:", error);
      }
    };
    fetchArmazens();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // === Função para formatar data ===
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR"); // já formata em dd/mm/yyyy
  };

  // === Ordenação ===
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sorted = [...armazens].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let valueA = a[sortConfig.key];
    let valueB = b[sortConfig.key];

    if (sortConfig.key === "data_instalacao") {
      valueA = valueA ? new Date(valueA).getTime() : 0;
      valueB = valueB ? new Date(valueB).getTime() : 0;
    } else {
      valueA = valueA?.toString().toLowerCase() || "";
      valueB = valueB?.toString().toLowerCase() || "";
    }

    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // === Filtragem ===
  const filtered = sorted.filter((armazem) => {
    const searchLower = search.toLowerCase();

    return (
      armazem.nome?.toLowerCase().includes(searchLower) ||
      armazem.gateway_id?.toLowerCase().includes(searchLower) ||
      armazem.empresa_nome?.toLowerCase().includes(searchLower) ||
      (armazem.data_instalacao &&
        formatDate(armazem.data_instalacao).includes(searchLower))
    );
  });

  // === Paginação ===
  const totalPages = Math.max(Math.ceil(filtered.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 w-full min-h-screen flex flex-col bg-gray-50">
      {/* Cabeçalho */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Armazéns</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            inputRef={inputRef}
            focused={focused}
            placeholder="Pesquisar armazém..."
          />
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
          >
            + Novo Armazém
          </button>
        </div>
      </header>

      <div className="bg-white shadow-lg rounded-2xl flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold uppercase sticky top-0 shadow-md">
              <tr>
                <th
                  className="py-4 px-6 text-left cursor-pointer"
                  onClick={() => handleSort("nome")}
                >
                  Nome
                </th>
                <th
                  className="py-4 px-6 text-center cursor-pointer"
                  onClick={() => handleSort("gateway_id")}
                >
                  Gateway ID
                </th>
                <th
                  className="py-4 px-6 text-center cursor-pointer"
                  onClick={() => handleSort("empresa_nome")}
                >
                  Empresa
                </th>
                <th
                  className="py-4 px-6 text-center cursor-pointer"
                  onClick={() => handleSort("data_instalacao")}
                >
                  Data de instalação
                </th>
                <th className="py-4 px-6 text-center">Preferências</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {paginated.length > 0 ? (
                paginated.map((armazem) => (
                  <tr
                    key={armazem.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6 font-medium text-left text-blue-600 hover:underline cursor-pointer">
                      <Link
                        to={`/armazens/${armazem.empresa_nome
                          .replace(/\s+/g, "-")
                          .toLowerCase()}/${armazem.id}`}
                      >
                        {armazem.nome}
                      </Link>
                    </td>
                    <td className="py-4 px-6 font-medium text-center">
                      {armazem.gateway_id}
                    </td>
                    <td className="py-4 px-6 font-medium text-center">
                      {armazem.empresa_nome}
                    </td>
                    <td className="py-4 px-6 font-medium text-center">
                      {formatDate(armazem.data_instalacao)}
                    </td>
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
                  <td
                    colSpan="5"
                    className="py-6 text-center text-gray-500 italic"
                  >
                    Nenhum armazém encontrado 🚫
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Rodapé */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-50 border-t">
          <span className="text-sm text-gray-600">
            {filtered.length} armazéns encontrados
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Modal Criar Armazém */}
      {createModalOpen && (
        <CreatArmazem
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={() => {
            setCreateModalOpen(false);
            axios
              .get("http://127.0.0.1:8000/api/armazens/")
              .then((res) => setArmazens(res.data.results || res.data));
          }}
        />
      )}
    </div>
  );
};

export default Armazens;
