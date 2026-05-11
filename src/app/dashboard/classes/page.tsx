'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Space,
  Typography,
  Progress,
  Row,
  Col,
  Modal,
  Spin,
  Statistic,
  Badge,
  Carousel,
  Collapse,
  Descriptions,
  Tag,
  Tabs,
  Empty,
  Skeleton,
  Calendar as AntCalendar,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  FireOutlined,
  StarOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import ClassForm from '@/components/forms/ClassForm';
import type { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { CheckableTag } = Tag;

interface Class {
  id: string;
  name: string;
  level: string;
  capacity: number;
  description?: string;
  schedule: string;
  room: string;
  teacher?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  students: Array<{
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;
  }>;
  _count: {
    students: number;
  };
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [capacityFilter, setCapacityFilter] = useState<string[]>([]);
  const [viewType, setViewType] = useState('grid');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (classData: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      });

      if (response.ok) {
        await fetchClasses();
        setShowAddModal(false);
        alert('Class created successfully!');
      } else {
        const error = await response.text();
        alert(`Error creating class: ${error}`);
      }
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Error creating class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClass = async (classData: any) => {
    if (!selectedClass) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/classes/${selectedClass.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      });

      if (response.ok) {
        await fetchClasses();
        setShowEditModal(false);
        setSelectedClass(null);
        alert('Class updated successfully!');
      } else {
        const error = await response.text();
        alert(`Error updating class: ${error}`);
      }
    } catch (error) {
      console.error('Error updating class:', error);
      alert('Error updating class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClass = async (classItem: Class) => {
    if (confirm(`Are you sure you want to delete ${classItem.name}? This will affect all enrolled students.`)) {
      try {
        const response = await fetch(`/api/classes/${classItem.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchClasses();
          alert('Class deleted successfully!');
        } else {
          const error = await response.text();
          alert(`Error deleting class: ${error}`);
        }
      } catch (error) {
        console.error('Error deleting class:', error);
        alert('Error deleting class. Please try again.');
      }
    }
  };

  const handleViewClass = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowViewModal(true);
  };

  const handleEditClick = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowEditModal(true);
  };

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch =
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (classItem.teacher &&
        (`${classItem.teacher.firstName} ${classItem.teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
         classItem.teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(classItem.level);

    const capacityPercentage = (classItem._count.students / classItem.capacity) * 100;
    const matchesCapacity = capacityFilter.length === 0 || capacityFilter.some(filter => {
      if (filter === 'Available' && capacityPercentage < 75) return true;
      if (filter === 'Nearly Full' && capacityPercentage >= 75 && capacityPercentage < 90) return true;
      if (filter === 'Full' && capacityPercentage >= 90) return true;
      return false;
    });

    return matchesSearch && matchesLevel && matchesCapacity;
  });

  const uniqueLevels = [...new Set(classes.map(c => c.level))];

  const getProgressStatus = (current: number, capacity: number): 'success' | 'normal' | 'exception' => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return 'exception';
    if (percentage >= 75) return 'normal';
    return 'success';
  };

  const getCapacityLabel = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return 'Nearly Full';
    if (percentage >= 75) return 'Getting Full';
    return 'Available Spots';
  };

  const getFeaturedClasses = () => {
    const sorted = [...classes].sort((a, b) => {
      const percentA = (a._count.students / a.capacity) * 100;
      const percentB = (b._count.students / b.capacity) * 100;
      return percentB - percentA;
    });
    return sorted.slice(0, 4);
  };

  const handleLevelChange = (level: string, checked: boolean) => {
    setSelectedLevels(prev =>
      checked ? [...prev, level] : prev.filter(l => l !== level)
    );
  };

  const handleCapacityChange = (capacity: string, checked: boolean) => {
    setCapacityFilter(prev =>
      checked ? [...prev, capacity] : prev.filter(c => c !== capacity)
    );
  };

  if (loading) {
    return (
      <div style={{ padding: 24, background: 'var(--bg-gradient)', minHeight: '100vh' }}>
        <Skeleton active paragraph={{ rows: 2 }} style={{ marginBottom: 24 }} />
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map(i => (
            <Col xs={24} md={12} lg={8} key={i}>
              <Card>
                <Skeleton active paragraph={{ rows: 4 }} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: 'var(--bg-gradient)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Class Management
          </Title>
          <Text style={{ color: '#8c8c8c', fontSize: 16 }}>Manage classes, assignments, and capacity</Text>
        </div>
        <Space>
          <Tooltip title="View Schedule Calendar">
            <Button
              icon={<CalendarOutlined />}
              onClick={() => setShowCalendarModal(true)}
              style={{ borderRadius: 8 }}
            >
              Calendar
            </Button>
          </Tooltip>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowAddModal(true)}
            style={{ borderRadius: 8, background: '#6366f1', borderColor: '#6366f1' }}
          >
            Add Class
          </Button>
        </Space>
      </div>

      {/* Featured Classes Carousel */}
      {classes.length > 0 && (
        <Card style={{ marginBottom: 24, borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FireOutlined style={{ fontSize: 20, color: '#f59e0b' }} />
            <Title level={4} style={{ margin: 0 }}>Featured Classes</Title>
          </div>
          <Carousel autoplay dotPosition="bottom" style={{ paddingBottom: 16 }}>
            {getFeaturedClasses().map((classItem) => {
              const capacityPercentage = (classItem._count.students / classItem.capacity) * 100;
              return (
                <div key={classItem.id}>
                  <Card
                    style={{
                      marginLeft: 4,
                      marginRight: 4,
                      borderRadius: 12,
                      background: 'var(--primary-gradient)',
                      border: 'none',
                    }}
                    styles={{ body: {} }}
                  >
                    <Row gutter={16} align="middle">
                      <Col flex="auto">
                        <Title level={3} style={{ color: 'white', margin: 0 }}>{classItem.name}</Title>
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>{classItem.level}</Text>
                        <div style={{ marginTop: 12 }}>
                          <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                            <TeamOutlined /> {classItem._count.students}/{classItem.capacity} students
                          </Text>
                        </div>
                      </Col>
                      <Col>
                        <Progress
                          type="circle"
                          percent={Math.min(capacityPercentage, 100)}
                          size={100}
                          strokeColor="#10b981"
                          trailColor="rgba(255,255,255,0.3)"
                          format={(percent) => <span style={{ color: 'white', fontWeight: 'bold' }}>{percent}%</span>}
                        />
                      </Col>
                    </Row>
                  </Card>
                </div>
              );
            })}
          </Carousel>
        </Card>
      )}

      {/* CheckableTag Filters */}
      <Card style={{ marginBottom: 24, borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ marginRight: 12 }}>Filter by Level:</Text>
          <Space wrap>
            {uniqueLevels.map(level => (
              <CheckableTag
                key={level}
                checked={selectedLevels.includes(level)}
                onChange={(checked) => handleLevelChange(level, checked)}
                style={{
                  borderRadius: 8,
                  padding: '4px 12px',
                  fontSize: 14,
                  border: selectedLevels.includes(level) ? '1px solid #6366f1' : '1px solid #d9d9d9',
                  backgroundColor: selectedLevels.includes(level) ? '#6366f1' : 'transparent',
                  color: selectedLevels.includes(level) ? 'white' : '#595959',
                }}
              >
                {level}
              </CheckableTag>
            ))}
          </Space>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ marginRight: 12 }}>Filter by Capacity:</Text>
          <Space wrap>
            {['Available', 'Nearly Full', 'Full'].map(capacity => (
              <CheckableTag
                key={capacity}
                checked={capacityFilter.includes(capacity)}
                onChange={(checked) => handleCapacityChange(capacity, checked)}
                style={{
                  borderRadius: 8,
                  padding: '4px 12px',
                  fontSize: 14,
                  border: capacityFilter.includes(capacity) ? '1px solid #10b981' : '1px solid #d9d9d9',
                  backgroundColor: capacityFilter.includes(capacity) ? '#10b981' : 'transparent',
                  color: capacityFilter.includes(capacity) ? 'white' : '#595959',
                }}
              >
                {capacity}
              </CheckableTag>
            ))}
          </Space>
        </div>

        <Input
          placeholder="Search classes by name, room, or teacher..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ borderRadius: 8 }}
          size="large"
        />
      </Card>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="Total Classes"
              value={classes.length}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#6366f1', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="Total Students"
              value={classes.reduce((sum, c) => sum + c._count.students, 0)}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#10b981', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="Avg Class Size"
              value={Math.round(classes.reduce((sum, c) => sum + c._count.students, 0) / classes.length || 0)}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#8b5cf6', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic
              title="Capacity Used"
              value={Math.round((classes.reduce((sum, c) => sum + c._count.students, 0) /
                        classes.reduce((sum, c) => sum + c.capacity, 0)) * 100 || 0)}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#f59e0b', fontWeight: 700 }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs for different views */}
      <Tabs
        activeKey={viewType}
        onChange={setViewType}
        size="large"
        style={{ marginBottom: 16 }}
        items={[
          {
            key: 'grid',
            label: (
              <span>
                <AppstoreOutlined /> Grid View
              </span>
            ),
          },
          {
            key: 'list',
            label: (
              <span>
                <UnorderedListOutlined /> List View
              </span>
            ),
          },
        ]}
      />

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              <Title level={4} style={{ color: '#8c8c8c' }}>No classes found</Title>
              <Text type="secondary">
                {searchTerm || selectedLevels.length > 0 || capacityFilter.length > 0
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first class"
                }
              </Text>
            </span>
          }
          style={{
            padding: '60px 0',
            background: 'white',
            borderRadius: 16,
          }}
        />
      ) : viewType === 'grid' ? (
        <Row gutter={[16, 16]}>
          {filteredClasses.map((classItem) => {
            const capacityPercentage = (classItem._count.students / classItem.capacity) * 100;
            const isNearlyFull = capacityPercentage >= 90;

            return (
              <Col xs={24} md={12} lg={8} key={classItem.id}>
                {isNearlyFull ? (
                  <Badge.Ribbon text="Nearly Full" color="volcano">
                    <Card
                      hoverable
                      style={{
                        borderRadius: 16,
                        transition: 'all 0.3s ease',
                      }}
                      styles={{ body: {} }}
                      actions={[
                        <Button
                          key="view"
                          type="text"
                          icon={<EyeOutlined />}
                          onClick={() => handleViewClass(classItem)}
                        />,
                        <Button
                          key="edit"
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => handleEditClick(classItem)}
                        />,
                        <Button
                          key="delete"
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteClass(classItem)}
                        />,
                      ]}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ marginBottom: 16 }}>
                        <Title level={4} style={{ margin: 0 }}>{classItem.name}</Title>
                        <Tag color="blue" style={{ marginTop: 8 }}>{classItem.level}</Tag>
                      </div>

                      <Collapse
                        ghost
                        items={[
                          {
                            key: '1',
                            label: 'Class Details',
                            children: (
                              <Descriptions column={1} size="small">
                                <Descriptions.Item label="Schedule">{classItem.schedule}</Descriptions.Item>
                                <Descriptions.Item label="Room">{classItem.room}</Descriptions.Item>
                                {classItem.teacher && (
                                  <Descriptions.Item label="Teacher">
                                    {classItem.teacher.firstName} {classItem.teacher.lastName}
                                  </Descriptions.Item>
                                )}
                                {classItem.description && (
                                  <Descriptions.Item label="Description">{classItem.description}</Descriptions.Item>
                                )}
                              </Descriptions>
                            ),
                          },
                        ]}
                      />

                      <div style={{ marginTop: 16, textAlign: 'center' }}>
                        <Progress
                          type="circle"
                          percent={Math.min(capacityPercentage, 100)}
                          size={80}
                          strokeColor={
                            capacityPercentage >= 90 ? '#ef4444' :
                            capacityPercentage >= 75 ? '#f59e0b' : '#10b981'
                          }
                          format={() => (
                            <div>
                              <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                                {classItem._count.students}/{classItem.capacity}
                              </div>
                              <div style={{ fontSize: 12, color: '#8c8c8c' }}>students</div>
                            </div>
                          )}
                        />
                      </div>
                    </Card>
                  </Badge.Ribbon>
                ) : (
                  <Card
                    hoverable
                    style={{
                      borderRadius: 16,
                      transition: 'all 0.3s ease',
                    }}
                    styles={{ body: {} }}
                    actions={[
                      <Button
                        key="view"
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewClass(classItem)}
                      />,
                      <Button
                        key="edit"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditClick(classItem)}
                      />,
                      <Button
                        key="delete"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteClass(classItem)}
                      />,
                    ]}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ marginBottom: 16 }}>
                      <Title level={4} style={{ margin: 0 }}>{classItem.name}</Title>
                      <Tag color="blue" style={{ marginTop: 8 }}>{classItem.level}</Tag>
                    </div>

                    <Collapse
                      ghost
                      items={[
                        {
                          key: '1',
                          label: 'Class Details',
                          children: (
                            <Descriptions column={1} size="small">
                              <Descriptions.Item label="Schedule">{classItem.schedule}</Descriptions.Item>
                              <Descriptions.Item label="Room">{classItem.room}</Descriptions.Item>
                              {classItem.teacher && (
                                <Descriptions.Item label="Teacher">
                                  {classItem.teacher.firstName} {classItem.teacher.lastName}
                                </Descriptions.Item>
                              )}
                              {classItem.description && (
                                <Descriptions.Item label="Description">{classItem.description}</Descriptions.Item>
                              )}
                            </Descriptions>
                          ),
                        },
                      ]}
                    />

                    <div style={{ marginTop: 16, textAlign: 'center' }}>
                      <Progress
                        type="circle"
                        percent={Math.min(capacityPercentage, 100)}
                        size={80}
                        strokeColor={
                          capacityPercentage >= 90 ? '#ef4444' :
                          capacityPercentage >= 75 ? '#f59e0b' : '#10b981'
                        }
                        format={() => (
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                              {classItem._count.students}/{classItem.capacity}
                            </div>
                            <div style={{ fontSize: 12, color: '#8c8c8c' }}>students</div>
                          </div>
                        )}
                      />
                    </div>
                  </Card>
                )}
              </Col>
            );
          })}
        </Row>
      ) : (
        <Card style={{ borderRadius: 16 }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {filteredClasses.map((classItem) => {
              const capacityPercentage = (classItem._count.students / classItem.capacity) * 100;
              return (
                <Card
                  key={classItem.id}
                  size="small"
                  style={{ borderRadius: 12 }}
                >
                  <Row gutter={16} align="middle">
                    <Col flex="auto">
                      <div>
                        <Text strong style={{ fontSize: 16 }}>{classItem.name}</Text>
                        <Tag color="blue" style={{ marginLeft: 8 }}>{classItem.level}</Tag>
                      </div>
                      <Text type="secondary">
                        {classItem.room} • {classItem.schedule}
                      </Text>
                    </Col>
                    <Col>
                      <Progress
                        type="circle"
                        percent={Math.min(capacityPercentage, 100)}
                        size={60}
                        strokeColor={
                          capacityPercentage >= 90 ? '#ef4444' :
                          capacityPercentage >= 75 ? '#f59e0b' : '#10b981'
                        }
                        format={() => `${classItem._count.students}/${classItem.capacity}`}
                      />
                    </Col>
                    <Col>
                      <Space>
                        <Button
                          type="text"
                          icon={<EyeOutlined />}
                          onClick={() => handleViewClass(classItem)}
                        />
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => handleEditClick(classItem)}
                        />
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteClass(classItem)}
                        />
                      </Space>
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </Space>
        </Card>
      )}

      {/* Add Class Form */}
      <ClassForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddClass}
        isLoading={isSubmitting}
        mode="create"
      />

      {/* Edit Class Form */}
      <ClassForm
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedClass(null);
        }}
        onSubmit={handleEditClass}
        isLoading={isSubmitting}
        classData={selectedClass}
        mode="edit"
      />

      {/* View Class Modal */}
      <Modal
        title="Class Details"
        open={showViewModal}
        onCancel={() => {
          setShowViewModal(false);
          setSelectedClass(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setShowViewModal(false);
              setSelectedClass(null);
            }}
          >
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedClass && (
          <>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Title level={4}>Class Information</Title>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary">Class Name:</Text>
                    <div>{selectedClass.name}</div>
                  </div>
                  <div>
                    <Text type="secondary">Level:</Text>
                    <div>{selectedClass.level}</div>
                  </div>
                  <div>
                    <Text type="secondary">Room:</Text>
                    <div>{selectedClass.room}</div>
                  </div>
                  <div>
                    <Text type="secondary">Schedule:</Text>
                    <div>{selectedClass.schedule || 'Not specified'}</div>
                  </div>
                  <div>
                    <Text type="secondary">Capacity:</Text>
                    <div>{selectedClass._count.students}/{selectedClass.capacity} students</div>
                  </div>
                </Space>
              </Col>
              <Col span={12}>
                <Title level={4}>Teacher & Students</Title>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {selectedClass.teacher ? (
                    <div>
                      <Text type="secondary">Primary Teacher:</Text>
                      <div>
                        {selectedClass.teacher.firstName} {selectedClass.teacher.lastName}
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        ID: {selectedClass.teacher.employeeId}
                      </Text>
                    </div>
                  ) : (
                    <div>
                      <Text type="secondary">Primary Teacher:</Text>
                      <Text type="secondary">No teacher assigned</Text>
                    </div>
                  )}
                  <div>
                    <Text type="secondary">Students Enrolled:</Text>
                    <div>{selectedClass._count.students}</div>
                  </div>
                  <div>
                    <Text type="secondary">Available Spots:</Text>
                    <div>{selectedClass.capacity - selectedClass._count.students}</div>
                  </div>
                </Space>
              </Col>
            </Row>
            {selectedClass.description && (
              <div style={{ marginTop: 24 }}>
                <Title level={4}>Description</Title>
                <Text type="secondary">{selectedClass.description}</Text>
              </div>
            )}
          </>
        )}
      </Modal>

      {/* Calendar Modal */}
      <Modal
        title="Class Schedule Calendar"
        open={showCalendarModal}
        onCancel={() => setShowCalendarModal(false)}
        footer={null}
        width={800}
      >
        <AntCalendar
          fullscreen={false}
          headerRender={({ value, onChange }) => {
            const month = value.month();
            const year = value.year();
            return (
              <div style={{ padding: 8 }}>
                <Row gutter={8}>
                  <Col>
                    <Select
                      value={month}
                      onChange={(newMonth) => {
                        const newValue = value.clone().month(newMonth);
                        onChange(newValue);
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <Select.Option key={i} value={i}>
                          {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                  <Col>
                    <Select
                      value={year}
                      onChange={(newYear) => {
                        const newValue = value.clone().year(newYear);
                        onChange(newValue);
                      }}
                    >
                      {Array.from({ length: 10 }, (_, i) => {
                        const y = new Date().getFullYear() - 5 + i;
                        return (
                          <Select.Option key={y} value={y}>
                            {y}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Col>
                </Row>
              </div>
            );
          }}
        />
        <div style={{ marginTop: 16, padding: 16, background: '#f5f7fa', borderRadius: 8 }}>
          <Title level={5}>Active Classes</Title>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {classes.slice(0, 5).map(classItem => (
              <div key={classItem.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>{classItem.name}</Text>
                <Tag color="blue">{classItem.schedule}</Tag>
              </div>
            ))}
          </Space>
        </div>
      </Modal>
    </div>
  );
}