import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Termometro from "../../components/Termometro";

const ArmazemDetalhe = () => {
  const { empresa, id } = useParams(); // pega os dois parâmetros
  const navigate = useNavigate();
  const [armazem, setArmazem] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://127.0.0.1:8000/api/armazens/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro na resposta da API");
        return res.json();
      })
      .then((data) => setArmazem(data))
      .catch((err) => console.error("Erro ao carregar armazém:", err));
  }, [id]);

  if (!armazem) return <p className="p-6">Carregando...</p>;

  // Sensores mockados (até integrar com API real)
  const sensores = Array.from(
    { length: armazem.qtd_sensores || 0 },
    (_, i) => ({
      id: i + 1,
      nome: `Sensor ${i + 1}`,
      temperatura: 20 + i,
      data: new Date().toLocaleDateString(),
    })
  );

  const scatterData = sensores.map((sensor) => ({
    x: sensor.id,
    y: sensor.temperatura,
  }));

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 pt-10">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6 w-full">
        <div>
          <h1 className="text-3xl font-bold">{armazem.nome}</h1>
          <p className="text-gray-600">Empresa: {empresa}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ← Voltar
        </button>
      </div>

      {/* Botão Exportar */}
      <div className="mb-6">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition">
          Exportar Relatório
        </button>
      </div>

      {/* Caixa branca com os cards */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full min-h-[70vh]">
        <div className="flex flex-wrap gap-4 justify-between">
          {sensores.map((sensor) => (
            <div
              key={sensor.id}
              className="p-4 border rounded-lg shadow hover:shadow-md transition flex-1 min-w-[150px] max-w-[250px]"
            >
              <h3 className="font-bold mb-2">{sensor.nome}</h3>
              <p>Temperatura: {sensor.temperatura} °C</p>
              <p>Data: {sensor.data}</p>

              <Termometro temperatura={sensor.temperatura} />
            </div>
          ))}
        </div>

        {/* Gráfico de Pontos */}
        <div className="mt-10 w-full h-64">
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="Sensor" />
              <YAxis type="number" dataKey="y" name="Temperatura" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="Temperatura" data={scatterData} fill="#ff7300" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ArmazemDetalhe;
