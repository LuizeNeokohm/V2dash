import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateSensor = ({ onClose, defaultValues = {}, armazem }) => {
  const [serverError, setServerError] = useState(null);
  const [sensores, setSensores] = useState([]);
  const [quantidade, setQuantidade] = useState(1);
  const [instaladores] = useState([
    { id: "1", NomeFantasia: "Instalador Alpha" },
    { id: "2", NomeFantasia: "Instalador Beta" },
    { id: "3", NomeFantasia: "Instalador Gamma" },
  ]);
  const [armazens, setArmazens] = useState([]);
  const [armazemSelecionado, setArmazemSelecionado] = useState(
    armazem?.id ? String(armazem.id) : ""
  );
  const [loading, setLoading] = useState(false);

  // Carregar lista de armazéns somente se não vier do parent
  useEffect(() => {
    if (armazem?.id) {
      console.log("Armazém vindo do parent:", armazem);
      setArmazens([{ id: armazem.id, nome: armazem.nome }]);
      setArmazemSelecionado(String(armazem.id));
    } else {
      const fetchArmazens = async () => {
        try {
          const res = await axios.get("http://127.0.0.1:8000/api/armazens/");
          const lista = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.results)
            ? res.data.results
            : [];
          console.log("Armazéns carregados da API:", lista);
          setArmazens(lista);
        } catch (err) {
          console.error("Erro ao carregar armazéns:", err);
          setArmazens([]);
        }
      };
      fetchArmazens();
    }
  }, [armazem]);

  // Inicializar sensores
  useEffect(() => {
    const novosSensores = Array.from({ length: quantidade }, (_, i) => ({
      id: i,
      sensorId: defaultValues.sensorId || "",
      nome: defaultValues.nome || "",
      dataInstalacao: defaultValues.dataInstalacao || "",
      instalador: defaultValues.instalador || "",
    }));
    console.log("Sensores inicializados:", novosSensores);
    setSensores(novosSensores);
  }, [
    quantidade,
    defaultValues.sensorId,
    defaultValues.nome,
    defaultValues.dataInstalacao,
    defaultValues.instalador,
  ]);

  const handleChangeSensor = (index, field, value) => {
    setSensores((prev) => {
      const novosSensores = [...prev];
      novosSensores[index][field] = value;
      console.log(`Alterado campo "${field}" do sensor ${index}:`, value);
      return novosSensores;
    });
  };

  const handleSave = async () => {
    if (!armazemSelecionado) {
      setServerError("Selecione um armazém.");
      return;
    }

    for (let s of sensores) {
      if (!s.sensorId || !s.nome || !s.dataInstalacao || !s.instalador) {
        setServerError("Preencha todos os campos dos sensores.");
        return;
      }
    }

    setServerError(null);

    const sensoresCompletos = sensores.map((s) => ({
      id: s.sensorId,
      nome: s.nome,
      data_inst: s.dataInstalacao,
      instalador_id: s.instalador,
      armazem: Number(armazemSelecionado),
      faixa_temp: false,
      minima: null,
      maxima: null,
    }));

    try {
      setLoading(true);

      await Promise.all(
        sensoresCompletos.map((sensor) =>
          axios.post("http://127.0.0.1:8000/api/sensores/", sensor)
        )
      );

      alert("Sensores salvos com sucesso!");
      onClose();
    } catch (err) {
      console.error("❌ Erro ao salvar sensores:", err.response?.data || err);
      setServerError("Erro ao salvar sensores. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getGridCols = () => {
    if (sensores.length === 1) return "grid-cols-1";
    if (sensores.length === 2) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1 md:grid-cols-3";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-5xl p-8 z-10 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Criar Sensores
        </h2>

        {serverError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {serverError}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Armazém
            </label>

            {armazem?.id ? (
              <input
                type="text"
                value={armazem.nome}
                disabled
                className="w-full border rounded-lg py-2 px-3 bg-gray-100 cursor-not-allowed"
              />
            ) : (
              <select
                value={armazemSelecionado}
                onChange={(e) => {
                  console.log("Armazém selecionado:", e.target.value);
                  setArmazemSelecionado(e.target.value);
                }}
                className="w-full border rounded-lg py-2 px-3"
              >
                <option value="">Selecione armazém...</option>
                {armazens.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nome}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade de Sensores
            </label>
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              onBlur={(e) => {
                let valor = Number(e.target.value);
                if (isNaN(valor) || valor < 1) {
                  valor = 1; // corrige se for vazio, 0 ou negativo
                }
                setQuantidade(valor);
              }}
              className="w-full border rounded-lg py-2 px-3"
            />
          </div>
        </div>

        <div
          className={`grid gap-4 max-h-[280px] overflow-y-auto pr-2 ${getGridCols()}`}
        >
          {sensores.map((sensor, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 shadow-sm bg-gray-50 w-full"
            >
              <h3 className="font-semibold text-gray-700 mb-3">
                Sensor {index + 1}
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="ID do Sensor"
                  value={sensor.sensorId}
                  onChange={(e) =>
                    handleChangeSensor(index, "sensorId", e.target.value)
                  }
                  className="w-full border rounded-lg py-2 px-3"
                />
                <input
                  type="text"
                  placeholder="Nome"
                  value={sensor.nome}
                  onChange={(e) =>
                    handleChangeSensor(index, "nome", e.target.value)
                  }
                  className="w-full border rounded-lg py-2 px-3"
                />
                <input
                  type="date"
                  value={sensor.dataInstalacao}
                  onChange={(e) =>
                    handleChangeSensor(index, "dataInstalacao", e.target.value)
                  }
                  className="w-full border rounded-lg py-2 px-3"
                />
                <select
                  value={sensor.instalador}
                  onChange={(e) =>
                    handleChangeSensor(index, "instalador", e.target.value)
                  }
                  className="w-full border rounded-lg py-2 px-3"
                >
                  <option value="">Selecione instalador...</option>
                  {instaladores.map((i, idx) => (
                    <option key={`${i.id}-${idx}`} value={i.id}>
                      {i.NomeFantasia}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSensor;
