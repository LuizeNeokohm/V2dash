import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import SwitchButton from "../../components/SwitchButton";
import CreatEmpresa from "../Modais/CreatEmpresa";
import Pagination from "../../components/Pagination";
import PreferenciasEmpresa from "../Modais/PreferenciasEmpresa";
import SearchInput from "../../components/SearchInput";

const Empresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    empresa: null,
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [preferenciasModalOpen, setPreferenciasModalOpen] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [itemsPerPage, setItemsPerPage] = useState(10); // dinâmico
  const inputRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Alternar ordenação
  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Filtragem, ordenação e paginação
  const filtered = empresas.filter((empresa) =>
    empresa.nome?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!a.nome) return 1;
    if (!b.nome) return -1;
    return sortOrder === "asc"
      ? a.nome.localeCompare(b.nome)
      : b.nome.localeCompare(a.nome);
  });

  const totalPages = Math.max(Math.ceil(sorted.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = sorted.slice(startIndex, startIndex + itemsPerPage);

  // Buscar empresas da API
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/empresas/");
        setEmpresas(res.data.results || res.data);
      } catch (error) {
        console.error("❌ Erro ao carregar empresas:", error);
      }
    };
    fetchEmpresas();
  }, []);

  // Calcular dinamicamente quantas linhas cabem sem scroll
  useEffect(() => {
    const calcularLinhas = () => {
      const alturaTela = window.innerHeight;
      const alturaCabecalho = 200; // ajuste conforme sua página (header, filtros, margens)
      const alturaRodape = 100; // espaço do footer/paginação
      const alturaDisponivel = alturaTela - alturaCabecalho - alturaRodape;

      const alturaLinha = 56; // altura média de uma <tr> (~56px)
      const maxLinhas = Math.floor(alturaDisponivel / alturaLinha);

      // limitar mínimo e máximo
      setItemsPerPage(Math.max(5, Math.min(maxLinhas, 15)));
    };

    calcularLinhas();
    window.addEventListener("resize", calcularLinhas);
    return () => window.removeEventListener("resize", calcularLinhas);
  }, []);

  // Modais
  const openConfirmModal = (empresa) =>
    setConfirmModal({ isOpen: true, empresa });

  const openPreferenciasModal = (empresa) => {
    console.log("Abrindo modal de preferências para empresa:", empresa);
    setEmpresaSelecionada(empresa);
    setPreferenciasModalOpen(true);
  };

  const handleConfirm = async (confirmed) => {
    if (confirmed && confirmModal.empresa) {
      try {
        const updatedStatus = !confirmModal.empresa.status;
        const res = await axios.patch(
          `http://127.0.0.1:8000/api/empresas/${confirmModal.empresa.id}/`,
          { status: updatedStatus }
        );
        const empresaAtualizada = res.data;

        setEmpresas((prevEmpresas) =>
          prevEmpresas.map((emp) =>
            emp.id === empresaAtualizada.id ? empresaAtualizada : emp
          )
        );
      } catch (error) {
        console.error("❌ Erro ao atualizar status:", error);
      }
    }
    setConfirmModal({ isOpen: false, empresa: null });
  };

  const handleSaveEmpresa = (novaEmpresa) => {
    setEmpresas((prev) => [...prev, novaEmpresa]);
    setCurrentPage(Math.ceil((empresas.length + 1) / itemsPerPage));
    setCreateModalOpen(false);
  };

  return (
    <div className="p-8 w-full h-screen overflow-hidden flex flex-col bg-gray-50">
      {/* Cabeçalho */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Empresas</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            inputRef={inputRef}
            focused={focused}
            placeholder="Pesquisar empresa..."
          />
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
          >
            + Nova Empresa
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="bg-white shadow-lg rounded-2xl flex-1 flex flex-col overflow-hidden">
        <div className="flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold uppercase sticky top-0 shadow-md">
              <tr>
                <th
                  className="py-4 px-6 cursor-pointer select-none"
                  onClick={toggleSort}
                >
                  Nome
                </th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Preferências</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm divide-y divide-gray-300 border-b border-gray-300">
              {paginated.length > 0 ? (
                paginated.map((empresa) => (
                  <tr key={empresa.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 font-medium">{empresa.nome}</td>
                    <td className="py-4 px-6">
                      <SwitchButton
                        active={empresa.status}
                        onToggle={() => openConfirmModal(empresa)}
                      />
                    </td>
                    <td className="py-4 px-6 pr-16 text-right">
                      <button
                        onClick={() => openPreferenciasModal(empresa)}
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
                    colSpan="3"
                    className="py-6 text-center text-gray-500 italic"
                  >
                    Nenhuma empresa encontrada 🚫
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-50 shadow-[0_-2px_4px_rgba(0,0,0,0.1)]">
          <span className="text-sm text-gray-600">
            {filtered.length} empresas encontradas
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Modais */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-96 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              ⚠️ Confirmar Ação
            </h2>
            <p className="mb-6 text-gray-600">
              Deseja realmente alterar o status da empresa{" "}
              <strong>{confirmModal.empresa?.nome}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleConfirm(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {createModalOpen && (
        <CreatEmpresa
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={handleSaveEmpresa}
        />
      )}

      {preferenciasModalOpen && (
        <PreferenciasEmpresa
          empresa={empresaSelecionada}
          onClose={() => setPreferenciasModalOpen(false)}
          onSave={async (prefsAtualizados) => {
            try {
              const res = await axios.patch(
                `http://127.0.0.1:8000/api/empresas/${empresaSelecionada.id}/`,
                prefsAtualizados
              );
              const empresaAtualizada = res.data;

              setEmpresas((prev) =>
                prev.map((emp) =>
                  emp.id === empresaAtualizada.id ? empresaAtualizada : emp
                )
              );
              setEmpresaSelecionada(empresaAtualizada);
              setPreferenciasModalOpen(false);
            } catch (error) {
              console.error("Erro ao atualizar preferências:", error);
              alert(
                "Não foi possível atualizar as preferências. Tente novamente."
              );
            }
          }}
        />
      )}
    </div>
  );
};

export default Empresas;
