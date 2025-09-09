import {
  FaHome,
  FaUser,
  FaCog,
  FaEnvelope,
  FaBell,
  FaChartLine,
  FaCalendar,
  FaBook,
  FaFile,
  FaSearch,
  FaHeart,
  FaStar,
  FaTemperatureHigh,
  FaBuilding,
} from "react-icons/fa";
import { FaWarehouse } from "react-icons/fa6"; // ✅ Ícone de armazém (fa6)

export const menuItems = [
  { icon: <FaHome />, text: "Home", to: "/" },
  { icon: <FaBuilding />, text: "Empresas", to: "/empresas" },
  { icon: <FaWarehouse />, text: "Armazéns", to: "/armazens" },
  { icon: <FaTemperatureHigh  />, text: "Sensores", to: "/sensores" },
];
