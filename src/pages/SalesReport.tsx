import React, { useState, useEffect } from 'react';
import { Table, DatePicker, Card, Statistic, Row, Col, Select, Button, Spin, message } from 'antd';
import { DownloadOutlined, PrinterOutlined, ReloadOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Types for our data
interface SaleItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  date: string;
  paymentMethod: 'cash' | 'card' | 'mobile';
}

interface SalesSummary {
  totalSales: number;
  totalItemsSold: number;
  averageSale: number;
  mostPopularItem: string;
  busiestHour: string;
}

const { RangePicker } = DatePicker;
const { Option } = Select;

// Helper function to format currency in PHP
const formatCurrency = (value: number) => {
  return `₱${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

const SalesReport: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf('week'),
    dayjs().endOf('day'),
  ]);
  const [salesData, setSalesData] = useState<SaleItem[]>([]);
  const [summaryData, setSummaryData] = useState<SalesSummary | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const navigate = useNavigate();

  // Mock data fetch function
  const fetchSalesData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

const mockData: SaleItem[] = [
  // Breads
  { id: '1', productName: 'Pandesal', quantity: 12, unitPrice: 2.5, totalPrice: 30.0, date: dayjs().subtract(1, 'day').format(), paymentMethod: 'cash' },
  { id: '2', productName: 'Spanish Bread', quantity: 7, unitPrice: 6.0, totalPrice: 42.0, date: dayjs().subtract(1, 'day').format(), paymentMethod: 'card' },
  { id: '3', productName: 'Monay', quantity: 5, unitPrice: 4.0, totalPrice: 20.0, date: dayjs().format(), paymentMethod: 'mobile' },
  { id: '4', productName: 'Ensaymada', quantity: 8, unitPrice: 12.0, totalPrice: 96.0, date: dayjs().format(), paymentMethod: 'cash' },
  { id: '5', productName: 'Cheese Bread', quantity: 10, unitPrice: 10.0, totalPrice: 100.0, date: dayjs().subtract(2, 'days').format(), paymentMethod: 'card' },
  { id: '6', productName: 'Brioche Loaf', quantity: 2, unitPrice: 45.0, totalPrice: 90.0, date: dayjs().subtract(2, 'days').format(), paymentMethod: 'cash' },
  { id: '7', productName: 'Whole Wheat Bread', quantity: 3, unitPrice: 50.0, totalPrice: 150.0, date: dayjs().subtract(3, 'days').format(), paymentMethod: 'mobile' },

  // Cakes
  { id: '8', productName: 'Red Velvet', quantity: 2, unitPrice: 350, totalPrice: 700, date: dayjs().subtract(1, 'day').format(), paymentMethod: 'cash' },
  { id: '9', productName: 'Raspberry Cake', quantity: 1, unitPrice: 500, totalPrice: 500, date: dayjs().subtract(1, 'day').format(), paymentMethod: 'card' },
  { id: '10', productName: 'Oreo Cake', quantity: 1, unitPrice: 450, totalPrice: 450, date: dayjs().format(), paymentMethod: 'mobile' },
  { id: '11', productName: 'White Forest Cake', quantity: 2, unitPrice: 500, totalPrice: 1000, date: dayjs().format(), paymentMethod: 'cash' },
  { id: '12', productName: 'Green Velvet Cake', quantity: 1, unitPrice: 550, totalPrice: 550, date: dayjs().subtract(2, 'days').format(), paymentMethod: 'card' },
  { id: '13', productName: 'Cookies and Cream Cake', quantity: 2, unitPrice: 450, totalPrice: 900, date: dayjs().subtract(2, 'days').format(), paymentMethod: 'mobile' },
  { id: '14', productName: 'Ube Cake', quantity: 1, unitPrice: 500, totalPrice: 500, date: dayjs().subtract(3, 'days').format(), paymentMethod: 'cash' },
  { id: '15', productName: 'Black Forest Cake', quantity: 2, unitPrice: 550, totalPrice: 1100, date: dayjs().subtract(3, 'days').format(), paymentMethod: 'mobile' },
  { id: '16', productName: 'Chocolate Mousse Cake', quantity: 1, unitPrice: 650, totalPrice: 650, date: dayjs().subtract(4, 'days').format(), paymentMethod: 'card' },
  { id: '17', productName: 'Purple Yam', quantity: 1, unitPrice: 600, totalPrice: 600, date: dayjs().subtract(4, 'days').format(), paymentMethod: 'cash' },
];


      // Filter by date range
      const filtered = mockData.filter(item => {
        const itemDate = dayjs(item.date);
        return itemDate.isAfter(dateRange[0]) && itemDate.isBefore(dateRange[1]);
      });

      // Apply payment filter
      let result = filtered;
      if (paymentFilter !== 'all') {
        result = result.filter(item => item.paymentMethod === paymentFilter);
      }

      setSalesData(result);
      calculateSummary(result);
      message.success('Sales data loaded successfully');
    } catch (error) {
      message.error('Failed to load sales data');
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary statistics
  const calculateSummary = (data: SaleItem[]) => {
    if (data.length === 0) {
      setSummaryData(null);
      return;
    }

    const totalSales = data.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalItemsSold = data.reduce((sum, item) => sum + item.quantity, 0);

    // Find most popular item
    const itemCounts: Record<string, number> = {};
    data.forEach(item => {
      itemCounts[item.productName] = (itemCounts[item.productName] || 0) + item.quantity;
    });
    const mostPopularItem = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0][0];

    setSummaryData({
      totalSales,
      totalItemsSold,
      averageSale: totalSales / data.length,
      mostPopularItem,
      busiestHour: '10:00 AM',
    });
  };

  // Handle date range change
  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    const input = document.getElementById('sales-report');
    if (input) {
      html2canvas(input).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`bakery-sales-report-${dayjs().format('YYYY-MM-DD')}.pdf`);
      });
    }
  };

  // Initial data load
  useEffect(() => {
    fetchSalesData();
  }, [dateRange, paymentFilter]);

  // Table columns
  const columns: ColumnsType<SaleItem> = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (value: number) => formatCurrency(value),
      sorter: (a, b) => a.unitPrice - b.unitPrice,
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (value: number) => formatCurrency(value),
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('MMM D, YYYY h:mm A'),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: 'Payment',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => method.charAt(0).toUpperCase() + method.slice(1),
    },
  ];

  return (
    <div style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div id="sales-report" style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <Card
          title={<span style={{ textAlign: 'center', display: 'block', width: '100%' }}>Bakery Sales Report</span>}
          headStyle={{ backgroundColor: '#ffcce6', borderBottom: 'none' }}
          extra={
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button icon={<DownloadOutlined />} onClick={exportToPDF}>Export PDF</Button>
              <Button icon={<PrinterOutlined />} onClick={() => window.print()}>Print</Button>
              <Button icon={<ReloadOutlined />} onClick={fetchSalesData}>Refresh</Button>
            </div>
          }
          style={{ border: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Button icon={<CloseOutlined />} style={{ marginRight: '10px' }} onClick={() => navigate('/dashboard')}>Close</Button>
            <div style={{ flex: 1 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <RangePicker
                    style={{ width: '100%' }}
                    value={dateRange}
                    onChange={handleDateChange}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                  />
                </Col>
                <Col span={12}>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Filter by payment method"
                    value={paymentFilter}
                    onChange={setPaymentFilter}
                  >
                    <Option value="all">All Payment Methods</Option>
                    <Option value="cash">Cash</Option>
                    <Option value="card">Card</Option>
                    <Option value="mobile">Mobile</Option>
                  </Select>
                </Col>
              </Row>
            </div>
          </div>

          {loading && <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />}

          {summaryData && !loading && (
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <Card style={{ backgroundColor: '#fff5f7' }}>
                  <Statistic
                    title="Total Sales"
                    value={summaryData.totalSales}
                    precision={2}
                    prefix="₱"
                    formatter={(value) => value.toLocaleString()}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card style={{ backgroundColor: '#fff5f7' }}>
                  <Statistic
                    title="Items Sold"
                    value={summaryData.totalItemsSold}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card style={{ backgroundColor: '#fff5f7' }}>
                  <Statistic
                    title="Average Sale"
                    value={summaryData.averageSale}
                    precision={2}
                    prefix="₱"
                    formatter={(value) => value.toLocaleString()}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card style={{ backgroundColor: '#fff5f7' }}>
                  <Statistic
                    title="Most Popular"
                    value={summaryData.mostPopularItem}
                  />
                </Card>
              </Col>
            </Row>
          )}

          <Table
            columns={columns}
            dataSource={salesData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            style={{ backgroundColor: 'white' }}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row style={{ backgroundColor: '#fff5f7' }}>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <strong>Total</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <strong>
                      {salesData.reduce((sum, item) => sum + item.quantity, 0)}
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} />
                  <Table.Summary.Cell index={3}>
                    <strong>
                      {formatCurrency(salesData.reduce((sum, item) => sum + item.totalPrice, 0))}
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} colSpan={2} />
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </Card>
      </div>
    </div>
  );
};

export default SalesReport;