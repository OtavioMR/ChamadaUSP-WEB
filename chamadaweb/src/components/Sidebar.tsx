// src/components/Sidebar.tsx
import React, { useState } from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';


// Ícones (substitua por seus próprios ícones ou biblioteca de ícones)
const InicioIcon = () => <span><i className="bi bi-people-fill"></i></span>;
const ChamadasIcon = () => <span><i className="bi bi-collection-fill"></i></span>;
const ContaIcon = () => <span><i className="bi bi-person-circle"></i></span>;

interface SidebarProps {
    onMenuSelect: (menu: string) => void;
    activeMenu?: string;
    onToggle?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuSelect, activeMenu = 'inicio', onToggle }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { key: 'geral', label: 'Geral', icon: <InicioIcon /> },
        { key: 'chamadas', label: 'Chamadas', icon: <ChamadasIcon /> },
        { key: 'conta', label: 'Conta', icon: <ContaIcon /> },
    ];

    const handleToggle = () => {
        const newCollapsedState = !isCollapsed;
        setIsCollapsed(newCollapsedState);
        if (onToggle) {
            onToggle(newCollapsedState);
        }
    };

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate("/login-professor");
    };

    const handleMenuClick = (menuKey: string) => {
        onMenuSelect(menuKey);
    };

    return (
        <>
            {/* Sidebar Principal */}
            <div className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
                {/* Header da Sidebar */}
                <div className="sidebar-header">
                    {!isCollapsed && (
                        <div className="sidebar-logo">
                            <span className="logo-icon"><i className="bi bi-person-lines-fill"></i></span>
                            <span className="logo-text">Chamada</span>
                        </div>
                    )}
                    <button
                        className="sidebar-toggle"
                        onClick={handleToggle}
                        aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
                    >
                        {isCollapsed ? '➡️' : '⬅️'}
                    </button>
                </div>

                {/* Menu de Navegação */}
                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <button
                            key={item.key}
                            className={`sidebar-item ${activeMenu === item.key ? 'active' : ''}`}
                            onClick={() => handleMenuClick(item.key)}
                            aria-label={item.label}
                            title={item.label}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {!isCollapsed && (
                                <span className="sidebar-label">{item.label}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Footer da Sidebar */}
                {!isCollapsed && (
                    <div className="sidebar-footer">
                        <button
                            className="sidebar-logout-btn"
                            onClick={handleLogout}
                        >
                            <span className="logout-icon"><i className="bi bi-box-arrow-left"></i></span>
                            <span className="logout-text">Sair</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Botão Sair Mobile - aparece apenas em telas pequenas */}
            {/* <button
                className="mobile-logout-btn"
                onClick={handleLogout}
                aria-label="Sair"
                title="Sair"
            >
                <div className="sign">
                    <svg viewBox="0 0 512 512">
                        <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                    </svg>
                </div>
                <div className="mobile-logout-text">Sair</div>
            </button> */}
        </>
    );
};

export default Sidebar;