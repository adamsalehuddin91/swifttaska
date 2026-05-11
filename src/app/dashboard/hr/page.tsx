'use client';

import { useState, useEffect } from 'react';
import { 
  Typography, Card, Table, Tag, Space, Button, Modal, Form, 
  Input, InputNumber, Select, message, Tabs, Spin, Row, Col
} from 'antd';
import { CheckOutlined, CloseOutlined, PlusOutlined, BankOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminHRPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('leaves');
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leavesRes, payrollsRes, teachersRes] = await Promise.all([
        fetch('/api/hr/leave'),
        fetch('/api/hr/payroll'),
        fetch('/api/teachers')
      ]);
      
      const leavesData = await leavesRes.json();
      const payrollsData = await payrollsRes.json();
      const teachersData = await teachersRes.json();
      
      setLeaves(Array.isArray(leavesData) ? leavesData : []);
      setPayrolls(Array.isArray(payrollsData) ? payrollsData : []);
      setTeachers(Array.isArray(teachersData) ? teachersData : []);
    } catch (error) {
      console.error(error);
      message.error("Failed to load HR data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLeaveAction = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/hr/leave', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        message.success(`Leave request ${status.toLowerCase()}!`);
        fetchData();
      } else {
        message.error("Failed to update leave request");
      }
    } catch (e) {
      message.error("An error occurred");
    }
  };

  const handleGeneratePayroll = async (values: any) => {
    try {
      const res = await fetch('/api/hr/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      
      if (res.ok) {
        message.success("Payroll distributed successfully!");
        setIsPayrollModalOpen(false);
        form.resetFields();
        fetchData();
      } else {
        message.error("Failed to generate payroll");
      }
    } catch (e) {
      message.error("An error occurred");
    }
  };

  const leaveColumns = [
    {
      title: 'Teacher',
      key: 'teacher',
      render: (record: any) => `${record.teacher.firstName} ${record.teacher.lastName}`
    },
    {
      title: 'Leave Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    {
      title: 'Dates',
      key: 'dates',
      render: (record: any) => `${dayjs(record.startDate).format('MMM D')} - ${dayjs(record.endDate).format('MMM D')}`
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'error' : 'warning';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space size="small">
          {record.status === 'PENDING' && (
            <>
              <Button type="primary" size="small" icon={<CheckOutlined />} style={{ background: 'var(--success-color)' }} onClick={() => handleLeaveAction(record.id, 'APPROVED')}>Approve</Button>
              <Button danger size="small" icon={<CloseOutlined />} onClick={() => handleLeaveAction(record.id, 'REJECTED')}>Reject</Button>
            </>
          )}
        </Space>
      )
    }
  ];

  const payrollColumns = [
    {
      title: 'Teacher',
      key: 'teacher',
      render: (record: any) => `${record.teacher.firstName} ${record.teacher.lastName}`
    },
    {
      title: 'Period',
      key: 'period',
      render: (record: any) => `${dayjs().month(record.month - 1).format('MMMM')} ${record.year}`
    },
    {
      title: 'Base Salary',
      dataIndex: 'baseSalary',
      key: 'baseSalary',
      render: (val: number) => `RM ${val.toFixed(2)}`
    },
    {
      title: 'Deductions',
      dataIndex: 'deductions',
      key: 'deductions',
      render: (val: number) => <Text type="danger">-RM {val.toFixed(2)}</Text>
    },
    {
      title: 'Net Pay',
      dataIndex: 'netPay',
      key: 'netPay',
      render: (val: number) => <strong style={{ color: '#10b981' }}>RM {val.toFixed(2)}</strong>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={status === 'PAID' ? 'green' : 'blue'}>{status}</Tag>
    }
  ];

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: 'var(--bg-gradient)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            HR & Payroll Admin
          </Title>
          <Text type="secondary">Review staff leave requests and distribute monthly salary payments</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>Refresh</Button>
          {activeTab === 'payroll' && (
            <Button type="primary" icon={<BankOutlined />} onClick={() => setIsPayrollModalOpen(true)}>
              Distribute Payroll
            </Button>
          )}
        </Space>
      </div>

      <Card variant="borderless" style={{ borderRadius: 16 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="Leave Requests" key="leaves">
            <Table
              dataSource={leaves}
              columns={leaveColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Payroll Management" key="payroll">
            <Table
              dataSource={payrolls}
              columns={payrollColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <Modal
        title="Distribute Monthly Payroll"
        open={isPayrollModalOpen}
        onCancel={() => setIsPayrollModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleGeneratePayroll}>
          <Form.Item name="teacherId" label="Select Teacher" rules={[{ required: true }]}>
            <Select showSearch optionFilterProp="children" onChange={(val) => {
              const teacher = teachers.find(t => t.id === val);
              if (teacher && teacher.salary) {
                form.setFieldsValue({ baseSalary: teacher.salary });
              }
            }}>
              {teachers.map(t => (
                <Option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.employeeId})</Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="month" label="Month (1-12)" initialValue={dayjs().month() + 1} rules={[{ required: true }]}>
                <InputNumber min={1} max={12} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="year" label="Year" initialValue={dayjs().year()} rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="baseSalary" label="Base Salary (RM)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} formatter={value => `RM ${value}`} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="bonuses" label="Bonuses / Allowances (RM)" initialValue={0}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="deductions" label="Deductions / Unpaid (RM)" initialValue={0}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
