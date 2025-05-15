import logo from '../assets/cake copy.png';
import { Link } from 'react-router-dom';

function Sidemenu() {
    return (
        <aside className="app-sidebar" id="sidebar">
            <div className="main-sidebar-header rounded-lg p-4">
                <Link to="/" className="header-logo"></Link>
            </div>
            <div className="main-sidebar" id="sidebar-scroll">
                <nav className="main-menu-container nav nav-pills flex-col sub-open">
                    <ul className="main-menu">
                        <li className="mb-4">
                            <Link to="/">
                                <center>
                                    <img src={logo} className="transparent-shadow rounded-full" style={{ maxHeight: '150px' }} alt="Bakery Logo" />
                                </center>
                            </Link>
                        </li>
                        <li><hr className="mt-3 mb-4" /></li>
                        <li className="slide__category mb-2"><span className="category-name">Bakery POS</span></li>
                        <li className="slide mb-2">
                            <Link to="/pos" className="side-menu__item">
                                <i className="w-6 h-4 side-menu__icon bi bi-credit-card"></i>
                                <span className="side-menu__label">POS System</span>
                            </Link>
                        </li>
                        <li className="slide mb-2">
                            <Link to="/manage-inventory" className="side-menu__item">
                                <i className="w-6 h-4 side-menu__icon bi bi-box-seam"></i>
                                <span className="side-menu__label">Manage Inventory</span>
                            </Link>
                        </li>
                        <li className="slide mb-2">
                            <Link to="/expiring-soon" className="side-menu__item">
                                <i className="w-6 h-4 side-menu__icon bi bi-clock"></i>
                                <span className="side-menu__label">Expiring Soon</span>
                            </Link>
                        </li>
                        <li className="slide mb-2">
                            <Link to="/payment-method" className="side-menu__item">
                                <i className="w-6 h-4 side-menu__icon bi bi-wallet2"></i>
                                <span className="side-menu__label">Payment Method</span>
                            </Link>
                        </li>
                        <li className="slide mb-2">
                            <Link to="/sales-report" className="side-menu__item">
                                <i className="w-6 h-4 side-menu__icon bi bi-bar-chart"></i>
                                <span className="side-menu__label">Sales Report</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
}

export default Sidemenu;