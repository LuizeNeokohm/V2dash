import React, { useState, useEffect } from "react";
import axios from "axios";
import useForm from "../../hooks/useForm";
import CreateSensor from "./CreateSensor";

const CreatArmazem = ({ onClose, onSave, existingArmazem = null }) => {
  const [empresas, setEmpresas] = useState([]);
  const [instaladores, setInstaladores] = useState([
    { id: "1", NomeFantasia: "Instalador Alpha" },
    { id: "2", NomeFantasia: "Instalador Beta" },
    { id: "3", NomeFantasia: "Instalador Gamma" },
  ]);

  const [showSensorModal, setShowSensorModal] = useState(false);
  const [armazemPayload, setArmazemPayload] = useState(existingArmazem || null);

  const { values, handleChange, resetForm } = useForm({
    nome: existingArmazem?.nome || "",
    empresa: existingArmazem?.empresa || "",
    gatewayId: existingArmazem?.gatewayId || "",
    latitude: existingArmazem?.latitude || "",
    longitude: existingArmazem?.longitude || "",
    dataInstalacao: existingArmazem?.dataInstalacao || "",
    instalador: existingArmazem?.instalador || "",
  });

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/empresas/");
        const lista = Array.isArray(res.data.results)
          ? res.data.results
          : res.data;

        console.log("Empresas carregadas da API:", lista);

        setEmpresas(lista.filter((e) => e.armazem === true));
      } catch (err) {
        console.error("Erro ao carregar empresas:", err);
        setEmpresas([]);
      }
    };

    fetchEmpresas();
  }, []);

  const handleSaveArmazem = async () => {
    console.log("Iniciando salvamento do armazém...");
    console.log("Valores atuais do formulário:", values);

    if (
      !values.nome ||
      !values.empresa ||
      !values.gatewayId ||
      !values.latitude ||
      !values.longitude ||
      !values.dataInstalacao ||
      !values.instalador
    ) {
      alert("Por favor, preencha todos os campos antes de continuar.");
      console.warn("Campos obrigatórios faltando!");
      return;
    }

    const payload = {
      nome: values.nome,
      empresa: values.empresa,
      gateway_id: values.gatewayId, // corrigido
      latitude: parseFloat(values.latitude),
      longitude: parseFloat(values.longitude),
      data_instalacao: values.dataInstalacao, // corrigido
      instalador: values.instalador,
    };

    try {
      // 🔥 salva o armazém primeiro
      const res = await axios.post(
        "http://127.0.0.1:8000/api/armazens/",
        payload
      );
      const armazemSalvo = res.data;
      console.log("Armazém salvo com sucesso:", armazemSalvo);

      setArmazemPayload(armazemSalvo); // agora tem o ID real
      setShowSensorModal(true); // só abre depois que o armazém existe
    } catch (error) {
      console.error("Erro ao salvar armazém:", error.response?.data || error);
      alert("Erro ao salvar armazém. Verifique os dados.");
    }
  };

  const handleSensorSave = async (sensoresPayload) => {
    try {
      console.log("Salvando sensores vinculados ao armazém:", armazemPayload);

      for (const sensor of sensoresPayload) {
        const payloadSensor = {
          ...sensor,
          armazem: armazemPayload.id, // ✅ já tem o id real do banco
        };
        await axios.post("http://127.0.0.1:8000/api/sensores/", payloadSensor);
        console.log("Sensor salvo:", payloadSensor);
      }

      alert("Armazém e sensores salvos com sucesso!");

      // Atualiza lista na tela pai
      onSave?.({ armazem: armazemSalvo, sensores: sensoresPayload });

      // Fecha modal de sensores + modal de armazém
      resetForm();
      setShowSensorModal(false);
      onClose?.();
    } catch (error) {
      console.error("Erro ao salvar sensores:", error.response?.data || error);
      alert("Erro ao salvar sensores. Nada foi gravado.");
    }
  };

  return (
    <>
      {!existingArmazem && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/30"
            onClick={onClose}
          />
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-2xl p-8 z-10 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">
              Criar Novo Armazém
            </h2>

            <div className="flex gap-4">
              <input
                placeholder="Nome do Armazém"
                value={values.nome}
                onChange={(e) => {
                  console.log("Alterado nome:", e.target.value);
                  handleChange("nome", e.target.value);
                }}
                className="w-1/2 border rounded-lg py-2 px-3"
              />
              <select
                value={values.empresa}
                onChange={(e) => {
                  console.log("Empresa selecionada:", e.target.value);
                  handleChange("empresa", e.target.value);
                }}
                className="w-1/2 border rounded-lg py-2 px-3"
              >
                <option value="">Selecione Empresa</option>
                {empresas.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome}
                  </option>
                ))}
              </select>
            </div>

            <input
              placeholder="Gateway ID"
              value={values.gatewayId}
              onChange={(e) => {
                console.log("Gateway ID alterado:", e.target.value);
                handleChange("gatewayId", e.target.value);
              }}
              className="w-full border rounded-lg py-2 px-3 my-4"
            />

            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Latitude"
                value={values.latitude}
                onChange={(e) => {
                  console.log("Latitude alterada:", e.target.value);
                  handleChange("latitude", e.target.value);
                }}
                className="w-1/2 border rounded-lg py-2 px-3"
              />
              <input
                type="number"
                placeholder="Longitude"
                value={values.longitude}
                onChange={(e) => {
                  console.log("Longitude alterada:", e.target.value);
                  handleChange("longitude", e.target.value);
                }}
                className="w-1/2 border rounded-lg py-2 px-3"
              />
            </div>

            <div className="flex gap-4 mt-4">
              <input
                type="date"
                value={values.dataInstalacao}
                onChange={(e) => {
                  console.log("Data de instalação alterada:", e.target.value);
                  handleChange("dataInstalacao", e.target.value);
                }}
                className="w-1/2 border rounded-lg py-2 px-3"
              />
              <select
                value={values.instalador}
                onChange={(e) => {
                  console.log("Instalador selecionado:", e.target.value);
                  handleChange("instalador", e.target.value);
                }}
                className="w-1/2 border rounded-lg py-2 px-3"
              >
                <option value="">Selecione Instalador</option>
                {instaladores.map((i, idx) => (
                  <option key={`${i.id}-${idx}`} value={i.id}>
                    {i.NomeFantasia}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveArmazem}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSensorModal && (
        <CreateSensor
          armazem={armazemPayload || existingArmazem}
          instaladores={instaladores}
          defaultValues={{
            armazem: armazemPayload || existingArmazem,
            dataInstalacao: values.dataInstalacao,
            instalador: values.instalador,
          }}
          onClose={() => {
            console.log("Fechando modal de sensores sem salvar.");
            setShowSensorModal(false);
          }}
          onSave={handleSensorSave}
        />
      )}
    </>
  );
};

export default CreatArmazem;
