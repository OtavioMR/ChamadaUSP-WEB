import "../../../../src/css/login.css";
import { useState, useEffect } from "react";
import api from "../../../services/api";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function LoginAluno() {

    const { codigoChamada, codigoJanela } = useParams<{
        codigoChamada: string;
        codigoJanela: string;
    }>();

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [emailUSP, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [tempoRestante, setTempoRestante] = useState<number>(0);

    const expira = searchParams.get("expira");

    /**
     * 🔥 Contador regressivo do QR
     */
    useEffect(() => {

        if (!expira) {
            setTempoRestante(0);
            return;
        }

        const dataExpiracao = Number(expira);

        const calcularTempo = () => {
            const diferenca = Math.floor(
                (dataExpiracao - Date.now()) / 1000
            );
            return diferenca > 0 ? diferenca : 0;
        };

        // Valor inicial imediato
        setTempoRestante(calcularTempo());

        const intervalo = setInterval(() => {
            const restante = calcularTempo();
            setTempoRestante(restante);

            if (restante <= 0) {
                clearInterval(intervalo);
            }
        }, 1000);

        return () => clearInterval(intervalo);

    }, [expira]);

    /**
     * 🔐 Login + Registro
     */
    async function handleLogin() {

        if (!codigoChamada || !codigoJanela) {
            alert("QR inválido.");
            return;
        }

        if (tempoRestante === 0) {
            alert("QR expirado.");
            return;
        }

        try {

            const response = await api.post("/auth/aluno/login", {
                emailUSP,
                senha,
            });

            const token = response.data.access_token;
            localStorage.setItem("token", token);

            await api.post(
                "/presenca/marcar-presenca",
                { codigoChamada, codigoJanela },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Presença registrada com sucesso!");

        } catch {
            alert("Erro ao registrar presença.");
        }
    }

    const minutos = Math.floor(tempoRestante / 60);
    const segundos = (tempoRestante % 60)
        .toString()
        .padStart(2, "0");

    return (
        <div className="center-box">
            <div className="formLogin col-md-12">
                <div className="row justify-content-center">

                    <div className="col-md-12 titulo">
                        <h1>Registrar Presença</h1>
                    </div>


                    <div className="col-md-12 titulo">
                        <p>
                            Código da chamada: <strong>{codigoChamada}</strong>
                        </p>
                    </div>



                    <div className="col-md-12 titulo">
                        {tempoRestante > 0 ? (
                            <p style={{
                                color: "#d9534f",
                                fontWeight: "bold",
                                fontSize: "18px"
                            }}>
                                QR expira em {minutos}:{segundos}
                            </p>
                        ) : (
                            <p style={{
                                color: "gray",
                                fontWeight: "bold"
                            }}>
                                QR expirado.
                            </p>
                        )}
                    </div>

                    <div className="col-md-8 mb-3 text-start">
                        <label>Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            value={emailUSP}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="col-md-8 mb-3 text-start">
                        <label>Senha:</label>
                        <input
                            type="password"
                            className="form-control"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    <div className="col-md-8">
                        <button
                            className="btn btn-primary w-100"
                            onClick={handleLogin}
                            disabled={carregando || tempoRestante === 0}
                        >
                            {carregando
                                ? "Registrando..."
                                : tempoRestante === 0
                                    ? "QR Expirado"
                                    : "Registrar"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
