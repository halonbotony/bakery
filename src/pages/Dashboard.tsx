import Breadcrumb from "../components/breadcrums";
import Header from "../layouts/header";
import Sidemenu from "../layouts/sidemenu";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function BakeryPOSInventory() {
    const posData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Transactions',
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255,99,132,0.2)',
                data: [45, 60, 75, 80, 90, 120, 100],
                tension: 0.4, // Smooth curve
                pointRadius: 4,
                pointBackgroundColor: '#FF6384',
            }
        ]
    };

    return (
        <>
            <Header />
            <Sidemenu />
            <div className="main-content app-content min-h-screen flex flex-col bg-white-200">
                <div className="container-fluid flex flex-col flex-grow">
                    <Breadcrumb
                        title="Bakery Inventory Dashboard"
                        links={[{ text: "Dashboard", link: "/customers" }]}
                        active="Inventory"
                    />
                    <div className="grid grid-cols-12 gap-x-6 flex-grow">
                        <div className="col-span-12 flex flex-col flex-grow">
                            <div className="box overflow-hidden main-content-card p-5 flex-grow bg-white shadow-lg rounded-xl">
                                <h3 className="text-lg font-semibold mb-4">Transactions Overview</h3>
                                <div className="w-full flex-grow h-48"> 
                                    <Line 
                                        data={posData} 
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false, 
                                                },
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BakeryPOSInventory;
