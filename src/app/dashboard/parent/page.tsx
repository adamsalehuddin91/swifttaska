'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Timeline, Badge, Spin, Alert, Typography, Avatar, Descriptions } from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  TrophyOutlined,
  MessageOutlined,
  BellOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface ParentData {
  parent: {
    id: string;
    firstName: string;
    lastName: string;
    relationship: string;
    student: {
      id: string;
      studentId: string;
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      class: {
        id: string;
        name: string;
        level: string;
        teacher: {
          firstName: string;
          lastName: string;
        };
      };
    };
  };
  attendance: {
    total: number;
    present: number;
    absent: number;
    rate: number;
  };
  fees: {
    pending: number;
    overdue: number;
    total: number;
  };
  recentActivities: Array<{
    id: string;
    name: string;
    date: string;
    type: string;
  }>;
  unreadMessages: number;
  announcements: Array<{
    id: string;
    title: string;
    type: string;
    createdAt: string;
  }>;
}

export default function ParentDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ParentData | null>(null);

  useEffect(() => {
    fetchParentData();
  }, []);

  const fetchParentData = async () => {
    try {
      const response = await fetch('/api/parents/me');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch parent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      ACADEMIC: 'blue',
      SPORTS: 'green',
      ARTS: 'purple',
      MUSIC: 'orange',
      FIELD_TRIP: 'cyan',
      CELEBRATION: 'magenta',
      WORKSHOP: 'geekblue',
      OTHER: 'default',
    };
    return colors[type] || 'default';
  };

  const getAnnouncementColor = (type: string) => {
    const colors: Record<string, string> = {
      GENERAL: 'default',
      EVENT: 'blue',
      REMINDER: 'orange',
      EMERGENCY: 'red',
      ACHIEVEMENT: 'green',
    };
    return colors[type] || 'default';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="Parent Account Not Found"
          description="Please contact the administration to set up your parent account."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  const { parent, attendance, fees, recentActivities, unreadMessages, announcements } = data;
  const student = parent.student;

  return (
    <div style={{ padding: 24 }}>
      {/* Welcome Header */}
      <Card
        style={{
          background: 'var(--primary-gradient)',
          marginBottom: 24,
          border: 'none',
        }}
      >
        <Title level={2} style={{ color: 'white', margin: 0 }}>
          Welcome, {parent.firstName}!
        </Title>
        <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 16 }}>
          Parent Portal - {parent.relationship}
        </Text>
      </Card>

      {/* Child Info Card */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Avatar
              size={80}
              style={{ background: 'var(--primary-gradient)' }}
            >
              <span style={{ fontSize: 32 }}>
                {student.firstName[0]}{student.lastName[0]}
              </span>
            </Avatar>
          </Col>
          <Col flex="auto">
            <Title level={3} style={{ margin: 0, marginBottom: 8 }}>
              {student.firstName} {student.lastName}
            </Title>
            <Descriptions column={{ xs: 1, sm: 2, md: 4 }}>
              <Descriptions.Item label="Student ID">{student.studentId}</Descriptions.Item>
              <Descriptions.Item label="Age">{calculateAge(student.dateOfBirth)} years old</Descriptions.Item>
              <Descriptions.Item label="Class">{student.class.name} ({student.class.level})</Descriptions.Item>
              <Descriptions.Item label="Teacher">
                {student.class.teacher.firstName} {student.class.teacher.lastName}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Attendance Rate"
              value={attendance.rate}
              suffix="%"
              prefix={<CalendarOutlined />}
              valueStyle={{ color: attendance.rate >= 90 ? '#3f8600' : attendance.rate >= 75 ? '#faad14' : '#cf1322' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {attendance.present} present / {attendance.total} days
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Fees"
              value={fees.pending}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: fees.pending > 0 ? '#faad14' : '#3f8600' }}
            />
            {fees.overdue > 0 && (
              <Text type="danger" style={{ fontSize: 12 }}>
                RM {fees.overdue.toFixed(2)} overdue
              </Text>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Activities"
              value={recentActivities.length}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>This month</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Badge count={unreadMessages} offset={[10, 0]}>
              <Statistic
                title="Messages"
                value={unreadMessages}
                prefix={<MessageOutlined />}
                valueStyle={{ color: unreadMessages > 0 ? '#fa8c16' : '#8c8c8c' }}
              />
            </Badge>
            <Text type="secondary" style={{ fontSize: 12 }}>Unread</Text>
          </Card>
        </Col>
      </Row>

      {/* Activities and Announcements */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <TrophyOutlined style={{ marginRight: 8 }} />
                Recent Activities
              </span>
            }
          >
            {recentActivities.length > 0 ? (
              <Timeline
                items={recentActivities.map((activity) => ({
                  dot: <CheckCircleOutlined style={{ fontSize: 16 }} />,
                  color: getActivityColor(activity.type) as any,
                  children: (
                    <div>
                      <Text strong>{activity.name}</Text>
                      <br />
                      <Badge color={getActivityColor(activity.type)} text={activity.type} />
                      <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                        {new Date(activity.date).toLocaleDateString()}
                      </Text>
                    </div>
                  ),
                }))}
              />
            ) : (
              <Text type="secondary">No recent activities</Text>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span>
                <BellOutlined style={{ marginRight: 8 }} />
                Announcements
              </span>
            }
          >
            {announcements.length > 0 ? (
              <Timeline
                items={announcements.map((announcement) => ({
                  dot: <BellOutlined style={{ fontSize: 16 }} />,
                  color: getAnnouncementColor(announcement.type) as any,
                  children: (
                    <div>
                      <Text strong>{announcement.title}</Text>
                      <br />
                      <Badge color={getAnnouncementColor(announcement.type)} text={announcement.type} />
                      <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </Text>
                    </div>
                  ),
                }))}
              />
            ) : (
              <Text type="secondary">No announcements</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
