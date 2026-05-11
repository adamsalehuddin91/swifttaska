'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { App, Table,
  Button,
  Card,
  Row,
  Col,
  Statistic,
  Segmented,
  Tag,
  Modal,
  Timeline,
  Descriptions,
  InputNumber,
  Radio,
  DatePicker,
  Tooltip,
  Badge,
  Watermark,
  Spin,
  Empty,
  Space,
  Input } from 'antd';
import {
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  PlusOutlined,
  EyeOutlined,
  FileTextOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import FeeForm from '@/components/forms/FeeForm';

interface Fee {
  id: string;
  type: string;
  description: string;
  amount: number;
  paidAmount?: number;
  dueDate: string;
  paidDate?: string;
  status: string;
  paymentMethod?: string;
  notes?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;
    class: {
      name: string;
      level: string;
    };
  };
}

function FeesPageInner() {
  const { message } = App.useApp();
  const searchParams = useSearchParams();
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateRange, setDateRange] = useState<any>(null);

  useEffect(() => {
    fetchFees();
    if (searchParams?.get('success')) {
      message.success('Payment completed successfully via Stripe!');
    }
    if (searchParams?.get('canceled')) {
      message.warning('Payment was canceled.');
    }
  }, [searchParams]);

  const fetchFees = async () => {
    try {
      const response = await fetch('/api/fees');
      if (response.ok) {
        const data = await response.json();
        setFees(data);
      }
    } catch (error) {
      console.error('Error fetching fees:', error);
      message.error('Failed to load fees');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFee = async (feeData: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/fees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feeData),
      });

      if (response.ok) {
        await fetchFees();
        setShowAddModal(false);
        message.success('Fee created successfully!');
      } else {
        const error = await response.text();
        message.error(`Error creating fee: ${error}`);
      }
    } catch (error) {
      console.error('Error creating fee:', error);
      message.error('Error creating fee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedFee || !paymentAmount) return;

    try {
      const response = await fetch(`/api/fees/${selectedFee.id}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paidAmount: paymentAmount,
          paymentMethod,
          notes: `Payment via ${paymentMethod}`
        }),
      });

      if (response.ok) {
        fetchFees();
        setShowPaymentModal(false);
        setSelectedFee(null);
        setPaymentAmount(0);
        setPaymentMethod('CASH');
        message.success('Payment recorded successfully!');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      message.error('Failed to record payment');
    }
  };

  const handleStripeCheckout = async (feeId: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feeId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        message.error(data.error || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Stripe error:', error);
      message.error('Payment gateway error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFees = fees.filter(fee => {
    const matchesSearch =
      fee.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesViewMode = viewMode === 'all' || fee.status === viewMode.toUpperCase();

    return matchesSearch && matchesViewMode;
  });

  const getStatusTag = (status: string) => {
    const config = {
      PAID: { color: 'success', icon: <CheckCircleOutlined /> },
      PARTIAL: { color: 'warning', icon: <ClockCircleOutlined /> },
      PENDING: { color: 'warning', icon: <ClockCircleOutlined /> },
      OVERDUE: { color: 'error', icon: <CloseCircleOutlined /> },
    };
    return config[status as keyof typeof config] || { color: 'default', icon: null };
  };

  const totalStats = {
    total: fees.reduce((sum, f) => sum + f.amount, 0),
    collected: fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0),
    pending: fees.filter(f => f.status === 'PENDING').reduce((sum, f) => sum + (f.amount - (f.paidAmount || 0)), 0),
    overdue: fees.filter(f => f.status === 'OVERDUE').length
  };

  const counts = {
    all: fees.length,
    pending: fees.filter(f => f.status === 'PENDING').length,
    paid: fees.filter(f => f.status === 'PAID').length,
    overdue: fees.filter(f => f.status === 'OVERDUE').length,
  };

  const paymentHistory = fees
    .filter(f => f.paidDate)
    .sort((a, b) => new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime())
    .slice(0, 5);

  const columns: ColumnsType<Fee> = [
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.student.firstName} {record.student.lastName}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {record.student.studentId}
          </div>
        </div>
      ),
    },
    {
      title: 'Fee Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => type.replace('_', ' '),
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_, record) => (
        <div>
          <div>RM {record.amount.toLocaleString()}</div>
          {record.paidAmount && record.paidAmount > 0 && (
            <div style={{ fontSize: '12px', color: '#52c41a' }}>
              Paid: RM {record.paidAmount.toLocaleString()}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => dayjs(date).format('DD MMM YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const { color, icon } = getStatusTag(status);
        return <Tag color={color} icon={icon}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Invoice">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedFee(record);
                setShowInvoiceModal(true);
              }}
            />
          </Tooltip>
          {record.status !== 'PAID' && (
            <Tooltip title="Record Payment">
              <Button
                type="text"
                icon={<CreditCardOutlined />}
                onClick={() => {
                  setSelectedFee(record);
                  setPaymentAmount(record.amount - (record.paidAmount || 0));
                  setShowPaymentModal(true);
                }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--primary-gradient)',
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--primary-gradient)',
      padding: '24px'
    }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            background: 'var(--neutral-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            Fees & Billing
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Manage student fees and payment tracking
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setShowAddModal(true)}
          style={{ borderRadius: '8px' }}
        >
          Add Fee
        </Button>
      </div>

      {/* Segmented Control */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <Segmented
          value={viewMode}
          onChange={setViewMode}
          size="large"
          options={[
            { label: <div style={{ padding: '0 12px', paddingRight: '24px' }}><Badge count={counts.all} offset={[16, 0]} showZero><span style={{ fontWeight: 500 }}>All</span></Badge></div>, value: 'all' },
            { label: <div style={{ padding: '0 12px', paddingRight: '24px' }}><Badge count={counts.pending} offset={[16, 0]} showZero><span style={{ fontWeight: 500 }}>Pending</span></Badge></div>, value: 'pending' },
            { label: <div style={{ padding: '0 12px', paddingRight: '24px' }}><Badge count={counts.paid} offset={[16, 0]} showZero><span style={{ fontWeight: 500 }}>Paid</span></Badge></div>, value: 'paid' },
            { label: <div style={{ padding: '0 12px', paddingRight: '24px' }}><Badge count={counts.overdue} offset={[16, 0]} showZero><span style={{ fontWeight: 500 }}>Overdue</span></Badge></div>, value: 'overdue' },
          ]}
        />
        <Space>
          <DatePicker.RangePicker
            value={dateRange}
            onChange={setDateRange}
            style={{ borderRadius: '8px' }}
          />
          <Input
            placeholder="Search fees..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250, borderRadius: '8px' }}
          />
        </Space>
      </div>

      {/* Gradient Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'var(--purple-gradient)',
              borderRadius: '16px',
              border: 'none',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            styles={{ body: {} }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Total Fees</span>}
              value={`RM ${totalStats.total.toLocaleString()}`}
              valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<DollarOutlined style={{ color: '#fff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'var(--warning-gradient)',
              borderRadius: '16px',
              border: 'none',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            styles={{ body: {} }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Pending</span>}
              value={`RM ${totalStats.pending.toLocaleString()}`}
              valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<ClockCircleOutlined style={{ color: '#fff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'var(--success-gradient)',
              borderRadius: '16px',
              border: 'none',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            styles={{ body: {} }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Paid</span>}
              value={`RM ${totalStats.collected.toLocaleString()}`}
              valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<CheckCircleOutlined style={{ color: '#fff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'var(--danger-gradient)',
              borderRadius: '16px',
              border: 'none',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            styles={{ body: {} }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Overdue</span>}
              value={totalStats.overdue}
              valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<CloseCircleOutlined style={{ color: '#fff' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content - Table and Timeline */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: '12px' }} styles={{ body: {} }}>
            <Table
              columns={columns}
              dataSource={filteredFees}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              locale={{
                emptyText: (
                  <Empty
                    image={<DollarOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                    description="No fees found"
                  />
                ),
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileTextOutlined />
                <span>Payment History</span>
              </div>
            }
            style={{ borderRadius: '12px' }}
          >
            <Timeline
              items={paymentHistory.map(payment => ({
                color: payment.status === 'PAID' ? 'green' : 'orange',
                children: (
                  <div>
                    <div style={{ fontWeight: 500 }}>RM {payment.paidAmount?.toLocaleString()}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {payment.student.firstName} {payment.student.lastName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {payment.paidDate && dayjs(payment.paidDate).format('DD MMM YYYY')}
                    </div>
                  </div>
                )
              }))}
            />
            {paymentHistory.length === 0 && (
              <Empty description="No payment history" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Payment Modal */}
      <Modal
        title="Record Payment"
        open={showPaymentModal}
        onOk={handlePayment}
        onCancel={() => {
          setShowPaymentModal(false);
          setSelectedFee(null);
          setPaymentAmount(0);
        }}
        okText="Record Payment"
        width={500}
      >
        {selectedFee && (
          <div>
            <Descriptions column={1} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Student">
                {selectedFee.student.firstName} {selectedFee.student.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Fee Type">
                {selectedFee.description}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                RM {selectedFee.amount.toLocaleString()}
              </Descriptions.Item>
              {selectedFee.paidAmount && selectedFee.paidAmount > 0 && (
                <Descriptions.Item label="Already Paid">
                  <Tag color="success">RM {selectedFee.paidAmount.toLocaleString()}</Tag>
                </Descriptions.Item>
              )}
            </Descriptions>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Payment Amount</label>
              <InputNumber
                value={paymentAmount}
                onChange={(val) => setPaymentAmount(val || 0)}
                style={{ width: '100%' }}
                min={0}
                max={selectedFee.amount - (selectedFee.paidAmount || 0)}
                prefix="RM"
                size="large"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Payment Method</label>
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ width: '100%' }}
              >
                <Radio.Button value="CASH">Cash</Radio.Button>
                <Radio.Button value="BANK_TRANSFER">Bank Transfer</Radio.Button>
                <Radio.Button value="ONLINE">Online</Radio.Button>
                <Radio.Button value="CHEQUE">Cheque</Radio.Button>
              </Radio.Group>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Invoice Preview"
        open={showInvoiceModal}
        onCancel={() => {
          setShowInvoiceModal(false);
          setSelectedFee(null);
        }}
        footer={[
          <Button key="close" onClick={() => setShowInvoiceModal(false)}>
            Close
          </Button>,
          <Button key="print" icon={<FileTextOutlined />}>
            Print Invoice
          </Button>,
          selectedFee && selectedFee.status !== 'PAID' ? (
            <Button
              key="stripe"
              type="primary"
              icon={<CreditCardOutlined />}
              onClick={() => handleStripeCheckout(selectedFee.id)}
              loading={isSubmitting}
            >
              Pay via Stripe
            </Button>
          ) : null
        ]}
        width={700}
      >
        {selectedFee && (
          <Watermark content="SwiftTaska">
            <div style={{ padding: '20px' }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2>SwiftTaska Nursery</h2>
                <p>Tax Invoice</p>
              </div>

              <Descriptions bordered column={2}>
                <Descriptions.Item label="Invoice Date">
                  {dayjs().format('DD MMM YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Due Date">
                  {dayjs(selectedFee.dueDate).format('DD MMM YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Student Name" span={2}>
                  {selectedFee.student.firstName} {selectedFee.student.lastName}
                </Descriptions.Item>
                <Descriptions.Item label="Student ID">
                  {selectedFee.student.studentId}
                </Descriptions.Item>
                <Descriptions.Item label="Class">
                  {selectedFee.student.class.name} - {selectedFee.student.class.level}
                </Descriptions.Item>
                <Descriptions.Item label="Fee Description" span={2}>
                  {selectedFee.description}
                </Descriptions.Item>
                <Descriptions.Item label="Fee Type">
                  {selectedFee.type.replace('_', ' ')}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={getStatusTag(selectedFee.status).color}>
                    {selectedFee.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Amount">
                  <strong>RM {selectedFee.amount.toLocaleString()}</strong>
                </Descriptions.Item>
                {selectedFee.paidAmount && selectedFee.paidAmount > 0 && (
                  <Descriptions.Item label="Paid Amount">
                    <Tag color="success">RM {selectedFee.paidAmount.toLocaleString()}</Tag>
                  </Descriptions.Item>
                )}
                {selectedFee.paidAmount && selectedFee.paidAmount > 0 && (
                  <Descriptions.Item label="Balance" span={2}>
                    <strong>RM {(selectedFee.amount - selectedFee.paidAmount).toLocaleString()}</strong>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>
          </Watermark>
        )}
      </Modal>

      {/* Add Fee Form */}
      <FeeForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddFee}
        isLoading={isSubmitting}
        mode="create"
      />
    </div>
  );
}

export default function FeesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
      <FeesPageInner />
    </Suspense>
  );
}
