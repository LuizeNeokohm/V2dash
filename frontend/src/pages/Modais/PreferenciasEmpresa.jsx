import React, { useState, useEffect } from "react";
import SwitchButton from "../../components/SwitchButton";

const PreferenciasEmpresa = ({ empresa, onClose, onSave }) => {
  const [armazem, setArmazem] = useState(false);
  const [conectividade, setConectividade] = useState(false);

  useEffect(() => {
    console.log("Modal aberto para empresa:", empresa);
    setArmazem(empresa?.armazem ?? false);
    setConectividade(empresa?.conectividade ?? false);
    console.log(
      "Estado inicial -> armazem:",
      empresa?.armazem,
      "conectividade:",
      empresa?.conectividade
    );
  }, [empresa]);

  const handleSave = () => {
    const updatedPrefs = { armazem, conectividade };
    console.log("Chamando onSave com dados atualizados...", updatedPrefs);
    onSave(updatedPrefs);
    console.log("Modal fechado após salvar");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30"
        onClick={onClose}
      />

      <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-200 w-full max-w-md z-10 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
          Preferências - {empresa?.nome}
        </h2>

        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-700 font-medium">Conectividade</span>
          <SwitchButton
            active={conectividade}
            onToggle={() => setConectividade(!conectividade)}
          />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-700 font-medium">Armazém</span>
          <SwitchButton
            active={armazem}
            onToggle={() => setArmazem(!armazem)}
          />
        </div>

        <div className="flex justify-end mt-8 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Fechar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferenciasEmpresa;
