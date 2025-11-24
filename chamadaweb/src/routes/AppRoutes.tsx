import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginProfessor from "../pages/Auth/LoginProfessor/loginProfessor";
import LoginAluno from "../pages/Auth/LoginAluno/loginAluno";
import CadastroAluno from "../pages/SignUp/CadastroAluno/cadastroAluno";
import CadastroProfessor from "../pages/SignUp/CadastroProfessor/cadastroProfessor";
import { InicioProfessor } from "../pages/Professor/inicio";
import { ContaProfessor } from "../pages/Professor/conta";


export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login-professor" element={<LoginProfessor />} />
                <Route path="/login-aluno" element={<LoginAluno />} />
                <Route path="/cadastro-aluno" element={<CadastroAluno />} />
                <Route path="/cadastro-professor" element={<CadastroProfessor />} />
                <Route path="/turma-professor" element={<InicioProfessor />} />
                <Route path="/conta-professor" element={< ContaProfessor />} />
            </Routes>
        </BrowserRouter>
    );
}