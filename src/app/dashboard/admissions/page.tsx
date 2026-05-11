'use client';

import { useState, useEffect } from 'react';
import { App, Card, Button, Modal, Form, Input, Select, Tag, Typography, Badge } from 'antd';
import { PlusOutlined, PhoneOutlined, MailOutlined, DragOutlined } from '@ant-design/icons';

interface Lead {
  id: string;
  parentName: string;
  childName: string;
  phone: string;
  email: string | null;
  status: string;
  notes: string | null;
}

const columns = [
  { id: 'NEW', title: 'New Leads', color: 'blue' },
  { id: 'CONTACTED', title: 'Contacted', color: 'orange' },
  { id: 'TOUR_SCHEDULED', title: 'Tour Scheduled', color: 'purple' },
  { id: 'ENROLLED', title: 'Enrolled', color: 'green' },
  { id: 'REJECTED', title: 'Rejected', color: 'red' },
];

export default function AdmissionsPage() {
  const { message } = App.useApp();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) setLeads(await res.json());
    } catch(e) { message.error("Failed to load leads"); }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        message.success('Status updated');
        fetchLeads();
      }
    } catch(e) { message.error("Failed to update"); }
  };

  const handleSubmit = async (values: any) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (res.ok) {
        message.success('Lead added successfully');
        setIsModalOpen(false);
        form.resetFields();
        fetchLeads();
      }
    } catch(e) { message.error("Failed to add lead"); }
  };

  return (
    <div style={{ padding: 24, background: 'var(--bg-gradient)', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
           <Typography.Title level={2} style={{ margin: 0, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
             Admissions CRM
           </Typography.Title>
           <Typography.Text type="secondary">Manage prospective families and waitlists</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setIsModalOpen(true)} style={{ borderRadius: 8 }}>
          Add New Lead
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
        {columns.map(col => (
          <div key={col.id} style={{ minWidth: 280, flex: 1, backgroundColor: 'rgba(255,255,255,0.4)', padding: 12, borderRadius: 12 }}>
            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                 <Badge color={col.color} />
                 <Typography.Text strong>{col.title}</Typography.Text>
              </div>
              <Tag style={{ borderRadius: 12, border: 0, background: 'white' }}>{leads.filter(l => l.status === col.id).length}</Tag>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {leads.filter(l => l.status === col.id).map(lead => (
                <Card 
                  key={lead.id} 
                  hoverable 
                  style={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                  styles={{ body: {} }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography.Text strong>{lead.childName}</Typography.Text>
                  </div>
                  <div style={{ fontSize: 13, color: 'gray', marginTop: 4 }}>
                    Parent: {lead.parentName}
                  </div>
                  
                  <div style={{ margin: '12px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}><PhoneOutlined /> {lead.phone}</Typography.Text>
                    {lead.email && <Typography.Text type="secondary" style={{ fontSize: 12 }}><MailOutlined /> {lead.email}</Typography.Text>}
                  </div>

                  {lead.notes && (
                    <div style={{ background: '#f5f5f5', padding: 8, borderRadius: 6, fontSize: 12, marginBottom: 12 }}>
                      {lead.notes}
                    </div>
                  )}

                  <Select 
                    value={lead.status} 
                    size="small" 
                    onChange={(v) => handleUpdateStatus(lead.id, v)}
                    style={{ width: '100%' }}
                    options={columns.map(c => ({ value: c.id, label: `Move to ${c.title}` }))}
                  />
                </Card>
              ))}
              
              {leads.filter(l => l.status === col.id).length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#a0aec0', fontSize: 12 }}>
                  Empty Stage
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal title="Add New Prospective Lead" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} okText="Save Lead" width={500}>
        <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="childName" label="Child's Name" rules={[{ required: true, message: 'Child name is required' }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="parentName" label="Parent's Name" rules={[{ required: true, message: 'Parent name is required' }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="phone" label="Contact Number" rules={[{ required: true, message: 'Phone is required' }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="email" label="Email Address">
            <Input type="email" size="large" />
          </Form.Item>
          <Form.Item name="notes" label="Special Notes / Requirements">
            <Input.TextArea rows={3} placeholder="Dietary needs, enrollment dates, etc." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
