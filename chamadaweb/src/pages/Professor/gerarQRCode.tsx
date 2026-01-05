import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaQrcode } from "react-icons/fa";
import QRCode from "react-qr-code";  // Ótima escolha!
import api from "../../services/api";

export function GerarQRCode() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState("geral");

    const [turmas, setTurmas] = useState<any[]>([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState("");

    // Novo estado: guarda TODA a resposta do backend
    const [chamadaAtiva, setChamadaAtiva] = useState<any>(null);

    const handleMenuSelect = (menu: string) => {
        setActiveMenu(menu);
        if (menu === "conta") navigate("/conta-professor");
        if (menu === "geral") navigate("/geral-professor");
         if(menu === 'chamadas') navigate("/chamadas-professor")
    };

    const handleSidebarToggle = (collapsed: boolean) => {
        setSidebarCollapsed(collapsed);
    };

    // Verifica se já existe chamada aberta para a turma
    const buscarChamadaAberta = async () => {
        if (!turmaSelecionada) {
            alert("Escolhe uma turma primeiro.");
            return;
        }

        try {
            console.log("Gerando QR para turma:", turmaSelecionada); // debug
            const token = localStorage.getItem('token');
            const res = await api.post("/qr-code/gerar",
                { codigoTurma: turmaSelecionada },  // body correto
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setChamadaAtiva(res.data);
            alert(res.data.mensagem); // vai dizer se criou nova ou reutilizou

        } catch (error: any) {
            console.error("Erro ao gerar QR:", error.response);

            if (error.response?.status === 401) {
                // opcional: navigate("/login");
            } else {
                alert(error.response?.data?.mensagem || error.response?.data?.message || "Erro ao gerar QR Code");
            }
        }
    };

    const gerarQRCode = async (codigo: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.post("/qr-code/gerar", { codigoTurma: codigo }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert(res.data.mensagem);
            setChamadaAtiva(res.data);  // Guarda tudo: link, código, turma, etc.

            console.log("Chamada criada:", res.data.codigoChamada);
        } finally {

        }
    };

    useEffect(() => {
        const buscarTurmas = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await api.get("/turma/ver-turmas", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTurmas(res.data.turmas || []);
            } catch (error) {
                console.error("Erro ao buscar turmas:", error);
            }
        };

        buscarTurmas();
    }, []);

    return (
        <div className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
            <Sidebar
                onMenuSelect={handleMenuSelect}
                activeMenu={activeMenu}
                onToggle={handleSidebarToggle}
            />

            <div className="container-fluid px-5 pt-5">
                <h2 className="text-center fw-bold mb-5 text-dark">Gerar Chamada com QR Code</h2>

                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow p-4 text-center">
                            <h5 className="fw-bold mb-3">
                                <FaQrcode className="me-2" />
                                Escolha a turma
                            </h5>

                            <select
                                className="form-select mb-4"
                                value={turmaSelecionada}
                                onChange={(e) => setTurmaSelecionada(e.target.value)}
                            >
                                <option value="">Selecione uma turma</option>
                                {turmas.map((turma) => (
                                    <option key={turma.codigo} value={turma.codigo}>
                                        {turma.nomeCurso} - {turma.codigo}
                                    </option>
                                ))}
                            </select>

                            <button
                                className="btn btn-dark w-100 fw-bold"
                                onClick={buscarChamadaAberta}
                            >
                                Gerar QR Code
                            </button>
                        </div>

                        {/* Exibe QR Code se houver chamada ativa (nova ou já existente) */}
                        {chamadaAtiva && (
                            <div className="card shadow mt-5 p-4 text-center">
                                <h5 className="fw-bold mb-4">
                                    QR Code da chamada - Turma {chamadaAtiva.turma}
                                </h5>

                                <div className="d-flex justify-content-center mb-4">
                                    <QRCode
                                        value={chamadaAtiva.link}
                                        size={300}
                                        level="H"
                                        bgColor="#FFFFFF"
                                        fgColor="#000000"
                                    // Removido: includeMargin não existe nessa lib
                                    />
                                </div>

                                <div className="text-start px-4">
                                    <p><strong>Código da chamada:</strong> {chamadaAtiva.codigoChamada}</p>
                                    <p className="text-muted small">
                                        {chamadaAtiva.descricao || "Alunos só precisam escanear isso pra registrar presença"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}