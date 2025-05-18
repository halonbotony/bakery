import Breadcrumb from "../components/breadcrums";
import Header from "../layouts/header";
import Sidemenu from "../layouts/sidemenu";
import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Card, Statistic, Row, Col, Select, Button, Spin, message } from 'antd';
import { PrinterOutlined, ReloadOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

import http from "../api/http";

interface SaleItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  date: string;
  paymentMethod: 'cash' | 'gcash';
}

interface SalesSummary {
  totalSales: number;
  totalItemsSold: number;
  averageSale: number;
  mostPopularItem: string;
  busiestHour: string;
}

interface ProductSummary {
  prodid: number;
  prodprice: number;
  total_quantity: number;
}

const { RangePicker } = DatePicker;
const { Option } = Select;

const formatCurrency = (value: number) => {
  return `₱${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

const SalesReport: React.FC = () => {
  const [prodSummary, setProdSummary] = useState<any[]>([])
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<SalesSummary | null>(null);
  const [salesData, setSalesData] = useState<SaleItem[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const navigate = useNavigate();

  const getAll = async () => {
    setLoading(true);
    try {
      const resProd = await http.get('/get-product-summary');
      const resSales = await http.get('/get-transactionhdr');
      const getProduct = await http.get('/get-products');
      const resPopular = await http.get('/get-mostPopular');


      setProdSummary(resProd.data.data);

      const salesDetails = resSales.data.data.map((txn: any) => {
        return {
          id: txn.transactionID,
          productName: '-',
          quantity: 1,
          unitPrice: txn.transactiontotal,
          totalPrice: txn.transactiontotal,
          date: `${txn.date} ${txn.time}`,
          paymentMethod: txn.transactiontype.toLowerCase(),
        };
      });

      setSalesData(salesDetails);

      const busiestHour = resSales.data.data.reduce((acc: Record<string, number>, txn: any) => {
        const hour = txn.time.split(':')[0];
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});
      const topHour = Object.entries(busiestHour).reduce((max:any, cur:any) => cur[1] > max[1] ? cur : max, ["00", 0])[0];

      setSummaryData({
        totalSales: salesDetails.reduce((acc : any, cur : any) => acc + cur.totalPrice, 0),
        totalItemsSold: salesDetails.reduce((acc : any, cur : any) => acc + cur.quantity, 0),
        averageSale: salesDetails.length ? salesDetails.reduce((acc : any, cur : any) => acc + cur.totalPrice, 0) / salesDetails.length : 0,
        mostPopularItem: getProduct.data.data.find((p:any) => p.id === resPopular.data.data[0]?.prodid)?.pname || 'N/A',
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

  const filteredSales = salesData.filter(item => {
    const inDateRange = !dateRange || (dayjs(item.date).isAfter(dateRange[0]) && dayjs(item.date).isBefore(dateRange[1]));
    const paymentMatches = paymentFilter === 'all' || item.paymentMethod === paymentFilter;
    return inDateRange && paymentMatches;
  });

  const columnsSales: ColumnsType<SaleItem> = [
    {
      title: 'transactionID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: formatCurrency,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: date => dayjs(date).format('MMM D, YYYY h:mm A'),
    },
    {
      title: 'Payment',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
  ];

  const columnsProdSummary: ColumnsType<ProductSummary> = [
  {
    title: 'Product ID',
    dataIndex: 'prodid',
    key: 'prodid',
  },
  {
    title: 'Unit Price',
    dataIndex: 'prodprice',
    key: 'prodprice',
    render: (price: number) => formatCurrency(price),
  },
  {
    title: 'Total Quantity Sold',
    dataIndex: 'total_quantity',
    key: 'total_quantity',
  },
  {
    title: 'Total Revenue',
    key: 'total_revenue',
    render: (_text, record) => formatCurrency(record.prodprice * record.total_quantity),
  },
];

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content min-h-screen flex flex-col bg-white-200">
        <div className="container-fluid flex flex-col flex-grow">
          <Breadcrumb
            title="Bakery Inventory Dashboard"
            links={[{ text: "Dashboard", link: "/dashboard" }]}
            active="Inventory"
          />
          <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '20px' }}>
            <Card
              title={<span style={{ textAlign: 'center', display: 'block', width: '100%' }}>Bakery Sales Report</span>}
              headStyle={{ backgroundColor: '#ffcce6', borderBottom: 'none' }}
              extra={
                <div style={{ display: 'flex', gap: '10px' }}>
                  {/* Export PDF button removed */}
                  <Button icon={<PrinterOutlined />} onClick={() => window.print()}>Print</Button>
                  <Button icon={<ReloadOutlined />} onClick={getAll}>Refresh</Button>
                </div>
              }
              style={{ border: 'none' }}
            >
              {/* Rest of your component unchanged */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <Button icon={<CloseOutlined />} style={{ marginRight: '10px' }} onClick={() => navigate('/dashboard')}>Close</Button>
                <div style={{ flex: 1 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <RangePicker
                        style={{ width: '100%' }}
                        value={dateRange}
                        onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                      />
                    </Col>
                    <Col span={12}>
                      <Select
                        style={{ width: '100%' }}
                        value={paymentFilter}
                        onChange={(value) => setPaymentFilter(value)}
                      >
                        <Option value="all">All Payment Methods</Option>
                        <Option value="cash">Cash</Option>
                        <Option value="GCash">GCash</Option>
                      </Select>
                    </Col>
                  </Row>
                </div>
              </div>

              {loading ? (
                <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />
              ) : (
                summaryData && (
                  <Row gutter={16} style={{ marginBottom: '20px' }}>
                    <Col span={6}><Card><Statistic title="Total Sales" value={summaryData.totalSales} prefix="₱" precision={2} /></Card></Col>
                    <Col span={6}><Card><Statistic title="Items Sold" value={summaryData.totalItemsSold} /></Card></Col>
                    <Col span={6}><Card><Statistic title="Average Sale" value={summaryData.averageSale} prefix="₱" precision={2} /></Card></Col>
                    <Col span={6}><Card><Statistic title="Most Popular" value={summaryData.mostPopularItem} /></Card></Col>
                  </Row>
                )
              )}
              <h2>Sales Summary</h2>
              <Table
                columns={columnsSales}
                dataSource={filteredSales}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row style={{ backgroundColor: '#fff5f7' }}>
                      <Table.Summary.Cell index={0} colSpan={2}><strong>Total</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={1}><strong>{filteredSales.reduce((sum, item) => sum + item.quantity, 0)}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={2} />
                      <Table.Summary.Cell index={3}><strong>{formatCurrency(filteredSales.reduce((sum, item) => sum + item.totalPrice, 0))}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={4} colSpan={2} />
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
              <h2>Product Summary</h2>
              <Table
                columns={columnsProdSummary}
                dataSource={prodSummary}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row style={{ backgroundColor: '#fff5f7' }}>
                      <Table.Summary.Cell index={0} colSpan={2}><strong>Total</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={1}><strong>{filteredSales.reduce((sum, item) => sum + item.quantity, 0)}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={2} />
                      <Table.Summary.Cell index={3}><strong>{formatCurrency(filteredSales.reduce((sum, item) => sum + item.totalPrice, 0))}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={4} colSpan={2} />
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesReport;
