'use client';

import { useState, useEffect } from 'react';
import { 
  Typography, Card, Row, Col, Button, Calendar, Badge, 
  Table, Tag, Space, Modal, Form, Input, Select, DatePicker, message, Spin, Alert 
} from 'antd';
import { CoffeeOutlined, PlusOutlined, WarningOutlined, ReloadOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

// Types
interface Meal {
  id: string;
  date: string;
  type: 'BREAKFAST' | 'LUNCH' | 'SNACK';
  name: string;
  description: string;
  ingredients: string;
}

interface Subscription {
  id: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    allergies: string | null;
    class: { name: string } | null;
  };
  startDate: string;
  status: string;
}

export default function CanteenPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mealsRes, subsRes] = await Promise.all([
        fetch('/api/canteen/meals'),
        fetch('/api/canteen/subscriptions')
      ]);
      
      const mealsData = await mealsRes.json();
      const subsData = await subsRes.json();
      
      setMeals(Array.isArray(mealsData) ? mealsData : []);
      setSubscriptions(Array.isArray(subsData) ? subsData : []);
    } catch (error) {
      console.error(error);
      message.error("Failed to load Canteen data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddMeal = async (values: any) => {
    try {
      const res = await fetch('/api/canteen/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: values.date.toDate(),
          type: values.type,
          name: values.name,
          description: values.description,
          ingredients: values.ingredients
        })
      });
      
      if (res.ok) {
        message.success("Meal added successfully!");
        setIsMealModalOpen(false);
        form.resetFields();
        fetchData();
      } else {
        message.error("Failed to add meal");
      }
    } catch (e) {
      message.error("An error occurred");
    }
  };

  const getListData = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    return meals.filter(m => dayjs(m.date).format('YYYY-MM-DD') === dateStr);
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {listData.map((item) => {
          let color = item.type === 'BREAKFAST' ? 'blue' : item.type === 'LUNCH' ? 'green' : 'orange';
          return (
            <li key={item.id} style={{ marginBottom: 4 }}>
              <Badge color={color} text={item.name} style={{ fontSize: 12 }} />
            </li>
          );
        })}
      </ul>
    );
  };

  // Allergy Cross-Referencing Logic:
  // If a student's allergy text appears in ANY active meal's ingredients for today, flag them!
  const calculateAllergyWarnings = () => {
    const todayStr = dayjs().format('YYYY-MM-DD');
    const todayMeals = meals.filter(m => dayjs(m.date).format('YYYY-MM-DD') === todayStr);
    
    // Combine all today's ingredients into a big lowercase string
    const todayIngredientsString = todayMeals.map(m => m.ingredients?.toLowerCase()).join(" ");

    let warningsCount = 0;
    const flaggedStudents = subscriptions.filter(sub => {
      if (!sub.student.allergies) return false;
      
      // Basic cross reference: check if ANY of the student's listed allergies are inside today's ingredients
      const studentAllergies = sub.student.allergies.toLowerCase().split(',').map(s => s.trim());
      const hasConflict = studentAllergies.some(allergy => allergy.length > 2 && todayIngredientsString.includes(allergy));
      
      if (hasConflict) warningsCount++;
      return hasConflict;
    });

    return { count: warningsCount, flagged: flaggedStudents, todayMealsCount: todayMeals.length };
  };

  const allergyData = calculateAllergyWarnings();

  const subColumns = [
    {
      title: 'Student',
      dataIndex: ['student', 'firstName'],
      key: 'name',
      render: (text: string, record: Subscription) => `${text} ${record.student.lastName}`
    },
    {
      title: 'Class',
      dataIndex: ['student', 'class', 'name'],
      key: 'class',
      render: (text: string) => text || 'Unassigned'
    },
    {
      title: 'Dietary / Allergies',
      dataIndex: ['student', 'allergies'],
      key: 'allergies',
      render: (text: string | null) => text ? <Tag color="error">{text}</Tag> : <Tag color="success">None</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color="blue">{status}</Tag>
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
            Dietary Meal Planner
          </Title>
          <Text type="secondary">Plan menus and strictly monitor student allergies</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>Refresh</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.setFieldsValue({ date: dayjs() }); setIsMealModalOpen(true); }}>
            Add Meal
          </Button>
        </Space>
      </div>

      {allergyData.todayMealsCount > 0 && allergyData.count > 0 && (
        <Alert
          message="URGENT: ALREADY CROSS-REFERENCE DETECTED"
          description={`WARNING! ${allergyData.count} subscribed student(s) have registered allergies that conflict with today's scheduled meal ingredients!`}
          type="error"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 24, borderRadius: 12, border: '2px solid #ef4444' }}
        />
      )}

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Weekly Canteen Menu" variant="borderless" style={{ borderRadius: 16 }}>
            <Calendar 
              cellRender={(current, info) => {
                if (info.type === 'date') return dateCellRender(current);
                return info.originNode;
              }} 
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Active Meal Subscriptions" variant="borderless" style={{ borderRadius: 16 }}>
            <Table
              dataSource={subscriptions}
              columns={subColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
              rowClassName={(record) => allergyData.flagged.some(f => f.id === record.id) ? 'allergy-alert-row' : ''}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Create New Meal"
        open={isMealModalOpen}
        onCancel={() => setIsMealModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAddMeal}>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="type" label="Meal Type" rules={[{ required: true }]}>
            <Select>
              <Option value="BREAKFAST">Breakfast</Option>
              <Option value="LUNCH">Lunch</Option>
              <Option value="SNACK">Snack</Option>
            </Select>
          </Form.Item>
          <Form.Item name="name" label="Meal Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Chicken Rice" />
          </Form.Item>
          <Form.Item name="ingredients" label="Ingredients (Comma separated for Allergy Checks)" rules={[{ required: true }]}>
            <Input.TextArea placeholder="e.g. chicken, rice, soy sauce, peanuts" rows={3} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Optional details..." rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .allergy-alert-row {
          background-color: #fef2f2 !important;
          animation: pulse-red 2s infinite;
        }
        @keyframes pulse-red {
          0% { background-color: #fef2f2; }
          50% { background-color: #fee2e2; }
          100% { background-color: #fef2f2; }
        }
      `}</style>
    </div>
  );
}
