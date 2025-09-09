import React from "react";

const Termometro = ({ temperatura }) => {
  const temp = Math.max(0, Math.min(temperatura, 100));
  const maxAltura = 143.25;
  const maxY = 165;
  const alturaPreenchimento = (temp / 100) * maxAltura;
  const yPos = maxY - alturaPreenchimento;

  return (
    <svg height="140px" width="50px" viewBox="0 0 120 200">
      <circle r="17.75" cx="60" cy="21.75" style={{ fill: "#fff", stroke: "#ccc", strokeWidth: "1.5mm" }} />
      <rect x="42.25" y="21.75" height="147.25" width="35.5" style={{ fill: "#fff", stroke: "#ccc", strokeWidth: "1.5mm" }} />
      <circle r="14.75" cx="60" cy="21.75" style={{ fill: "#fff", stroke: "none" }} />
      <circle r="30" cx="60" cy="165" style={{ fill: "#fff", stroke: "#ccc", strokeWidth: "1.5mm" }} />

      <circle r="20" cx="60" cy="165" style={{ fill: "rgb(34,72,189)", stroke: "rgb(34,72,189)", strokeWidth: 4 }} />
      
      <rect
        x="50.25"
        y={yPos}
        width="19.5"
        height={alturaPreenchimento}
        style={{ fill: "rgb(34,72,189)" }}
      />

      <circle r="9.7" cx="60" cy={yPos} style={{ fill: "rgb(34,72,189)" }} />
    </svg>
  );
};

export default Termometro;
