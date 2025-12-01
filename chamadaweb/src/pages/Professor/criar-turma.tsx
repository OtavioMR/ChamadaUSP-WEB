import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useState } from "react";
import api from "../../services/api";
import "../../../src/css/criarTurma.css";

export function CriarTurma() {
    const navigate = useNavigate();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState("geral");

    const [nomeCurso, setCurso] = useState("");
    const [ano, setAno] = useState("");
    const [semestre, setSemestre] = useState("");

    const handleMenuSelect = (menu: string) => {
        setActiveMenu(menu);
        if (menu === "conta") navigate("/conta-professor");
        if (menu === "geral") navigate("/geral-professor");
    };

    const handleSidebarToggle = (collapsed: boolean) => {
        setSidebarCollapsed(collapsed);
    };

    const handleCriarTurma = async () => {
        if (!nomeCurso || !ano || !semestre) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await api.post(
                "/turma/criar-turma",
                { nomeCurso, ano, semestre },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Turma criada com sucesso!");
            navigate("/turmas-professor");
        } catch (error: any) {
            alert(error.response?.data?.message || "Erro ao criar turma");
        }
    };

    return (
        <div className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
            <Sidebar
                onMenuSelect={handleMenuSelect}
                activeMenu={activeMenu}
                onToggle={handleSidebarToggle}
            />

            {/* Formulário centralizado e bonito */}
            <div className="criar-turma-wrapper">
                <div className="container-fluid px-4">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                            <div className="form-card">
                                <h2 className="text-center fw-bold mb-3">Criar Nova Turma</h2>
                                <p className="text-center text-muted mb-4">
                                    Preencha os dados abaixo
                                </p>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Nome do curso</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        value={nomeCurso}
                                        onChange={(e) => setCurso(e.target.value)}
                                        placeholder="Ex: Matemática Básica"
                                    />
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Ano</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            value={ano}
                                            onChange={(e) => setAno(e.target.value)}
                                            placeholder="2025"
                                            maxLength={4}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Semestre</label>
                                        <select
                                            className="form-select form-select-lg"
                                            value={semestre}
                                            onChange={(e) => setSemestre(e.target.value)}
                                        >
                                            <option value="">Selecione</option>
                                            <option value="1">1º Semestre</option>
                                            <option value="2">2º Semestre</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="botao-container">
                                    <button className="botao-criar" onClick={handleCriarTurma}>
                                        Criar Turma
                                    </button>
                                    <button className="botao-cancelar" onClick={() => navigate("/geral-professor")}>
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}