import "../../../../src/css/login.css";
import { use, useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

export default function LoginAluno() {

    const navigate = useNavigate();
    function irParaCadastro() {
        navigate('/cadastro-aluno');
    }

    const [emailUSP, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function handleLogin() {
        try {
            const response = await api.post("/auth/aluno/login", {
                emailUSP,
                senha
            });

            const token = response.data.access_token;
            localStorage.setItem("token", token);

            console.log("Logado!", response.data);
            alert("Login realizado!");

            navigate("")
            setEmail("");
            setSenha("");
        } catch (error: any) {
            console.error(error);
            alert("Credenciais inválidas!");
        }
    }


    return (
        <div className="center-box">
            <div className="formLogin col-md-12">

                <div className="row justify-content-center">

                    <div className="col-md-12">
                        <button className="btn btn-light d-flex align-items-center gap-2 cadastrar w-100"
                            onClick={irParaCadastro}>
                            <i className="bi bi-arrow-left-square fs-3 icon-normal"></i>
                            <i className="bi bi-arrow-left-square-fill fs-3 icon-hover"></i>
                            <span>Cadastrar-se</span>

                        </button>
                    </div>


                    <div className="col-md-12 titulo">
                        <h1>Login</h1>
                    </div>


                    <div className="col-md-8 mb-3 text-start">
                        <label className="form-label">Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Insira seu email"
                            value={emailUSP}
                            onChange={(e) => setEmail(e.target.value)}
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
                        <button className="btn btn-primary w-100" type="submit" onClick={handleLogin}>Entrar</button>
                    </div>

                    <div className="col-md-8 mt-2 text-center">
                        <a href="">Esqueci minha senha</a>
                    </div>

                </div>

            </div>



        </div>
    );
}