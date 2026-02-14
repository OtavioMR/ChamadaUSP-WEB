import "../../../../src/css/login.css";
import { use, useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

export default function CadastroAluno() {

    const navigate = useNavigate();
    
    function VoltarTurmas() {
        navigate("/turmas-professor");
    }

    const [nomeCompleto, setNome] = useState("");
    const [numeroUSP, setNumero] = useState("");
    const [emailUSP, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function handleLogin() {
        try {
            const response = await api.post("/aluno/cadastro-aluno", {
                nomeCompleto,
                numeroUSP,
                emailUSP,
                senha
            });

            console.log("Cadastro!", response.data);
            alert("Cadastro realizado!");

            setNome("");
            setNumero("");
            setEmail("");
            setSenha("");

        } catch (error: any) {
            console.error("Erro:", error.response);
            alert(error.response?.data?.message);

        }
    }


    return (
        <div className="center-box">
            <div className="formLogin col-md-12">

                <div className="row justify-content-center">

                    <div className="col-md-12">
                        <button className="btn btn-light d-flex align-items-center gap-2 cadastrar w-100"
                            onClick={VoltarTurmas}>

                           <i className="bi bi-arrow-left-square fs-3 icon-normal"></i>
                            <i className="bi bi-arrow-left-square-fill fs-3 icon-hover"></i>
                            
                            <span className="">Voltar</span>

                        </button>
                    </div>


                    <div className="col-md-12 titulo">
                        <h1>Cadastro de Aluno</h1>
                    </div>

                    <div className="col-md-8 mb-3 text-start">
                        <label className="form-label">Nome Completo:</label>
                        <input type="text"
                            className="form-control"
                            placeholder="Insira o nome completo"
                            value={nomeCompleto}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div className="col-md-8 mb-3 text-start">
                        <label className="form-label">Número USP:</label>
                        <input type="text"
                            className="form-control"
                            placeholder="Insira o número USP"
                            value={numeroUSP}
                            onChange={(e) => setNumero(e.target.value)}
                        />
                    </div>


                    <div className="col-md-8 mb-3 text-start">
                        <label className="form-label">Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Insira o email"
                            value={emailUSP}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="col-md-8 mb-3 text-start">
                        <label className="form-label">Senha:</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Insira a senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>


                    <div className="col-md-8 mt-3">
                        <button className="btn btn-primary w-100" type="submit" onClick={handleLogin}>Cadastrar</button>
                    </div>

                </div>

            </div>



        </div>
    );
}