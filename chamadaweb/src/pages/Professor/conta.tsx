import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../../src/css/contaProfessor.css";

export function ContaProfessor() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("conta");

  const [nomeCompleto, setNome] = useState("");
  const [emailUSP, setEmail] = useState("");
  const [id, setId] = useState("");
  const [role, setRole] = useState("");

  const handleMenuSelect = (menu: string) => {
    setActiveMenu(menu);
    if (menu === "geral") navigate("/geral-professor");
    if (menu === "qrcode") navigate("/gerar-qrcode");
    if (menu === 'chamadas') navigate("/chamadas-professor")
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const getRoleFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return "Professor";
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || "Professor";
    } catch {
      return "Professor";
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/professor/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNome(res.data.nomeCompleto);
        setEmail(res.data.emailUSP);
        setId(res.data.id);
        setRole(getRoleFromToken());
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login-professor");
  };

  return (
    <div className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
      <Sidebar
        onMenuSelect={handleMenuSelect}
        activeMenu={activeMenu}
        onToggle={handleSidebarToggle}
      />

      {/* CARD COMPACTO E LINDO */}
      <div className="conta-wrapper">
        <div className="conta-card">

          <div className="conta-header">
            <h2>Minha Conta</h2>
          </div>

          <div className="conta-body">
            <div className="info">
              <span className="label">Nome completo</span>
              <span className="value">{nomeCompleto || "..."}</span>
            </div>

            <div className="info">
              <span className="label">Email USP</span>
              <span className="value">{emailUSP || "..."}</span>
            </div>

            <div className="info">
              <span className="label">ID</span>
              <span className="value">{id || "..."}</span>
            </div>

            <div className="info">
              <span className="label">Tipo de usuário</span>
              <span className="value">{role}</span>
            </div>

            <div className="info">
              <span className="label">Conta criada em</span>
              <span className="value">10/10/2024</span>
            </div>

            <div className="botoes">
              <button className="btn-editar">Editar dados</button>
              <button className="btn-sair" onClick={logout}>Sair</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}