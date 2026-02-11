import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginProfessor from "../pages/Auth/LoginProfessor/loginProfessor";
import LoginAluno from "../pages/Auth/LoginAluno/loginAluno";
import CadastroAluno from "../pages/SignUp/CadastroAluno/cadastroAluno";
import CadastroProfessor from "../pages/SignUp/CadastroProfessor/cadastroProfessor";
import { InicioProfessor } from "../pages/Professor/inicio";
import { ContaProfessor } from "../pages/Professor/conta";
import { CriarTurma } from "../pages/Professor/criar-turma";
import { VerTurmas } from "../pages/Professor/ver-turmas";
import { GerarQRCode } from "../pages/Professor/gerarQRCode";
import RegistrarPresenca from "../pages/Home/registrarPresenca";
import { ChamadasProfessor } from "../pages/Professor/chamadas";
import Presencas from "../pages/Professor/presencas";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login-professor" element={<LoginProfessor />} />
                {/* <Route path="/login-aluno" element={<LoginAluno />} /> */}
                <Route path="/cadastro-aluno" element={<CadastroAluno />} />
                <Route path="/cadastro-professor" element={<CadastroProfessor />} />
                <Route path="/geral-professor" element={<InicioProfessor />} />
                <Route path="/conta-professor" element={< ContaProfessor />} />
                <Route path="/criar-turma" element={< CriarTurma />} />
                <Route path="/turmas-professor" element={< VerTurmas />} />
                <Route path="/gerar-qrcode" element={< GerarQRCode />} />
                <Route path="/chamadas-professor" element={< ChamadasProfessor />} />
                {/* Rota dinâmica com parâmetro :codigoChamada */}
                {/* <Route path="/aluno/presenca/registrar/:codigoChamada" element={<RegistrarPresenca />} /> */}
                <Route path="/aluno/presenca/registrar/:codigoChamada/:codigoJanela"element={<LoginAluno />}/>
                <Route path="/professor/presenca/listar/:codigo" element={<Presencas />} />
            </Routes>
        </BrowserRouter>
    );
}