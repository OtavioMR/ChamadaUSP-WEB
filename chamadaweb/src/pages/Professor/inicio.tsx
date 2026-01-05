import Sidebar from "../../components/Sidebar";
import { useState } from "react";
import { FaPlusCircle, FaUsers, FaCog, FaQrcode } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../../src/css/inicioProfessor.css";

export function InicioProfessor() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("geral");

  const handleMenuSelect = (menu: string) => {
    setActiveMenu(menu);
    if (menu === "conta") navigate("/conta-professor");
     if(menu === 'chamadas') navigate("/chamadas-professor")
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const cards = [
    { icon: <FaPlusCircle />, title: "Criar Turma", route: "/criar-turma" },
    { icon: <FaQrcode />, title: "Gerar Chamada", route: "/gerar-qrcode" },
    { icon: <FaUsers />, title: "Ver Turmas", route: "/turmas-professor" },
  ];

  return (
    <div className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
      <Sidebar
        onMenuSelect={handleMenuSelect}
        activeMenu={activeMenu}
        onToggle={handleSidebarToggle}
      />

      {/* ============ VERSÃO MOBILE (até 768px) ============ */}
      <div className="d-block d-md-none mobile-dashboard">
        <div className="container-fluid px-4 pt-4">
          <h2 className="text-center fw-bold mb-4 text-dark">Bem-vindo!</h2>
          <div className="row row-cols-1 g-4">
            {cards.map((card, i) => (
              <div key={i} className="col">
                <div
                  className="opcoes-turma-card"
                  onClick={() => card.route !== "#" && navigate(card.route)}
                  style={{ cursor: card.route !== "#" ? "pointer" : "default" }}
                >
                  <div className="opcoes-turma-icone">{card.icon}</div>
                  <div className="opcoes-turma-titulo">{card.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ VERSÃO DESKTOP/TABLET (768px pra cima) ============ */}
      <div className="d-none d-md-flex desktop-dashboard align-items-center justify-content-center min-vh-100">
        <div className="container-fluid px-5">
          <h2 className="text-center fw-bold mb-5 text-dark">Bem-vindo, Professor!</h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-5 justify-content-center">
            {cards.map((card, i) => (
              <div key={i} className="col">
                <div
                  className="opcoes-turma-card"
                  onClick={() => card.route !== "#" && navigate(card.route)}
                  style={{ cursor: card.route !== "#" ? "pointer" : "default" }}
                >
                  <div className="opcoes-turma-icone">{card.icon}</div>
                  <div className="opcoes-turma-titulo">{card.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}