import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";

interface Aluno {
    nome: string;
    email: string;
    numeroUSP: string;
    dataHora: string;
}

interface PresencaResponse {
    codigoChamada: string;
    turmaCodigo: string;
    materia: string;
    totalPresentes: number;
    alunos: Aluno[];
    nomeCurso: string;
}

export default function Presencas() {
    const navigate = useNavigate();
    const { codigo } = useParams<{ codigo: string }>();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState("chamadas");

    const [presenca, setPresenca] = useState<PresencaResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const handleMenuSelect = (menu: string) => {
        setActiveMenu(menu);
        if (menu === "conta") navigate("/conta-professor");
        if (menu === "geral") navigate("/geral-professor");
        if (menu === "qrcode") navigate("/gerar-qrcode");
        if (menu === "chamadas") navigate("/chamadas-professor");
    };

    const handleSidebarToggle = (collapsed: boolean) => {
        setSidebarCollapsed(collapsed);
    };

    useEffect(() => {
        const buscarPresencas = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await api.get(`/chamada/lista-presencas/${codigo}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPresenca(res.data);
            } catch (err: any) {
                setErro(err.response?.data?.mensagem ?? "Erro desconhecido");
            } finally {
                setLoading(false);
            }
        };

        buscarPresencas();
    }, [codigo]);

    if (loading) return <p>Carregando...</p>;
    if (erro) return <p>{erro}</p>;

    const baixarExcel = () => {
        if (!presenca) return;

        const dados = presenca.alunos.map(aluno => ({
            Nome: aluno.nome,
            Email: aluno.email,
            "Número USP": aluno.numeroUSP,
            "Data/Hora": new Date(aluno.dataHora).toLocaleString("pt-BR")
        }));

        const worksheet = XLSX.utils.json_to_sheet(dados);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Presenças");
        XLSX.writeFile(workbook, `presenca-${presenca.codigoChamada}.xlsx`);
    };

    return (
        <div className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
            <Sidebar
                onMenuSelect={handleMenuSelect}
                activeMenu={activeMenu}
                onToggle={handleSidebarToggle}
            />

            <div className="container py-3">
                <div className="row text-center mb-3">
                    <div className="col-12">
                        <h1 className="fs-4 fs-md-2">
                            Presenças – {presenca?.nomeCurso}
                        </h1>
                        <p className="mb-1">
                            <strong>Turma:</strong> {presenca?.turmaCodigo}
                        </p>
                        <p className="mb-3">
                            <strong>Total de presentes:</strong> {presenca?.totalPresentes}
                        </p>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-12 d-flex justify-content-center justify-content-md-start">
                        <button className="btn btn-primary" onClick={baixarExcel}>
                            Baixar Excel
                        </button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="table-responsive">
                            <table className="table table-bordered border-primary align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Nome</th>
                                        <th>Email</th>
                                        <th>Número USP</th>
                                        <th>Horário</th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {presenca?.alunos.map((aluno, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{aluno.nome}</td>
                                            <td>{aluno.email}</td>
                                            <td>{aluno.numeroUSP}</td>
                                            <td>
                                                {new Date(aluno.dataHora).toLocaleString("pt-BR")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
