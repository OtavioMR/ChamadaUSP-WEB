import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../../src/css/turmas.css";

/* ================== TIPAGENS ================== */
interface Chamada {
    id: number;
    codigoChamada: string;
    criadaEm: string;
    turma: {
        nomeCurso: string;
    };
}

export function ChamadasProfessor() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState("chamadas");
    const [chamadas, setChamadas] = useState<Chamada[]>([]);

    const navigate = useNavigate();

    const handleMenuSelect = (menu: string) => {
        setActiveMenu(menu);
        if (menu === "conta") navigate("/conta-professor");
        if (menu === "geral") navigate("/geral-professor");
        if (menu === "qrcode") navigate("/gerar-qrcode");
    };

    const handleSidebarToggle = (collapsed: boolean) => {
        setSidebarCollapsed(collapsed);
    };

    useEffect(() => {
        const carregarChamadas = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await api.get("/chamada/buscar-chamadas", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setChamadas(res.data ?? []);
            } catch (err) {
                console.error("Erro ao buscar chamadas:", err);
            }
        };

        carregarChamadas();
    }, []);

    const ChamadaCard = (chamada: Chamada) => (
        <div
            key={chamada.id}
            className="turma-card"
            onClick={() => navigate(`/professor/presenca/listar/${chamada.codigoChamada}`)}
        >
            <h3>{chamada.turma.nomeCurso}</h3>

            <div className="turma-info">
                <span>
                    <strong>Criada em:</strong>{" "}
                    {new Date(chamada.criadaEm).toLocaleDateString("pt-BR")}
                </span>

                <span className="codigo">
                    {chamada.codigoChamada}
                </span>
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
                        <h2>Minhas Chamadas</h2>
                        <p>Toque ou clique em uma chamada para ver detalhes</p>
                    </div>

                    <div className="turmas-lista">
                        {chamadas.length > 0 ? (
                            chamadas.map((chamada) => ChamadaCard(chamada))
                        ) : (
                            <div className="turma-vazia">
                                <i className="bi bi-inbox"></i>
                                <p>Nenhuma chamada ainda</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
