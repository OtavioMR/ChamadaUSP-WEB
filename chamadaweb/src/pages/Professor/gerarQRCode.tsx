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
    const [chamadaAtiva, setChamadaAtiva] = useState<any>(null);

    var [tempoRestante, setTempoRestante] = useState<number>(0);

    const handleMenuSelect = (menu: string) => {
        setActiveMenu(menu);
        if (menu === "conta") navigate("/conta-professor");
        if (menu === "geral") navigate("/geral-professor");
        if (menu === "chamadas") navigate("/chamadas-professor");
    };

    const handleSidebarToggle = (collapsed: boolean) => {
        setSidebarCollapsed(collapsed);
    };

    const buscarChamadaAberta = async () => {
        if (!turmaSelecionada) {
            alert("Escolhe uma turma primeiro.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const res = await api.post(
                "/qr-code/gerar",
                { codigoTurma: turmaSelecionada },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setChamadaAtiva(res.data);
            alert(res.data.mensagem);

        } catch (error: any) {
            alert(
                error.response?.data?.mensagem ||
                error.response?.data?.message ||
                "Erro ao gerar QR Code"
            );
        }
    };

    /**
     * 🔥 Contador regressivo do professor
     */
    useEffect(() => {
        if (!chamadaAtiva?.expiraEm) {
            setTempoRestante(0);
            return;
        }

        const dataExpiracao = new Date(
            chamadaAtiva.expiraEm
        ).getTime();

        const calcular = () => {
            const diferenca = Math.floor(
                (dataExpiracao - Date.now()) / 1000
            );
            return diferenca > 0 ? diferenca : 0;
        };

        setTempoRestante(calcular());

        const intervalo = setInterval(() => {
            const restante = calcular();
            setTempoRestante(restante);

            if (restante <= 0) {
                clearInterval(intervalo);
            }
        }, 1000);

        return () => clearInterval(intervalo);

    }, [chamadaAtiva]);

    useEffect(() => {
        const buscarTurmas = async () => {
            const token = localStorage.getItem("token");

            try {
                const res = await api.get("/turma/ver-turmas", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setTurmas(res.data.turmas || []);
            } catch (error) {
                console.error("Erro ao buscar turmas:", error);
            }
        };

        buscarTurmas();
    }, []);





    const fecharChamada = async () => {
        const token = localStorage.getItem("token");

        try {
            const payload: any = {
                codigoChamada: chamadaAtiva.codigoChamada,
            };

            await api.patch("/chamada/atualizar-chamada", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Chamada fechada com sucesso!");
            setTempoRestante(0);
            setChamadaAtiva(null); // opcional, se quiser sumir com o QR
        } catch (error: any) {
            alert(error.response?.data?.message || "Erro ao fechar chamada");
        }
    }




    return (
        <div className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
            <Sidebar
                onMenuSelect={handleMenuSelect}
                activeMenu={activeMenu}
                onToggle={handleSidebarToggle}
            />

            <div className="container-fluid px-5 pt-5">
                <h2 className="text-center fw-bold mb-5 text-dark">
                    Gerar Chamada com QR Code
                </h2>

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
                                onChange={(e) =>
                                    setTurmaSelecionada(e.target.value)
                                }
                            >
                                <option value="">
                                    Selecione uma turma
                                </option>
                                {turmas.map((turma) => (
                                    <option
                                        key={turma.codigo}
                                        value={turma.codigo}
                                    >
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

                        {chamadaAtiva && (
                            <div className="card shadow mt-5 p-4 text-center">
                                <h5 className="fw-bold mb-2">
                                    QR Code da chamada - Turma {chamadaAtiva.turma}
                                </h5>

                                {/* 🔥 Contador */}
                                {tempoRestante > 0 ? (
                                    <p
                                        style={{
                                            color: "#d9534f",
                                            fontWeight: "bold",
                                            fontSize: "18px",
                                        }}
                                    >
                                        Expira em{" "}
                                        {Math.floor(tempoRestante / 60)}:
                                        {(tempoRestante % 60)
                                            .toString()
                                            .padStart(2, "0")}
                                    </p>
                                ) : (
                                    <p
                                        style={{
                                            color: "gray",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        QR expirado.
                                    </p>
                                )}

                                <div className="d-flex justify-content-center mb-4">
                                    <QRCode
                                        value={chamadaAtiva.link}
                                        size={300}
                                        level="H"
                                        bgColor="#FFFFFF"
                                        fgColor="#000000"
                                    />
                                </div>

                                <div className="text-start px-4 titulo">
                                    <p>
                                        <strong>Código da chamada:{" "}
                                            {chamadaAtiva.codigoChamada}
                                        </strong>
                                    </p>
                                </div>



                                <div className="col-md-12 d-flex justify-content-center align-itens-center text-center">



                                    <div className="col-md-4">
                                        <div className="btn btn-primary w-100 fw-bold d-flex justify-content-center align-items-center" onClick={fecharChamada}>
                                            Fechar chamada
                                        </div>
                                    </div>




                                </div>


                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
