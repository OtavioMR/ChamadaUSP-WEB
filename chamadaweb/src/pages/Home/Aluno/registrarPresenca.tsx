import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../services/api";

export default function RegistrarPresenca() {
    const { codigoChamada } = useParams<{ codigoChamada: string }>();
    const navigate = useNavigate();

    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    // 1. Busca o código da turma a partir do código da chamada
    const buscarCodigoTurma = async (): Promise<string | null> => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Você precisa estar logado.");
            navigate("/login-aluno");
            return null;
        }

        try {
            const res = await api.get("/chamada/codigo-turma", {
                headers: { Authorization: `Bearer ${token}` },
                params: { codigoChamada }, // envia como query ?codigoChamada=CHAM-xxx
            });

            return res.data.codigoTurma; // backend deve retornar { codigoTurma: "UIQMDY" }
        } catch (error: any) {
            console.error("Erro ao buscar código da turma:", error.response?.data);
            return null;
        }
    };

    // 2. Tenta entrar na turma
    const entrarNaTurma = async (codigoTurma: string) => {
        const token = localStorage.getItem("token");
        try {
            const res = await api.post(
                "/turma/entrar",
                { codigoTurma }, // body correto
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(res.data.mensagem || "Entrou na turma com sucesso!");
        } catch (error: any) {
            alert(error.response?.data?.mensagem || "Erro ao entrar na turma.");
        }
    };

    // 3. Registrar presença (função principal)
    const handleRegistrarPresenca = async () => {
        if (!codigoChamada) {
            alert("Código da chamada inválido.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Faça login primeiro!");
            navigate("/login-aluno");
            return;
        }

        setCarregando(true);
        setMensagem("Marcando presença...");

        try {
            // 1. Tenta marcar presença
            await api.post(
                "/presenca/marcar-presenca",
                { codigoChamada },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMensagem("Presença registrada com sucesso!");
            alert("Presença registrada!");

        } catch (error: any) {
            const mensagemErro = error.response?.data?.mensagem || error.response?.data?.message || "";

            // Verifica se o erro é porque o aluno não está na turma
            if (
                error.response?.status === 403 ||
                error.response?.status === 400 ||
                mensagemErro.toLowerCase().includes("turma") ||
                mensagemErro.toLowerCase().includes("não está inscrito") ||
                mensagemErro.toLowerCase().includes("não faz parte")
            ) {
                setMensagem("Você não está na turma. Entrando automaticamente...");

                // 2. Busca o código da turma
                try {
                    const resTurma = await api.get("/chamada/codigo-turma", {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { codigoChamada },
                    });

                    const codigoTurma = resTurma.data.codigoTurma;

                    if (!codigoTurma) {
                        throw new Error("Turma não encontrada");
                    }

                    // 3. Tenta entrar na turma
                    await api.post(
                        "/turma/entrar",
                        { codigoTurma },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    setMensagem("Entrou na turma! Marcando presença novamente...");

                    // 4. Marca presença de novo (agora deve funcionar)
                    await api.post(
                        "/presenca/marcar-presenca",
                        { codigoChamada },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    setMensagem("Tudo certo! Presença registrada.");
                    alert("Presença registrada com sucesso!");

                } catch (erroInterno: any) {
                    const msg = erroInterno.response?.data?.mensagem || "Erro ao entrar na turma.";
                    setMensagem(msg);
                    alert(msg);
                }
            } else {
                // Outro erro (token expirado, chamada fechada, etc.)
                setMensagem(mensagemErro || "Erro ao registrar presença.");
                alert(mensagemErro || "Erro desconhecido");
            }
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-4">Registrar Presença</h1>
                <p className="text-gray-600 mb-6">
                    Código da chamada: <strong>{codigoChamada}</strong>
                </p>

                <button
                    onClick={handleRegistrarPresenca}
                    disabled={carregando}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                    {carregando ? "Processando..." : "Confirmar Presença"}
                </button>

                {mensagem && (
                    <p className="mt-6 text-lg font-medium text-green-600">{mensagem}</p>
                )}
            </div>
        </div>
    );
}