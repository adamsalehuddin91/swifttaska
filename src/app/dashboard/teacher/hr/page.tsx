'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Typography, Card, Table, Tag, Space, Button, Modal, Form, 
  Input, Select, DatePicker, message, Spin, Row, Col
} from 'antd';
import { FormOutlined, CalendarOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

export default function TeacherHRPage() {
  const { data: session } = useSession();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  // Hardcoded teacher mock mapping for demonstration without complex DB lookups in the UI
  // Real app: fetch Teacher profile by userId during login session
  const [teacherProfile, setTeacherProfile] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Since normal API returns all, we should filter by our teacher profile
      // For Phase 3, we mock the teacher identification step to keep UX flawless
      const [leavesRes, payrollsRes, profileRes] = await Promise.all([
        fetch('/api/hr/leave'),
        fetch('/api/hr/payroll'),
        fetch('/api/teachers')
      ]);
      
      const leavesData = await leavesRes.json();
      const payrollsData = await payrollsRes.json();
      const teachersData = await profileRes.json();
      
      const me = Array.isArray(teachersData) ? teachersData.find(t => t.userId === session?.user?.id) : null;
      setTeacherProfile(me);

      if (me) {
        setLeaves(Array.isArray(leavesData) ? leavesData.filter(l => l.teacherId === me.id) : []);
        setPayrolls(Array.isArray(payrollsData) ? payrollsData.filter(p => p.teacherId === me.id) : []);
      } else {
        // Fallback or demo state
        setLeaves([]);
        setPayrolls([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const handleApplyLeave = async (values: any) => {
    if (!teacherProfile) {
      message.error("Teacher profile not linked correctly to your account.");
      return;
    }

    try {
      const res = await fetch('/api/hr/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: teacherProfile.id,
          type: values.type,
          reason: values.reason,
          startDate: values.dates[0].toDate(),
          endDate: values.dates[1].toDate()
        })
      });
      
      if (res.ok) {
        message.success("Leave Request Submitted successfully!");
        setIsLeaveModalOpen(false);
        form.resetFields();
        fetchData();
      } else {
        message.error("Failed to submit request");
      }
    } catch (e) {
      message.error("An error occurred");
    }
  };

  const leaveColumns = [
    {
      title: 'Leave Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    {
      title: 'Dates',
      key: 'dates',
      render: (record: any) => `${dayjs(record.startDate).format('MMM D, YYYY')} - ${dayjs(record.endDate).format('MMM D, YYYY')}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'error' : 'warning';
        return <Tag color={color}>{status}</Tag>;
      }
    }
  ];

  const payrollColumns = [
    {
      title: 'Month/Year',
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
      title: 'Net Pay',
      dataIndex: 'netPay',
      key: 'netPay',
      render: (val: number) => <strong style={{ color: '#10b981' }}>RM {val.toFixed(2)}</strong>
    },
    {
      title: 'Payslip',
      key: 'action',
      render: () => <Button size="small" icon={<SafetyCertificateOutlined />}>Download PDF</Button>
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
            My HR & Leaves
          </Title>
          <Text type="secondary">Apply for leaves and view your monthly salary slips securely</Text>
        </div>
        <Button type="primary" icon={<FormOutlined />} onClick={() => setIsLeaveModalOpen(true)}>
          Apply for Leave
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title={<Space><CalendarOutlined /> My Leave History</Space>} variant="borderless" style={{ borderRadius: 16 }}>
            <Table
              dataSource={leaves}
              columns={leaveColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={<Space><SafetyCertificateOutlined /> My Payslips</Space>} variant="borderless" style={{ borderRadius: 16 }}>
            <Table
              dataSource={payrolls}
              columns={payrollColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Submit Leave Request"
        open={isLeaveModalOpen}
        onCancel={() => setIsLeaveModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleApplyLeave}>
          <Form.Item name="type" label="Leave Type" rules={[{ required: true }]}>
            <Select>
              <Option value="ANNUAL">Annual Leave</Option>
              <Option value="SICK">Sick / Medical Leave</Option>
              <Option value="MATERNITY">Maternity/Paternity Leave</Option>
              <Option value="EMERGENCY">Emergency Leave</Option>
              <Option value="UNPAID">Unpaid Leave</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dates" label="Duration" rules={[{ required: true }]}>
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="reason" label="Reason for Leave" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Please provide details..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
