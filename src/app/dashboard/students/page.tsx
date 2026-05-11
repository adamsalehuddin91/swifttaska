'use client';

import { useState, useEffect } from 'react';
import { App, Table,
  Button,
  Input,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Modal,
  Space,
  Tag,
  Spin,
  Tooltip,
  Tabs,
  Drawer,
  Descriptions,
  Avatar,
  Steps,
  Rate,
  Badge,
  Dropdown,
  Progress,
  Alert,
  Typography } from 'antd';

const { Text } = Typography;
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  DollarOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MoreOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import StudentForm from '@/components/forms/StudentForm';
import { useToast } from '@/components/ui/Toast';

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  class?: {
    name: string;
    level: string;
    teacher?: {
      firstName: string;
      lastName: string;
    };
  };
  fees?: Array<{
    status: string;
    amount: number;
  }>;
  attendances?: Array<{
    date: string;
    status: string;
  }>;
}

export default function StudentsPage() {
  const { message } = App.useApp();
  const toast = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewDrawer, setShowViewDrawer] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (studentData: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (response.ok) {
        await fetchStudents();
        setShowAddModal(false);
        message.success('Student added successfully!');
      } else {
        const error = await response.text();
        message.error(`Error adding student: ${error}`);
      }
    } catch (error) {
      console.error('Error adding student:', error);
      message.error('Error adding student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStudent = async (studentData: any) => {
    if (!selectedStudent) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/students/${selectedStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (response.ok) {
        await fetchStudents();
        setShowEditModal(false);
        setSelectedStudent(null);
        message.success('Student updated successfully!');
      } else {
        const error = await response.text();
        message.error(`Error updating student: ${error}`);
      }
    } catch (error) {
      console.error('Error updating student:', error);
      message.error('Error updating student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = (student: Student) => {
    Modal.confirm({
      title: 'Delete Student',
      content: `Are you sure you want to delete ${student.firstName} ${student.lastName}?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await fetch(`/api/students/${student.id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            await fetchStudents();
            message.success('Student deleted successfully!');
          } else {
            const error = await response.text();
            message.error(`Error deleting student: ${error}`);
          }
        } catch (error) {
          console.error('Error deleting student:', error);
          message.error('Error deleting student. Please try again.');
        }
      },
    });
  };

  const getAttendanceRate = (attendances: Array<{ status: string }> = []) => {
    if (attendances.length === 0) return 0;
    const presentCount = attendances.filter(a => a.status === 'PRESENT').length;
    return Math.round((presentCount / attendances.length) * 100);
  };

  const getPendingFees = (fees: Array<{ status: string; amount: number }> = []) => {
    return fees.filter(f => f.status === 'PENDING').reduce((sum, f) => sum + f.amount, 0);
  };

  const exportToCSV = () => {
    const headers = ['Student ID', 'First Name', 'Last Name', 'Date of Birth', 'Gender', 'Nationality', 'Class', 'Attendance Rate', 'Pending Fees'];

    const csvData = filteredData.map(student => {
      return [
        student.studentId,
        student.firstName,
        student.lastName,
        new Date(student.dateOfBirth).toLocaleDateString(),
        student.gender,
        student.nationality,
        student.class?.name || 'Not Assigned',
        `${getAttendanceRate(student.attendances)}%`,
        `RM ${getPendingFees(student.fees).toFixed(2)}`
      ];
    });

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `students-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    message.success('Students data exported successfully!');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getEnrollmentStep = (student: Student) => {
    // Determine enrollment progress
    if (!student.class) return 0;
    if (getPendingFees(student.fees) > 0) return 1;
    if (getAttendanceRate(student.attendances) === 0) return 2;
    return 3;
  };

  const getPerformanceRating = (attendanceRate: number) => {
    if (attendanceRate >= 95) return 5;
    if (attendanceRate >= 85) return 4;
    if (attendanceRate >= 75) return 3;
    if (attendanceRate >= 60) return 2;
    return 1;
  };

  const uniqueClasses = [...new Set(students.map(s => s.class?.name).filter(Boolean))];

  const filteredDataByTab = students.filter(student => {
    // Filter by tab
    if (activeTab === 'active') {
      const attendanceRate = getAttendanceRate(student.attendances);
      return attendanceRate >= 75;
    }
    if (activeTab === 'inactive') {
      const attendanceRate = getAttendanceRate(student.attendances);
      return attendanceRate < 75;
    }
    return true; // 'all' tab
  });

  const filteredData = filteredDataByTab.filter(student => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = !selectedClass || student.class?.name === selectedClass;

    return matchesSearch && matchesClass;
  });

  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'csv',
      icon: <FileExcelOutlined />,
      label: 'Export as CSV',
      onClick: exportToCSV,
    },
    {
      key: 'pdf',
      icon: <FilePdfOutlined />,
      label: 'Export as PDF',
      onClick: () => message.info('PDF export coming soon!'),
    },
  ];

  const columns: ColumnsType<Student> = [
    {
      title: 'Student',
      key: 'student',
      render: (_, record) => (
        <Space>
          <Avatar
            size={48}
            style={{
              background: 'var(--primary-gradient)',
              fontWeight: 600
            }}
          >
            {getInitials(record.firstName, record.lastName)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.firstName} {record.lastName}</div>
            <Tooltip title="Student ID">
              <div style={{ fontSize: 12, color: '#8c8c8c' }}>ID: {record.studentId}</div>
            </Tooltip>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Class',
      key: 'class',
      render: (_, record) => (
        <div>
          <div>{record.class?.name || 'Not Assigned'}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
            {record.class?.level}
            {record.class?.teacher && (
              <span> • {record.class.teacher.firstName} {record.class.teacher.lastName}</span>
            )}
          </div>
        </div>
      ),
      filters: uniqueClasses.map(className => ({ text: className as string, value: className as string })),
      onFilter: (value, record) => record.class?.name === value,
    },
    {
      title: 'Age',
      key: 'age',
      render: (_, record) => {
        const age = Math.floor((new Date().getTime() - new Date(record.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        return (
          <div>
            <div>{age} years</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.gender}</div>
          </div>
        );
      },
      sorter: (a, b) => new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime(),
    },
    {
      title: 'Attendance',
      key: 'attendance',
      render: (_, record) => {
        const rate = getAttendanceRate(record.attendances);
        const color = rate >= 90 ? 'success' : rate >= 75 ? 'warning' : 'error';
        return (
          <Space direction="vertical" size={4}>
            <Progress
              percent={rate}
              size="small"
              status={rate >= 75 ? 'success' : 'exception'}
              strokeColor={rate >= 90 ? '#10b981' : rate >= 75 ? '#f59e0b' : '#ef4444'}
            />
            <Rate
              disabled
              count={5}
              value={getPerformanceRating(rate)}
              style={{ fontSize: 14 }}
            />
          </Space>
        );
      },
      sorter: (a, b) => getAttendanceRate(a.attendances) - getAttendanceRate(b.attendances),
    },
    {
      title: 'Pending Fees',
      key: 'fees',
      render: (_, record) => {
        const pending = getPendingFees(record.fees);
        return (
          <span style={{ color: pending > 0 ? '#ff4d4f' : 'inherit', fontWeight: pending > 0 ? 500 : 'normal' }}>
            RM {pending.toFixed(2)}
          </span>
        );
      },
      sorter: (a, b) => getPendingFees(a.fees) - getPendingFees(b.fees),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedStudent(record);
                setShowViewDrawer(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedStudent(record);
                setShowEditModal(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteStudent(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const stats = {
    total: students.length,
    activeClasses: uniqueClasses.length,
    pendingFees: students.reduce((sum, s) => sum + getPendingFees(s.fees), 0),
    avgAttendance: Math.round(students.reduce((sum, s) => sum + getAttendanceRate(s.attendances), 0) / students.length || 0),
  };

  const tabItems = [
    {
      key: 'all',
      label: (
        <span>
          <UserOutlined /> All Students ({students.length})
        </span>
      ),
    },
    {
      key: 'active',
      label: (
        <Badge count={students.filter(s => getAttendanceRate(s.attendances) >= 75).length} offset={[10, 0]}>
          <span>
            <CheckCircleOutlined /> Active
          </span>
        </Badge>
      ),
    },
    {
      key: 'inactive',
      label: (
        <Badge count={students.filter(s => getAttendanceRate(s.attendances) < 75).length} offset={[10, 0]}>
          <span>
            <ClockCircleOutlined /> Need Attention
          </span>
        </Badge>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Student Management</h1>
        <p style={{ color: '#8c8c8c', margin: 0 }}>Manage student profiles and information</p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={stats.total}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Classes"
              value={stats.activeClasses}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Fees"
              value={stats.pendingFees}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Attendance"
              value={stats.avgAttendance}
              suffix="%"
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs for filtering */}
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          tabBarExtraContent={{
            right: (
              <Space>
                <Dropdown menu={{ items: exportMenuItems }}>
                  <Button icon={<DownloadOutlined />}>
                    Export <MoreOutlined />
                  </Button>
                </Dropdown>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setShowAddModal(true)}
                  style={{ borderRadius: 8 }}
                >
                  Add Student
                </Button>
              </Space>
            ),
          }}
        />

        {/* Search and Filters */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col flex="auto">
            <Input
              placeholder="Search students by name or ID..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col>
            <Select
              placeholder="All Classes"
              style={{ width: 200 }}
              size="large"
              value={selectedClass}
              onChange={setSelectedClass}
              allowClear
            >
              {uniqueClasses.map(className => (
                <Select.Option key={className} value={className}>{className}</Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Students Table */}
      <Card style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} students`,
            showSizeChanger: true,
          }}
          locale={{
            emptyText: (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <UserOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                <h3 style={{ marginTop: 16, color: '#262626' }}>No students found</h3>
                <p style={{ color: '#8c8c8c' }}>
                  {searchTerm || selectedClass
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first student"
                  }
                </p>
              </div>
            ),
          }}
        />
      </Card>

      {/* Add Student Form */}
      <StudentForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddStudent}
        isLoading={isSubmitting}
        mode="create"
      />

      {/* Edit Student Form */}
      <StudentForm
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStudent(null);
        }}
        onSubmit={handleEditStudent}
        isLoading={isSubmitting}
        student={selectedStudent}
        mode="edit"
      />

      {/* View Student Drawer with Enhanced Components */}
      <Drawer
        title={
          selectedStudent && (
            <Space>
              <Avatar
                size={64}
                style={{
                  background: 'var(--primary-gradient)',
                  fontWeight: 600,
                  fontSize: 24
                }}
              >
                {selectedStudent && getInitials(selectedStudent.firstName, selectedStudent.lastName)}
              </Avatar>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </div>
                <div style={{ fontSize: 14, color: '#8c8c8c' }}>
                  ID: {selectedStudent.studentId}
                </div>
              </div>
            </Space>
          )
        }
        placement="right"
        width={720}
        open={showViewDrawer}
        onClose={() => {
          setShowViewDrawer(false);
          setSelectedStudent(null);
        }}
        extra={
          selectedStudent && (
            <Space>
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  setShowViewDrawer(false);
                  setShowEditModal(true);
                }}
              >
                Edit
              </Button>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setShowViewDrawer(false);
                  handleDeleteStudent(selectedStudent);
                }}
              >
                Delete
              </Button>
            </Space>
          )
        }
      >
        {selectedStudent && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Enrollment Progress Steps */}
            <Card title="Enrollment Progress" variant="borderless">
              <Steps
                current={getEnrollmentStep(selectedStudent)}
                items={[
                  {
                    title: 'Registration',
                    description: 'Student registered',
                    icon: <UserOutlined />,
                  },
                  {
                    title: 'Class Assignment',
                    description: selectedStudent.class?.name || 'Pending',
                    icon: <BookOutlined />,
                  },
                  {
                    title: 'Fee Payment',
                    description: `RM ${getPendingFees(selectedStudent.fees).toFixed(2)} pending`,
                    icon: <DollarOutlined />,
                  },
                  {
                    title: 'Active',
                    description: 'Attending classes',
                    icon: <CheckCircleOutlined />,
                  },
                ]}
              />
            </Card>

            {/* Personal Information with Descriptions */}
            <Card title="Personal Information" variant="borderless">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Student ID">
                  <Tag color="blue">{selectedStudent.studentId}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Full Name">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                  {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label="Gender">
                  {selectedStudent.gender}
                </Descriptions.Item>
                <Descriptions.Item label="Nationality">
                  {selectedStudent.nationality}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Class Information */}
            <Card title="Class Information" variant="borderless">
              {selectedStudent.class ? (
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Class Name">
                    {selectedStudent.class.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Level">
                    {selectedStudent.class.level}
                  </Descriptions.Item>
                  {selectedStudent.class.teacher && (
                    <Descriptions.Item label="Teacher">
                      {selectedStudent.class.teacher.firstName} {selectedStudent.class.teacher.lastName}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              ) : (
                <Alert
                  message="Not Assigned"
                  description="This student has not been assigned to any class yet."
                  type="warning"
                  showIcon
                />
              )}
            </Card>

            {/* Performance Rating */}
            <Card title="Performance Rating" variant="borderless">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>Attendance Performance</Text>
                  <div style={{ marginTop: 8 }}>
                    <Rate
                      disabled
                      value={getPerformanceRating(getAttendanceRate(selectedStudent.attendances))}
                      style={{ fontSize: 24 }}
                    />
                    <Text type="secondary" style={{ marginLeft: 16 }}>
                      {getAttendanceRate(selectedStudent.attendances)}% attendance rate
                    </Text>
                  </div>
                </div>
                <Progress
                  percent={getAttendanceRate(selectedStudent.attendances)}
                  strokeColor={{
                    '0%': '#667eea',
                    '100%': '#764ba2',
                  }}
                  status={getAttendanceRate(selectedStudent.attendances) >= 75 ? 'success' : 'exception'}
                />
              </Space>
            </Card>

            {/* Fee Status */}
            <Card title="Fee Status" variant="borderless">
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Pending Fees">
                  <Text strong style={{ color: getPendingFees(selectedStudent.fees) > 0 ? '#ef4444' : '#10b981' }}>
                    RM {getPendingFees(selectedStudent.fees).toFixed(2)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Payment Status">
                  {getPendingFees(selectedStudent.fees) === 0 ? (
                    <Tag color="success" icon={<CheckCircleOutlined />}>Paid</Tag>
                  ) : (
                    <Tag color="warning" icon={<ClockCircleOutlined />}>Pending</Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        )}
      </Drawer>
    </div>
  );
}
