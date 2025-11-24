import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import "../../../src/css/inicioProfessor.css";
import { FaPlusCircle, FaUsers, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export function ContaProfessor() {

    const [nomeCompleto, setNome] = useState("");
    const [emailUSP, setEmail] = useState("");
    const [id, setId] = useState("");
    const [role, setRole] = useState("");


    const navigate = useNavigate();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState("inicio");

    // conserta o mapa quando sidebar abre/fecha
    useEffect(() => {
        const timer = setTimeout(() => {
            const mapElement = document.querySelector(".leaflet-container") as any;
            if (mapElement && mapElement._leaflet_map) {
                mapElement._leaflet_map.invalidateSize();
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [sidebarCollapsed]);


    // finalmente esse troço existe
    const handleMenuSelect = (menu: string) => {
        setActiveMenu(menu);
        if (menu === "turmas") {
            navigate("/turma-professor");
        }
    };

    const handleSidebarToggle = (collapsed: boolean) => {
        setSidebarCollapsed(collapsed);
    };



    async function handleDados() {
        try {
            const token = localStorage.getItem("token");
            const response = await api.get("/professor/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });


            const role = getRoleFromToken();
            const { nomeCompleto, emailUSP, id } = response.data;
            setNome(nomeCompleto);
            setEmail(emailUSP);
            setId(id);
            setRole(role);

        } catch (error) {
            console.error("Erro ao buscar professor!", error);
        }
    }


    function getRoleFromToken() {
        const token = localStorage.getItem("token");
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role; // retorna só a string
    }



    useEffect(() => {
        handleDados();
    }, []);



    return (
        <div className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
            <Sidebar
                onMenuSelect={handleMenuSelect}
                activeMenu={activeMenu}
                onToggle={handleSidebarToggle}
            />







            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <div className="row w-100 justify-content-center">

                    <div className="col-lg-6 col-md-8">
                        <div
                            className="p-4 shadow-sm bg-white"
                            style={{
                                borderRadius: "16px",
                                border: "1px solid #e5e5e5",
                            }}
                        >
                            <h2 className="fw-bold text-center mb-2">
                                Minha Conta
                            </h2>
                            <p className="text-center text-muted mb-4">
                                Informações do professor
                            </p>

                            <div style={{ fontSize: "1.05rem" }}>
                                <div className="mb-3 p-3 rounded" style={{ background: "#f8f9fa" }}>
                                    <strong>Nome:</strong>
                                    <p className="mb-0"><span>{nomeCompleto}</span></p>
                                </div>

                                <div className="mb-3 p-3 rounded" style={{ background: "#f8f9fa" }}>
                                    <strong>Email:</strong>
                                    <p className="mb-0"><span>{emailUSP}</span></p>
                                </div>

                                <div className="mb-3 p-3 rounded" style={{ background: "#f8f9fa" }}>
                                    <strong>ID:</strong>
                                    <p className="mb-0"><span>{id}</span></p>
                                </div>

                                <div className="mb-3 p-3 rounded" style={{ background: "#f8f9fa" }}>
                                    <strong>Tipo de usuário:</strong>
                                    <p className="mb-0">{role}</p>
                                </div>

                                <div className="mb-3 p-3 rounded" style={{ background: "#f8f9fa" }}>
                                    <strong>Conta criada em:</strong>
                                    <p className="mb-0">10/10/2024</p>
                                </div>
                            </div>

                            <hr className="my-4" />

                            <div className="d-flex justify-content-center gap-3">
                                <button className="btn btn-primary px-4 py-2">
                                    Editar dados
                                </button>

                                <button className="btn btn-danger px-4 py-2">
                                    Sair
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>





        </div>


    );
}