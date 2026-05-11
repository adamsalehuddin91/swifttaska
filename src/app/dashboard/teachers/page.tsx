'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Space,
  Typography,
  Tag,
  Statistic,
  Row,
  Col,
  Spin,
  Tabs,
  List,
  Drawer,
  Timeline,
  Progress,
  Popover,
  Segmented,
  Avatar,
  Badge,
  Tooltip,
  Empty,
  Skeleton
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  TeamOutlined,
  BookOutlined,
  DollarOutlined,
  TrophyOutlined,
  UserOutlined,
  MoreOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import TeacherForm from '@/components/forms/TeacherForm';

const { Title, Text } = Typography;

interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  qualification: string;
  specialization: string;
  salary: number;
  status: string;
  user?: {
    name: string;
    email: string;
  };
  classes?: Array<{
    id: string;
    name: string;
    level: string;
    _count: {
      students: number;
    };
  }>;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewDrawer, setShowViewDrawer] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [specializationFilter, setSpecializationFilter] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers');
      if (response.ok) {
        const data = await response.json();
        setTeachers(data);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (teacherData: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherData),
      });

      if (response.ok) {
        await fetchTeachers();
        setShowAddModal(false);
        alert('Teacher added successfully!');
      } else {
        const error = await response.text();
        alert(`Error adding teacher: ${error}`);
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
      alert('Error adding teacher. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTeacher = async (teacherData: any) => {
    if (!selectedTeacher) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/teachers/${selectedTeacher.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherData),
      });

      if (response.ok) {
        await fetchTeachers();
        setShowEditModal(false);
        setSelectedTeacher(null);
        alert('Teacher updated successfully!');
      } else {
        const error = await response.text();
        alert(`Error updating teacher: ${error}`);
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
      alert('Error updating teacher. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeacher = async (teacher: Teacher) => {
    if (confirm(`Are you sure you want to delete ${teacher.firstName} ${teacher.lastName}?`)) {
      try {
        const response = await fetch(`/api/teachers/${teacher.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchTeachers();
          alert('Teacher deleted successfully!');
        } else {
          const error = await response.text();
          alert(`Error deleting teacher: ${error}`);
        }
      } catch (error) {
        console.error('Error deleting teacher:', error);
        alert('Error deleting teacher. Please try again.');
      }
    }
  };

  const handleViewTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowViewDrawer(true);
  };

  const handleEditClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch =
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = activeTab === 'ALL' || teacher.status === activeTab;
    const matchesSpecialization = !specializationFilter || teacher.specialization === specializationFilter;

    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  const uniqueSpecializations = [...new Set(teachers.map(t => t.specialization).filter(Boolean))];

  const getAvatarGradient = (name: string) => {
    const gradients = [
      'var(--primary-gradient)',
      'var(--pink-gradient)',
      'var(--cyan-gradient)',
      'var(--mint-gradient)',
      'var(--yellow-gradient)',
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const tabCounts = {
    ALL: teachers.length,
    ACTIVE: teachers.filter(t => t.status === 'ACTIVE').length,
    ON_LEAVE: teachers.filter(t => t.status === 'ON_LEAVE').length,
    INACTIVE: teachers.filter(t => t.status === 'INACTIVE').length,
  };

  const quickActions: any = (teacher: Teacher) => ({
    items: [
      {
        key: 'view',
        label: 'View Details',
        icon: <EyeOutlined />,
        onClick: () => handleViewTeacher(teacher),
      },
      {
        key: 'edit',
        label: 'Edit Teacher',
        icon: <EditOutlined />,
        onClick: () => handleEditClick(teacher),
      },
      {
        type: 'divider',
      },
      {
        key: 'delete',
        label: 'Delete Teacher',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => handleDeleteTeacher(teacher),
      },
    ],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'default';
      case 'ON_LEAVE': return 'warning';
      default: return 'default';
    }
  };


  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: 'var(--bg-gradient)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Teacher Management
          </Title>
          <Text type="secondary">Manage teaching staff and their assignments</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowAddModal(true)}
          size="large"
          style={{ borderRadius: 12, background: 'var(--primary-gradient)', border: 'none' }}
        >
          Add Teacher
        </Button>
      </div>

      {/* Search and Filters */}
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Space direction="horizontal" style={{ width: '100%' }} size="middle" wrap>
          <Input
            placeholder="Search teachers by name, ID, or email..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300, borderRadius: 8 }}
          />
          <Select
            placeholder="All Specializations"
            value={specializationFilter || undefined}
            onChange={(value) => setSpecializationFilter(value || '')}
            style={{ width: 200, borderRadius: 8 }}
            allowClear
          >
            {uniqueSpecializations.map(spec => (
              <Select.Option key={spec} value={spec}>{spec}</Select.Option>
            ))}
          </Select>
          <Segmented
            value={viewMode}
            onChange={(value) => setViewMode(value as 'list' | 'grid')}
            options={[
              { label: 'List', value: 'list', icon: <UnorderedListOutlined /> },
              { label: 'Grid', value: 'grid', icon: <AppstoreOutlined /> },
            ]}
          />
        </Space>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: 12, transition: 'all 0.3s' }}>
            <Statistic
              title="Total Teachers"
              value={teachers.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#6366f1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: 12, transition: 'all 0.3s' }}>
            <Statistic
              title="Active Teachers"
              value={teachers.filter(t => t.status === 'ACTIVE').length}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: 12, transition: 'all 0.3s' }}>
            <Statistic
              title="Classes Taught"
              value={teachers.reduce((sum, t) => sum + (t.classes?.length || 0), 0)}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#8b5cf6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable style={{ borderRadius: 12, transition: 'all 0.3s' }}>
            <Statistic
              title="Avg Salary"
              value={Math.round(teachers.reduce((sum, t) => sum + (t.salary || 0), 0) / (teachers.length || 1))}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#f59e0b' }}
              suffix="RM"
            />
          </Card>
        </Col>
      </Row>

      {/* Teachers List with Tabs */}
      <Card style={{ borderRadius: 12 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'ALL',
              label: (
                <Badge count={tabCounts.ALL} showZero color="#6366f1">
                  <span style={{ marginRight: 8 }}>All</span>
                </Badge>
              ),
            },
            {
              key: 'ACTIVE',
              label: (
                <Badge count={tabCounts.ACTIVE} showZero color="#10b981">
                  <span style={{ marginRight: 8 }}>Active</span>
                </Badge>
              ),
            },
            {
              key: 'ON_LEAVE',
              label: (
                <Badge count={tabCounts.ON_LEAVE} showZero color="#f59e0b">
                  <span style={{ marginRight: 8 }}>On Leave</span>
                </Badge>
              ),
            },
            {
              key: 'INACTIVE',
              label: (
                <Badge count={tabCounts.INACTIVE} showZero color="#6b7280">
                  <span style={{ marginRight: 8 }}>Inactive</span>
                </Badge>
              ),
            },
          ]}
        />

        {filteredTeachers.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>
                {searchTerm || specializationFilter
                  ? "No teachers found. Try adjusting your filters."
                  : "Get started by adding your first teacher"}
              </span>
            }
          />
        ) : (
          <List
            dataSource={filteredTeachers}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} teachers`,
            }}
            renderItem={(teacher) => (
              <List.Item
                key={teacher.id}
                style={{
                  borderRadius: 8,
                  marginBottom: 8,
                  padding: 16,
                  background: '#fafafa',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f0f0';
                  e.currentTarget.style.transform = 'scale(1.01)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fafafa';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                actions={[
                  <Popover
                    key="actions"
                    content={
                      <Space direction="vertical">
                        <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewTeacher(teacher)} block>
                          View Details
                        </Button>
                        <Button type="text" icon={<EditOutlined />} onClick={() => handleEditClick(teacher)} block>
                          Edit
                        </Button>
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteTeacher(teacher)} block>
                          Delete
                        </Button>
                      </Space>
                    }
                    trigger="click"
                  >
                    <Tooltip title="Actions">
                      <Button type="text" icon={<MoreOutlined />} />
                    </Tooltip>
                  </Popover>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={64}
                      style={{
                        background: getAvatarGradient(teacher.firstName),
                        fontSize: 24,
                        fontWeight: 'bold'
                      }}
                    >
                      {getInitials(teacher.firstName, teacher.lastName)}
                    </Avatar>
                  }
                  title={
                    <Space>
                      <Text strong style={{ fontSize: 16 }}>
                        {teacher.firstName} {teacher.lastName}
                      </Text>
                      <Tag color={getStatusColor(teacher.status)}>
                        {teacher.status.replace('_', ' ')}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">
                        <UserOutlined /> ID: {teacher.employeeId} | {teacher.email}
                      </Text>
                      <Text type="secondary">
                        <BookOutlined /> {teacher.qualification} - {teacher.specialization}
                      </Text>
                      <Space size="large">
                        <Tooltip title="Performance">
                          <Progress
                            type="circle"
                            percent={85}
                            size={40}
                            format={(percent) => `${percent}%`}
                          />
                        </Tooltip>
                        <div>
                          <Text strong>{teacher.classes?.length || 0}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>Classes</Text>
                        </div>
                        <div>
                          <Text strong>{teacher.classes?.reduce((sum, c) => sum + (c._count?.students || 0), 0) || 0}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>Students</Text>
                        </div>
                        <div>
                          <Text strong>RM {(teacher.salary || 0).toLocaleString()}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>Salary</Text>
                        </div>
                      </Space>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Add Teacher Form */}
      <TeacherForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTeacher}
        isLoading={isSubmitting}
        mode="create"
      />

      {/* Edit Teacher Form */}
      <TeacherForm
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTeacher(null);
        }}
        onSubmit={handleEditTeacher}
        isLoading={isSubmitting}
        teacher={selectedTeacher}
        mode="edit"
      />

      {/* View Teacher Drawer */}
      <Drawer
        title={
          selectedTeacher && (
            <Space>
              <Avatar
                size={48}
                style={{
                  background: getAvatarGradient(selectedTeacher.firstName),
                  fontSize: 20,
                  fontWeight: 'bold'
                }}
              >
                {getInitials(selectedTeacher.firstName, selectedTeacher.lastName)}
              </Avatar>
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {selectedTeacher.firstName} {selectedTeacher.lastName}
                </Title>
                <Text type="secondary">{selectedTeacher.employeeId}</Text>
              </div>
            </Space>
          )
        }
        placement="right"
        width={720}
        open={showViewDrawer}
        onClose={() => {
          setShowViewDrawer(false);
          setSelectedTeacher(null);
        }}
        extra={
          <Space>
            <Button icon={<EditOutlined />} onClick={() => {
              setShowViewDrawer(false);
              handleEditClick(selectedTeacher!);
            }}>
              Edit
            </Button>
          </Space>
        }
      >
        {selectedTeacher && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Personal Information */}
            <Card title="Personal Information" variant="borderless" style={{ borderRadius: 12 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary">Employee ID</Text>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{selectedTeacher.employeeId}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Status</Text>
                  <div>
                    <Tag color={getStatusColor(selectedTeacher.status)} style={{ fontSize: 14 }}>
                      {selectedTeacher.status === 'ACTIVE' && <CheckCircleOutlined />}
                      {selectedTeacher.status === 'ON_LEAVE' && <ClockCircleOutlined />}
                      {' '}{selectedTeacher.status.replace('_', ' ')}
                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Email</Text>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{selectedTeacher.email}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Phone</Text>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{selectedTeacher.phone}</div>
                </Col>
              </Row>
            </Card>

            {/* Employment Information */}
            <Card title="Employment Information" variant="borderless" style={{ borderRadius: 12 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary">Qualification</Text>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{selectedTeacher.qualification}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Specialization</Text>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{selectedTeacher.specialization}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Monthly Salary</Text>
                  <div style={{ fontSize: 16, fontWeight: 500, color: '#10b981' }}>
                    RM {(selectedTeacher.salary || 0).toLocaleString()}
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Performance Metrics */}
            <Card title="Performance Metrics" variant="borderless" style={{ borderRadius: 12 }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title="Classes Taught"
                    value={selectedTeacher.classes?.length || 0}
                    prefix={<BookOutlined />}
                  />
                  <Progress
                    percent={(selectedTeacher.classes?.length || 0) * 20}
                    strokeColor="#6366f1"
                    showInfo={false}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Total Students"
                    value={selectedTeacher.classes?.reduce((sum, c) => sum + (c._count?.students || 0), 0) || 0}
                    prefix={<TeamOutlined />}
                  />
                  <Progress
                    percent={Math.min((selectedTeacher.classes?.reduce((sum, c) => sum + (c._count?.students || 0), 0) || 0) * 5, 100)}
                    strokeColor="#10b981"
                    showInfo={false}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Performance"
                    value={85}
                    suffix="%"
                    prefix={<TrophyOutlined />}
                  />
                  <Progress
                    percent={85}
                    strokeColor="#f59e0b"
                    showInfo={false}
                  />
                </Col>
              </Row>
            </Card>

            {/* Employment History Timeline */}
            <Card title="Employment History" variant="borderless" style={{ borderRadius: 12 }}>
              <Timeline
                items={[
                  {
                    color: 'green',
                    children: (
                      <>
                        <Text strong>Joined as {selectedTeacher.qualification}</Text>
                        <br />
                        <Text type="secondary">January 2024</Text>
                      </>
                    ),
                  },
                  {
                    color: 'blue',
                    children: (
                      <>
                        <Text strong>Promoted to Senior Teacher</Text>
                        <br />
                        <Text type="secondary">June 2024</Text>
                      </>
                    ),
                  },
                  {
                    color: 'gray',
                    children: (
                      <>
                        <Text strong>Current Position</Text>
                        <br />
                        <Text type="secondary">Present</Text>
                      </>
                    ),
                  },
                ]}
              />
            </Card>

            {/* Classes Assigned */}
            {selectedTeacher.classes && selectedTeacher.classes.length > 0 && (
              <Card title="Assigned Classes" variant="borderless" style={{ borderRadius: 12 }}>
                <List
                  dataSource={selectedTeacher.classes}
                  renderItem={(classItem) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<BookOutlined />} style={{ background: '#6366f1' }} />}
                        title={classItem.name}
                        description={`${classItem.level} - ${classItem._count?.students || 0} students`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}
          </Space>
        )}
      </Drawer>
    </div>
  );
}