import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaQrcode } from "react-icons/fa";
import QRCode from "react-qr-code";
import api from "../../services/api";

export function GerarQRCode() {

    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState("geral");

    const [turmas, setTurmas] = useState<any[]>([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState("");
    const [qrCodeData, setQrCodeData] = useState("");

    const handleMenuSelect = (menu: string) => {
        setActiveMenu(menu);
        if (menu === "conta") navigate("/conta-professor");
        if (menu === "geral") navigate("/geral-professor");
    };

    const handleSidebarToggle = (collapsed: boolean) => {
        setSidebarCollapsed(collapsed);
    };

    useEffect(() => {
        const buscarTurmas = async () => {
            try {
                const token = localStorage.getItem("token");

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

    const gerarQRCode = () => {
        if (!turmaSelecionada) {
            alert("Escolhe uma turma");
            return;
        }

        const data = JSON.stringify({
            turmaId: turmaSelecionada,
            data: new Date().toISOString()
        });

        setQrCodeData(data);
    };

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
                                    <option key={turma.id} value={turma.id}>
                                        {turma.nomeCurso} - {turma.codigo}
                                    </option>
                                ))}
                            </select>

                            <button
                                className="btn btn-dark w-100 fw-bold"
                                onClick={gerarQRCode}
                            >
                                Gerar QR Code
                            </button>
                        </div>

                        {qrCodeData && (
                            <div className="card shadow mt-5 p-4 text-center">
                                <h5 className="fw-bold mb-4">
                                    QR Code da chamada
                                </h5>

                                <div className="d-flex justify-content-center">
                                    <QRCode 
                                        value={qrCodeData}
                                        size={300}
                                        level="H"
                                    />
                                </div>

                                <p className="mt-3 text-muted small">
                                    Alunos só precisam escanear isso pra registrar presença
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
