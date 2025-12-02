import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import api from "../../services/api";
import "../../../src/css/criarTurma.css";

interface Materia {
    id: number;
    nomeMateria: string;
}

export function CriarTurma() {
    const navigate = useNavigate();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState("geral");

    // Formulário
    const [nomeCurso, setNomeCurso] = useState("");
    const [ano, setAno] = useState("");
    const [semestre, setSemestre] = useState("");
    const [materiasIds, setMateriaId] = useState<number | null>(null); // ID da matéria selecionada
    const [novaMateria, setNovaMateria] = useState(""); // Para criar nova matéria (opcional)

    // Matérias
    const [materias, setMaterias] = useState<Materia[]>([]);
    const [loadingMaterias, setLoadingMaterias] = useState(true);
    const [errorMaterias, setErrorMaterias] = useState<string | null>(null);

    // Sidebar
    const handleMenuSelect = (menu: string) => {
        setActiveMenu(menu);
        if (menu === "conta") navigate("/conta-professor");
        if (menu === "geral") navigate("/geral-professor");
    };

    const handleSidebarToggle = (collapsed: boolean) => {
        setSidebarCollapsed(collapsed);
    };

    // Buscar matérias do professor ao carregar
    useEffect(() => {
        const fetchMaterias = async () => {
            try {
                setLoadingMaterias(true);
                const token = localStorage.getItem("token");
                const response = await api.get("/materia/minhas-materias", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMaterias(response.data);
            } catch (error: any) {
                setErrorMaterias(error.response?.data?.message || "Erro ao carregar matérias");
            } finally {
                setLoadingMaterias(false);
            }
        };

        fetchMaterias();
    }, []);

    // Criar turma
    const handleCriarTurma = async () => {
        if (!nomeCurso.trim() || !ano.trim() || !semestre || !materiasIds) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const payload: any = {
                nomeCurso: nomeCurso.trim(),
                ano: parseInt(ano),
                semestre: parseInt(semestre),
                materiasIds,
            };

            // Se o professor digitou uma nova matéria, envia o nome dela também
            if (novaMateria.trim()) {
                payload.novaMateriaNome = novaMateria.trim();
            }

            await api.post("/turma/criar-turma", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

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

            <div className="criar-turma-wrapper">
                <div className="container-fluid px-4">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                            <div className="form-card">
                                <h2 className="text-center fw-bold mb-3">Criar Nova Turma</h2>
                                <p className="text-center text-muted mb-4">
                                    Preencha os dados da nova turma
                                </p>

                                {/* Nome do Curso */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Nome da Turma</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        value={nomeCurso}
                                        onChange={(e) => setNomeCurso(e.target.value)}
                                        placeholder="Ex: Matemática 2°Semestre"
                                    />
                                </div>

                                {/* Ano e Semestre */}
                                <div className="row g-3 mb-4">
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Ano</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            value={ano}
                                            onChange={(e) => setAno(e.target.value.replace(/\D/g, "").slice(0, 4))}
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

                                {/* Matéria */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        Matéria <span className="text-danger">*</span>
                                    </label>
                                    {loadingMaterias ? (
                                        <p className="text-muted">Carregando matérias...</p>
                                    ) : errorMaterias ? (
                                        <p className="text-danger">{errorMaterias}</p>
                                    ) : (
                                        <select
                                            className="form-select form-select-lg"
                                            value={materiasIds || ""}
                                            onChange={(e) => setMateriaId(Number(e.target.value))}
                                        >
                                            <option value="">Selecione uma matéria</option>
                                            {materias.map((materia) => (
                                                <option key={materia.id} value={materia.id}>
                                                    {materia.nomeMateria}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* Campo opcional para nova matéria */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-muted">
                                        Ou digite uma nova matéria (opcional)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        value={novaMateria}
                                        onChange={(e) => setNovaMateria(e.target.value)}
                                        placeholder="Ex: Redes"
                                    />
                                    <small className="text-muted">
                                        Deixe em branco se for usar uma matéria já existente
                                    </small>
                                </div>

                                {/* Botões */}
                                <div className="botao-container">
                                    <button className="botao-criar" onClick={handleCriarTurma}>
                                        Criar Turma
                                    </button>
                                    <button
                                        className="botao-cancelar"
                                        onClick={() => navigate("/geral-professor")}
                                    >
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