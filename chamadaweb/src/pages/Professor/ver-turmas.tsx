import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../../src/css/turmas.css";

/* ================== TIPAGENS DECENTES ================== */
interface Materia {
  id: number;
  nomeMateria: string;
}

interface Turma {
  id: number;
  nomeCurso: string;
  ano: string;
  semestre: string;
  codigo: string;
  materia: Materia | null;
}

export function VerTurmas() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("geral");
  const [turmas, setTurmas] = useState<Turma[]>([]);

  const navigate = useNavigate();

  const handleMenuSelect = (menu: string) => {
    setActiveMenu(menu);
    if (menu === "conta") navigate("/conta-professor");
    if (menu === "geral") navigate("/geral-professor");
    if (menu === "qrcode") navigate("/gerar-qrcode")
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  useEffect(() => {
    const carregarTurmas = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/turma/ver-turmas", {
          headers: { Authorization: `Bearer ${token}` },
        });


        setTurmas(res.data.turmas ?? []);
      } catch (err) {
        console.error("Erro ao buscar turmas:", err);
      }
    };

    carregarTurmas();
  }, []);

  const TurmaCard = (turma: Turma) => (
    <div
      key={turma.id}
      className="turma-card"
      onClick={() => navigate(`/turma/${turma.id}`)}
    >
      <h3>{turma.nomeCurso}</h3>

      <div className="turma-info">
        <span>
          <strong>Ano:</strong> {turma.ano}
        </span>

        <span>
          <strong>Matéria:</strong>{" "}
          {turma.materia ? turma.materia.nomeMateria : "Nenhuma matéria vinculada"}
        </span>



        <span>
          <strong>Semestre:</strong> {turma.semestre}º
        </span>

        <span className="codigo">{turma.codigo}</span>


      </div>
    </div>
  );

  return (
    <div className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
      <Sidebar
        onMenuSelect={handleMenuSelect}
        activeMenu={activeMenu}
        onToggle={handleSidebarToggle}
      />

      <div className="turmas-page">
        <div className="turmas-container">
          <div className="turmas-header">
            <h2>Minhas Turmas</h2>
            <p>Toque ou clique em uma turma para ver detalhes</p>
          </div>

          <div className="turmas-lista">
            {turmas.length > 0 ? (
              turmas.map((turma) => TurmaCard(turma))
            ) : (
              <div className="turma-vazia">
                <i className="bi bi-inbox"></i>
                <p>Nenhuma turma cadastrada ainda</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
