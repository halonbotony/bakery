import React from 'react';
import Header from "../layouts/header";
import Sidemenu from "../layouts/sidemenu";
import { Link } from 'react-router-dom';

function BakeryInventoryPOS() {
    return (
        <>
            <Header />
            <Sidemenu />
            <div className="main-content app-content bg-pink-50"> {/* Light pink background */}
                <div className="container-fluid">
                    <h2 className="text-xl font-semibold mb-4">Bakery Inventory & POS</h2>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="p-6 bg-pink-100 shadow rounded-lg text-center"> {/* Light pink background */}
                            <h3 className="text-lg font-semibold">Low Stack Alert</h3>
                            <p className="text-2xl font-bold">Php1,500</p>
                        </div>
                        <div className="p-6 bg-pink-100 shadow rounded-lg text-center"> {/* Light pink background */}
                            <h3 className="text-lg font-semibold">Inventory Report</h3>
                            <p className="text-2xl font-bold">5</p>
                        </div>
                        <div className="p-6 bg-pink-100 shadow rounded-lg text-center"> {/* Light pink background */}
                            <h3 className="text-lg font-semibold">Available Items</h3>
                            <p className="text-2xl font-bold">200 Pastries</p>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                        <div className="flex gap-4">
                            <Link to="/inventory" className="bg-yellow-500 text-white px-4 py-2 rounded">Manage Bakery Items</Link> {/* Only "Manage Bakery Items" button remains */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BakeryInventoryPOS;