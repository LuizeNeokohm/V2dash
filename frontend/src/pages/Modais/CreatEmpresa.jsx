import React, { useState, useCallback } from "react";
import SwitchButton from "../../components/SwitchButton";
import useForm from "../../hooks/useForm";

const CreatEmpresa = ({ isOpen, onClose, onSave }) => {
  const {
    values,
    errors,
    errorMessage,
    handleChange,
    validate,
    resetForm,
  } = useForm({
    nome: "",
    conectividade: false,
    armazem: false,
  });

  const [serverError, setServerError] = useState(null);
  const [focused, setFocused] = useState(false);

  const handleSave = useCallback(async () => {
    setServerError(null);
    if (!validate(["nome"])) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/empresas/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Erro ao salvar:", errorData);
        setServerError(
          errorData?.nome?.[0] ||
            "Não foi possível salvar a empresa. Verifique os dados."
        );
        return;
      }

      const novaEmpresa = await res.json();
      console.log("Empresa salva:", novaEmpresa);
      onSave?.(novaEmpresa);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Erro de conexão:", error);
      setServerError("Falha de conexão com o servidor.");
    }
  }, [values, validate, resetForm, onClose, onSave]);

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md p-8 z-10 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">
          Criar Nova Empresa
        </h2>

        {(errorMessage || serverError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {errorMessage || serverError}
          </div>
        )}

        <div className="mb-6 relative w-full">
          <label
            htmlFor="nome"
            className={`absolute left-3 text-gray-400 transition-all duration-200 cursor-text ${
              focused || values.nome ? "-top-2 text-xs bg-white px-1" : "top-2"
            }`}
          >
            Nome da Empresa
          </label>
          <input
            id="nome"
            type="text"
            value={values.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 ${
              errors.nome
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
        </div>

        <div className="space-y-3">
          {[
            { label: "Conectividade", key: "conectividade" },
            { label: "Armazéns", key: "armazem" },
          ].map(({ label, key }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">{label}</span>
              <SwitchButton
                active={values[key]}
                onToggle={() => handleChange(key, !values[key])}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-1 mt-8">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatEmpresa;