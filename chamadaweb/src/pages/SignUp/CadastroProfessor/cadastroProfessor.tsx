import "../../../../src/css/login.css";
import { use, useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

export default function CadastroProfessor() {

    const [nomeCompleto, setNome] = useState("");
    const [emailUSP, setNumero] = useState("");
    const [senha, setSenha] = useState("");

    const navigate = useNavigate();
    function irParaCadastro() {
        navigate("/login-professor");
    }


    async function handleCadastro() {
        try {
            const response = await api.post("professor/Cadastro-Professor", {
                nomeCompleto,
                emailUSP,
                senha,
            });

            console.log("Cadastro!", response.data);
            alert("Cadastro realizado!");

            setNome("");
            setNumero("");
            setSenha("");
            navigate("/login-professor")

        } catch (error: any) {
            // Para erros do Axios, a resposta do servidor fica em error.response
            if (error.response) {
                // error.response.data contém o corpo da resposta
                // error.response.status contém o código HTTP
                console.error(error.response.data);
                alert(error.response.data.message || "Dados inválidos!");
            } else if (error.request) {
                // Requisição foi feita, mas não houve resposta
                console.error(error.request);
                alert("Servidor não respondeu!");
            } else {
                // Outro erro
                console.error(error.message);
                alert(error.message);
            }
        }

    }

    return (
        <div className="center-box">
            <div className="formLogin col-md-12">

                <div className="row justify-content-center">

                    <div className="col-md-12">
                        <button className="btn btn-light d-flex align-items-center gap-2 cadastrar w-100"
                            onClick={irParaCadastro}>

                            <span className="ms-auto">Fazer Login</span>
                            <i className="bi bi-arrow-right-square fs-3 icon-normal"></i>
                            <i className="bi bi-arrow-right-square-fill fs-3 icon-hover"></i>

                        </button>
                    </div>


                    <div className="col-md-12 titulo">
                        <h1>Cadastro</h1>
                    </div>

                    <div className="col-md-8 mb-3 text-start">
                        <label className="form-label">Nome Completo:</label>
                        <input type="text"
                            className="form-control"
                            placeholder="Insira seu nome completo"
                            value={nomeCompleto}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div className="col-md-8 mb-3 text-start">
                        <label className="form-label">Email USP:</label>
                        <input type="email"
                            className="form-control"
                            placeholder="Insira seu número USP"
                            value={emailUSP}
                            onChange={(e) => setNumero(e.target.value)}
                        />
                    </div>

                    <div className="col-md-8 mb-3 text-start">
                        <label className="form-label">Senha:</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Insira sua senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>


                    <div className="col-md-8 mt-3">
                        <button className="btn btn-primary w-100" type="submit" onClick={handleCadastro}>Cadastrar</button>
                    </div>

                </div>

            </div>



        </div>
    );
}