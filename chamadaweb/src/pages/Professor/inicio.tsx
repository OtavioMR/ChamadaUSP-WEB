import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import "../../../src/css/inicioProfessor.css";
import { FaPlusCircle, FaUsers, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export function InicioProfessor() {

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

        if(menu === "conta"){
            navigate("/conta-professor");
        }
    };

    const handleSidebarToggle = (collapsed: boolean) => {
        setSidebarCollapsed(collapsed);
    };

    return (
        <div className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
            <Sidebar
                onMenuSelect={handleMenuSelect}
                activeMenu={activeMenu}
                onToggle={handleSidebarToggle}
            />







            <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="row w-100 text-center">

                    <div className="col-md-4 mb-4">
                        <div className="opcoes-turma-card">
                            <FaPlusCircle className="opcoes-turma-icone" />
                            <div className="opcoes-turma-titulo">Criar Turma</div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="opcoes-turma-card">
                            <FaUsers className="opcoes-turma-icone" />
                            <div className="opcoes-turma-titulo">Ver Alunos</div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="opcoes-turma-card">
                            <FaCog className="opcoes-turma-icone" />
                            <div className="opcoes-turma-titulo">Opções da Turma</div>
                        </div>
                    </div>

                </div>
            </div>



        </div>
    );
}
