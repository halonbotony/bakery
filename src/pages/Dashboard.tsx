import React, { useState, useEffect } from "react";
import Breadcrumb from "../components/breadcrums";
import Header from "../layouts/header";
import Sidemenu from "../layouts/sidemenu";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import http from "../api/http";
import { Row, Col, Card, Statistic, message } from "antd";

function BakeryPOSInventory() {
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [prodSummary, setProdSummary] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [salesPday, setSalesPday] = useState<any[]>([]);

  const posData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Transactions',
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255,99,132,0.2)',
        data: [45, 60, 75, 80, 90, 120, 100],
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#FF6384',
      }
    ]
  };

  const lineChartData = {
    labels: salesPday.map(item => item.sale_date), // Extract dates for labels
    datasets: [
        {
        label: 'Sales Count',
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        data: salesPday.map(item => item.sales_count), // Extract counts for data
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#36A2EB',
        }
    ]
    };

  const getAll = async () => {
    setLoading(true);
    try {
      const resProd = await http.get('/get-product-summary');
      const resSales = await http.get('/get-transactionhdr');
      const getProduct = await http.get('/get-products');
      const resPopular = await http.get('/get-mostPopular');
      const salesPDay = await http.get('/get-salespday');

      setSalesPday(salesPDay.data.data);
      setProdSummary(resProd.data.data);

      const salesDetails = resSales.data.data.map((txn: any) => ({
        id: txn.transactionID,
        productName: '-',
        quantity: 1,
        unitPrice: txn.transactiontotal,
        totalPrice: txn.transactiontotal,
        date: `${txn.date} ${txn.time}`,
        paymentMethod: txn.transactiontype.toLowerCase(),
      }));

      setSalesData(salesDetails);

      const busiestHour = resSales.data.data.reduce((acc: Record<string, number>, txn: any) => {
        const hour = txn.time.split(':')[0];
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});
      const topHour = Object.entries(busiestHour).reduce((max: any, cur: any) => cur[1] > max[1] ? cur : max, ["00", 0])[0];

      setSummaryData({
        totalSales: salesDetails.reduce((acc: any, cur: any) => acc + cur.totalPrice, 0),
        totalItemsSold: salesDetails.reduce((acc: any, cur: any) => acc + cur.quantity, 0),
        averageSale: salesDetails.length ? salesDetails.reduce((acc: any, cur: any) => acc + cur.totalPrice, 0) / salesDetails.length : 0,
        mostPopularItem: getProduct.data.data.find((p: any) => p.id === resPopular.data.data[0]?.prodid)?.pname || 'N/A',
        busiestHour: `${topHour}:00`,
      });
    } catch (error) {
      message.error("Error fetching data");
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAll();
  }, []);

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

          {summaryData && (
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <Card>
                  <Statistic title="Total Sales" value={summaryData.totalSales} prefix="₱" precision={2} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Items Sold" value={summaryData.totalItemsSold} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Average Sale" value={summaryData.averageSale} prefix="₱" precision={2} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Most Popular" value={summaryData.mostPopularItem} />
                </Card>
              </Col>
            </Row>
          )}

          <div className="grid grid-cols-12 gap-x-6 flex-grow">
            <div className="col-span-12 flex flex-col flex-grow">
              <div className="box overflow-hidden main-content-card p-5 flex-grow bg-white shadow-lg rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Transactions Overview</h3>
                <div className="w-full flex-grow h-48">
                  <Line
                    data={lineChartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                        legend: {
                            display: true,
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
