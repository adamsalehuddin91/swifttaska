'use client';

import { useState, useEffect } from 'react';
import { App, Card,
  Timeline,
  Image,
  FloatButton,
  Checkbox,
  Tag,
  Calendar,
  Tabs,
  Drawer,
  Badge,
  Empty,
  Row,
  Col,
  Button,
  Input,
  Select,
  Spin,
  Rate,
  Space,
  Statistic } from 'antd';
import {
  PlusOutlined,
  FilterOutlined,
  DownloadOutlined,
  TrophyOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  StarOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { BadgeProps } from 'antd';
import dayjs from 'dayjs';
import ActivityForm from '@/components/forms/ActivityForm';

interface Activity {
  id: string;
  name: string;
  description: string;
  type: string;
  date: string;
  duration?: number;
  location: string;
  maxParticipants?: number;
  class?: {
    id: string;
    name: string;
    level: string;
  };
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  participants: Array<{
    id: string;
    student: {
      id: string;
      firstName: string;
      lastName: string;
      studentId: string;
    };
  }>;
  _count: {
    participants: number;
  };
}

const categoryColors: Record<string, string> = {
  EDUCATIONAL: '#1890ff',
  RECREATIONAL: '#52c41a',
  FIELD_TRIP: '#722ed1',
  SPORTS: '#fa8c16',
  ARTS_CRAFTS: '#eb2f96',
  SPECIAL_EVENT: '#fadb14',
};

const activityCategories = [
  { label: 'Academic', value: 'EDUCATIONAL' },
  { label: 'Sports', value: 'SPORTS' },
  { label: 'Arts & Crafts', value: 'ARTS_CRAFTS' },
  { label: 'Music', value: 'SPECIAL_EVENT' },
  { label: 'Field Trip', value: 'FIELD_TRIP' },
  { label: 'Recreation', value: 'RECREATIONAL' },
];

export default function ActivitiesPage() {
  const { message } = App.useApp();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewDrawer, setShowViewDrawer] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    fetchActivities();
  }, [upcomingOnly]);

  const fetchActivities = async () => {
    try {
      const params = new URLSearchParams();
      if (upcomingOnly) params.append('upcoming', 'true');

      const response = await fetch(`/api/activities?${params}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      message.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (activityData: any) => {
    setIsSubmitting(true);
    try {
      const combinedDateTime = new Date(`${activityData.date}T${activityData.time}`);

      const payload = {
        ...activityData,
        date: combinedDateTime.toISOString(),
        duration: activityData.duration ? parseInt(activityData.duration) : null,
        maxParticipants: activityData.maxParticipants ? parseInt(activityData.maxParticipants) : null,
      };

      delete payload.time;

      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchActivities();
        setShowAddModal(false);
        message.success('Activity created successfully!');
      } else {
        const error = await response.text();
        message.error(`Error creating activity: ${error}`);
      }
    } catch (error) {
      console.error('Error creating activity:', error);
      message.error('Error creating activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditActivity = async (activityData: any) => {
    if (!selectedActivity) return;

    setIsSubmitting(true);
    try {
      const combinedDateTime = new Date(`${activityData.date}T${activityData.time}`);

      const payload = {
        ...activityData,
        date: combinedDateTime.toISOString(),
        duration: activityData.duration ? parseInt(activityData.duration) : null,
        maxParticipants: activityData.maxParticipants ? parseInt(activityData.maxParticipants) : null,
      };

      delete payload.time;

      const response = await fetch(`/api/activities/${selectedActivity.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchActivities();
        setShowEditModal(false);
        setSelectedActivity(null);
        message.success('Activity updated successfully!');
      } else {
        const error = await response.text();
        message.error(`Error updating activity: ${error}`);
      }
    } catch (error) {
      console.error('Error updating activity:', error);
      message.error('Error updating activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteActivity = async (activity: Activity) => {
    if (confirm(`Are you sure you want to delete "${activity.name}"?`)) {
      try {
        const response = await fetch(`/api/activities/${activity.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchActivities();
          message.success('Activity deleted successfully!');
        } else {
          const error = await response.text();
          message.error(`Error deleting activity: ${error}`);
        }
      } catch (error) {
        console.error('Error deleting activity:', error);
        message.error('Error deleting activity. Please try again.');
      }
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch =
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(activity.type);

    return matchesSearch && matchesCategory;
  });

  const isUpcoming = (date: string) => new Date(date) > new Date();
  const isToday = (date: string) => {
    const today = new Date();
    const activityDate = new Date(date);
    return today.toDateString() === activityDate.toDateString();
  };

  const upcomingActivities = activities.filter(a => isUpcoming(a.date));
  const todayActivities = activities.filter(a => isToday(a.date));

  const getCategoryIcon = (type: string) => {
    const icons: Record<string, any> = {
      EDUCATIONAL: <StarOutlined />,
      RECREATIONAL: <PlayCircleOutlined />,
      FIELD_TRIP: <EnvironmentOutlined />,
      SPORTS: <TrophyOutlined />,
      ARTS_CRAFTS: <StarOutlined />,
      SPECIAL_EVENT: <CalendarOutlined />,
    };
    return icons[type] || <CalendarOutlined />;
  };

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
            Activities & Events
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Plan and manage educational activities and events
          </p>
        </div>
      </div>

      {/* Gradient Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'var(--primary-gradient)',
              borderRadius: '16px',
              border: 'none',
              transition: 'transform 0.2s',
            }}
            styles={{ body: {} }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Total Activities</span>}
              value={activities.length}
              valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<CalendarOutlined style={{ color: '#fff' }} />}
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
            }}
            styles={{ body: {} }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Today</span>}
              value={todayActivities.length}
              valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<PlayCircleOutlined style={{ color: '#fff' }} />}
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
            }}
            styles={{ body: {} }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Upcoming</span>}
              value={upcomingActivities.length}
              valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<ClockCircleOutlined style={{ color: '#fff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: 'var(--purple-gradient)',
              borderRadius: '16px',
              border: 'none',
              transition: 'transform 0.2s',
            }}
            styles={{ body: {} }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Total Participants</span>}
              value={activities.reduce((sum, a) => sum + a._count.participants, 0)}
              valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<UserOutlined style={{ color: '#fff' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Input
            placeholder="Search activities by name, description, or location..."
            prefix={<FilterOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="large"
            style={{ borderRadius: '8px' }}
          />
          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Filter by Category:</div>
            <Checkbox.Group
              options={activityCategories}
              value={selectedCategories}
              onChange={setSelectedCategories}
            />
          </div>
        </Space>
      </Card>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="large"
        items={[
          {
            key: 'timeline',
            label: <span><CalendarOutlined /> Timeline</span>,
            children: (
              <Card style={{ borderRadius: '12px' }}>
                {filteredActivities.length === 0 ? (
                  <Empty
                    image={<CalendarOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                    description="No activities found"
                  />
                ) : (
                  <Timeline
                    mode="alternate"
                    items={filteredActivities.map(activity => {
                      const participationRate = activity.maxParticipants
                        ? (activity._count.participants / activity.maxParticipants) * 100
                        : 0;

                      return {
                        dot: getCategoryIcon(activity.type),
                        color: categoryColors[activity.type] || '#1890ff',
                        children: (
                          <Card
                            size="small"
                            style={{ marginBottom: 8 }}
                            extra={
                              <Space>
                                <Button
                                  type="text"
                                  icon={<EyeOutlined />}
                                  onClick={() => {
                                    setSelectedActivity(activity);
                                    setShowViewDrawer(true);
                                  }}
                                />
                                <Button
                                  type="text"
                                  icon={<EditOutlined />}
                                  onClick={() => {
                                    setSelectedActivity(activity);
                                    setShowEditModal(true);
                                  }}
                                />
                                <Button
                                  type="text"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleDeleteActivity(activity)}
                                />
                              </Space>
                            }
                          >
                            <h3>{activity.name}</h3>
                            <Tag color={categoryColors[activity.type]}>
                              {activity.type.replace('_', ' ')}
                            </Tag>
                            <p style={{ margin: '8px 0' }}>{activity.description}</p>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                              <div>
                                <CalendarOutlined /> {dayjs(activity.date).format('DD MMM YYYY HH:mm')}
                                {isToday(activity.date) && <Badge count="Today" style={{ marginLeft: 8 }} />}
                                {isUpcoming(activity.date) && !isToday(activity.date) && (
                                  <Badge count="Upcoming" color="blue" style={{ marginLeft: 8 }} />
                                )}
                              </div>
                              <div><EnvironmentOutlined /> {activity.location}</div>
                              {activity.duration && (
                                <div><ClockCircleOutlined /> {activity.duration} minutes</div>
                              )}
                              <div>
                                <UserOutlined /> {activity._count.participants}
                                {activity.maxParticipants && `/${activity.maxParticipants}`} participants
                              </div>
                            </Space>
                          </Card>
                        ),
                      };
                    })}
                  />
                )}
              </Card>
            ),
          },
          {
            key: 'gallery',
            label: <span><TrophyOutlined /> Gallery</span>,
            children: (
              <Row gutter={[16, 16]}>
                {filteredActivities.length === 0 ? (
                  <Col span={24}>
                    <Empty description="No activities found" />
                  </Col>
                ) : (
                  filteredActivities.map(activity => {
                    const participationRate = activity.maxParticipants
                      ? (activity._count.participants / activity.maxParticipants) * 100
                      : 0;

                    return (
                      <Col xs={24} sm={12} lg={8} key={activity.id}>
                        <Badge.Ribbon
                          text={activity.type.replace('_', ' ')}
                          color={categoryColors[activity.type]}
                        >
                          <Card
                            hoverable
                            style={{ borderRadius: '12px' }}
                            actions={[
                              <EyeOutlined
                                key="view"
                                onClick={() => {
                                  setSelectedActivity(activity);
                                  setShowViewDrawer(true);
                                }}
                              />,
                              <EditOutlined
                                key="edit"
                                onClick={() => {
                                  setSelectedActivity(activity);
                                  setShowEditModal(true);
                                }}
                              />,
                              <DeleteOutlined
                                key="delete"
                                onClick={() => handleDeleteActivity(activity)}
                              />,
                            ]}
                            cover={
                              <div style={{ height: 160, overflow: 'hidden', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                                <Image 
                                  src={`https://api.dicebear.com/7.x/shapes/svg?seed=${activity.id}&backgroundColor=bae0ff,ffd591,d9f7be,fadb14`} 
                                  alt={activity.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  preview={true}
                                />
                              </div>
                            }
                          >
                            <Card.Meta
                              title={activity.name}
                              description={
                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                  <div style={{ fontSize: '12px' }}>{activity.description}</div>
                                  <div><CalendarOutlined /> {dayjs(activity.date).format('DD MMM YYYY HH:mm')}</div>
                                  <div><EnvironmentOutlined /> {activity.location}</div>
                                  <div>
                                    <UserOutlined /> {activity._count.participants}
                                    {activity.maxParticipants && `/${activity.maxParticipants}`}
                                  </div>
                                </Space>
                              }
                            />
                          </Card>
                        </Badge.Ribbon>
                      </Col>
                    );
                  })
                )}
              </Row>
            ),
          },
        ]}
      />

      {/* FloatButton Group */}
      <FloatButton.Group shape="circle" style={{ right: 24 }}>
        <FloatButton
          icon={<PlusOutlined />}
          tooltip="Add Activity"
          onClick={() => setShowAddModal(true)}
          type="primary"
        />
        <FloatButton
          icon={<DownloadOutlined />}
          tooltip="Export Activities"
          onClick={() => message.info('Export functionality coming soon!')}
        />
        <FloatButton.BackTop visibilityHeight={100} />
      </FloatButton.Group>

      {/* Add Activity Form */}
      <ActivityForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddActivity}
        isLoading={isSubmitting}
        mode="create"
      />

      {/* Edit Activity Form */}
      <ActivityForm
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedActivity(null);
        }}
        onSubmit={handleEditActivity}
        isLoading={isSubmitting}
        activity={selectedActivity}
        mode="edit"
      />

      {/* View Activity Drawer */}
      <Drawer
        title="Activity Details"
        placement="right"
        open={showViewDrawer}
        onClose={() => {
          setShowViewDrawer(false);
          setSelectedActivity(null);
        }}
        width={600}
      >
        {selectedActivity && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <h2>{selectedActivity.name}</h2>
              <Tag color={categoryColors[selectedActivity.type]} style={{ marginTop: 8 }}>
                {selectedActivity.type.replace('_', ' ')}
              </Tag>
            </div>

            <div>
              <h4>Description</h4>
              <p>{selectedActivity.description}</p>
            </div>

            <div>
              <h4>Details</h4>
              <Space direction="vertical">
                <div><CalendarOutlined /> {dayjs(selectedActivity.date).format('DD MMM YYYY HH:mm')}</div>
                <div><EnvironmentOutlined /> {selectedActivity.location}</div>
                {selectedActivity.duration && (
                  <div><ClockCircleOutlined /> {selectedActivity.duration} minutes</div>
                )}
                {selectedActivity.class && (
                  <div>
                    <CheckCircleOutlined /> {selectedActivity.class.name} - {selectedActivity.class.level}
                  </div>
                )}
              </Space>
            </div>

            <div>
              <h4>Participation</h4>
              <div>
                <UserOutlined /> {selectedActivity._count.participants}
                {selectedActivity.maxParticipants && ` / ${selectedActivity.maxParticipants}`} participants
              </div>
            </div>

            <div>
              <h4>Organized By</h4>
              <p>
                {selectedActivity.createdBy.firstName} {selectedActivity.createdBy.lastName}
                <br />
                <small>ID: {selectedActivity.createdBy.employeeId}</small>
              </p>
            </div>
          </Space>
        )}
      </Drawer>
    </div>
  );
}
