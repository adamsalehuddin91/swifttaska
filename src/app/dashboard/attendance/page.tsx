'use client';

import { Scanner } from '@yudiel/react-qr-scanner';
import { QRCodeSVG } from 'qrcode.react';

import { useState, useEffect } from 'react';
import { App, Card, Modal,
  Button,
  Row,
  Col,
  Statistic,
  Calendar,
  Badge,
  DatePicker,
  Tag,
  Space,
  Typography,
  Result,
  FloatButton,
  Drawer,
  Timeline,
  Transfer,
  Segmented,
  Table,
  Skeleton,
  Empty,
  Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  BarsOutlined,
  HeatMapOutlined,
  CheckOutlined,
  EyeOutlined,
  ScanOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { CheckableTag } = Tag;

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  class: {
    id: string;
    name: string;
    level: string;
  };
}

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  notes?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;
  };
  class: {
    id: string;
    name: string;
    level: string;
  };
}

export default function AttendancePage() {
  const { message } = App.useApp();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'table' | 'heatmap'>('calendar');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [showSuccessResult, setShowSuccessResult] = useState(false);
  const [markedCount, setMarkedCount] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [transferTargetKeys, setTransferTargetKeys] = useState<string[]>([]);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchAttendance();
  }, [selectedDate]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const params = new URLSearchParams();
      params.append('date', selectedDate);

      const response = await fetch(`/api/attendance?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAttendance(data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (studentId: string, status: string) => {
    try {
      const student = students.find(s => s.id === studentId);
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          date: selectedDate,
          status,
          classId: student?.class.id
        }),
      });

      if (response.ok) {
        await fetchAttendance();
        message.success(`Marked ${status.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      message.error('Failed to mark attendance');
    }
  };

  const handleScan = async (result: any) => {
    if (result && result.length > 0) {
      const rawValue = result[0].rawValue;
      try {
        const data = JSON.parse(rawValue);
        if (data.studentId) {
          const res = await fetch('/api/attendance/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId: data.studentId })
          });
          const apiData = await res.json();
          if (res.ok) {
            message.success(apiData.message);
            setShowScanner(false);
            fetchAttendance();
          } else {
            message.error(apiData.error);
          }
        }
      } catch (e) {
        // Ignored or show simple generic error
      }
    }
  };

  const markAllPresent = async () => {
    setShowTransfer(true);
    // Initialize all students as present
    setTransferTargetKeys(students.map(s => s.id));
  };

  const handleBulkSubmit = async () => {
    try {
      let successCount = 0;
      for (const studentId of transferTargetKeys) {
        const student = students.find(s => s.id === studentId);
        const response = await fetch('/api/attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentId,
            date: selectedDate,
            status: 'PRESENT',
            classId: student?.class.id
          }),
        });
        if (response.ok) successCount++;
      }

      setMarkedCount(successCount);
      setShowSuccessResult(true);
      setShowTransfer(false);
      await fetchAttendance();

      setTimeout(() => setShowSuccessResult(false), 3000);
    } catch (error) {
      console.error('Error bulk marking attendance:', error);
      message.error('Failed to bulk mark attendance');
    }
  };

  const getAttendanceStatus = (studentId: string) => {
    const record = attendance.find(a => a.student.id === studentId && a.date.split('T')[0] === selectedDate);
    return record?.status || null;
  };

  const getAttendanceForDate = (date: Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD');
    const dayRecords = attendance.filter(a => a.date.split('T')[0] === dateStr);
    const presentCount = dayRecords.filter(a => a.status === 'PRESENT').length;
    const total = students.length || 1;
    return Math.round((presentCount / total) * 100);
  };

  const getStudentAttendanceHistory = (studentId: string) => {
    return attendance.filter(a => a.student.id === studentId).slice(0, 10);
  };

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    setStatusFilters(prev =>
      checked ? [...prev, status] : prev.filter(s => s !== status)
    );
  };

  const filteredStudents = students.filter(student => {
    if (statusFilters.length === 0) return true;
    const status = getAttendanceStatus(student.id);
    return status && statusFilters.includes(status);
  });

  const todayStats = {
    present: attendance.filter(a => a.status === 'PRESENT' && a.date.split('T')[0] === selectedDate).length,
    absent: attendance.filter(a => a.status === 'ABSENT' && a.date.split('T')[0] === selectedDate).length,
    late: attendance.filter(a => a.status === 'LATE' && a.date.split('T')[0] === selectedDate).length,
    excused: attendance.filter(a => a.status === 'EXCUSED' && a.date.split('T')[0] === selectedDate).length,
  };

  const getMonthlyAverage = () => {
    const thisMonth = dayjs().format('YYYY-MM');
    const monthRecords = attendance.filter(a => a.date.startsWith(thisMonth));
    const presentCount = monthRecords.filter(a => a.status === 'PRESENT').length;
    return monthRecords.length > 0 ? Math.round((presentCount / monthRecords.length) * 100) : 0;
  };

  const transferDataSource = students.map(student => ({
    key: student.id,
    title: `${student.firstName} ${student.lastName} (${student.studentId})`,
    description: `${student.class.name} - ${student.class.level}`,
  }));

  const tableColumns = [
    {
      title: 'Student',
      dataIndex: 'firstName',
      key: 'name',
      render: (_: any, record: Student) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.firstName} {record.lastName}
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>ID: {record.studentId}</Text>
        </div>
      ),
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
      render: (classData: Student['class']) => (
        <div>
          <div>{classData.name}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{classData.level}</Text>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      align: 'center' as const,
      render: (_: any, record: Student) => {
        const status = getAttendanceStatus(record.id);
        return status ? (
          <Tag
            color={
              status === 'PRESENT' ? 'success' :
              status === 'ABSENT' ? 'error' :
              status === 'LATE' ? 'warning' : 'processing'
            }
          >
            {status}
          </Tag>
        ) : (
          <Tag>Not Marked</Tag>
        );
      },
    },
    {
      title: 'Mark Attendance',
      key: 'actions',
      align: 'center' as const,
      render: (_: any, record: Student) => {
        const status = getAttendanceStatus(record.id);
        return (
          <Space>
            <Tooltip title="Present">
              <Button
                type={status === 'PRESENT' ? 'primary' : 'default'}
                icon={<CheckCircleOutlined />}
                onClick={() => markAttendance(record.id, 'PRESENT')}
                size="small"
                style={{
                  backgroundColor: status === 'PRESENT' ? '#10b981' : undefined,
                  borderColor: status === 'PRESENT' ? '#10b981' : undefined,
                }}
              />
            </Tooltip>
            <Tooltip title="Absent">
              <Button
                type={status === 'ABSENT' ? 'primary' : 'default'}
                icon={<CloseCircleOutlined />}
                onClick={() => markAttendance(record.id, 'ABSENT')}
                size="small"
                danger={status === 'ABSENT'}
              />
            </Tooltip>
            <Tooltip title="Late">
              <Button
                type={status === 'LATE' ? 'primary' : 'default'}
                icon={<ClockCircleOutlined />}
                onClick={() => markAttendance(record.id, 'LATE')}
                size="small"
                style={{
                  backgroundColor: status === 'LATE' ? '#f59e0b' : undefined,
                  borderColor: status === 'LATE' ? '#f59e0b' : undefined,
                }}
              />
            </Tooltip>
            <Tooltip title="Excused">
              <Button
                type={status === 'EXCUSED' ? 'primary' : 'default'}
                icon={<ExclamationCircleOutlined />}
                onClick={() => markAttendance(record.id, 'EXCUSED')}
                size="small"
                style={{
                  backgroundColor: status === 'EXCUSED' ? '#3b82f6' : undefined,
                  borderColor: status === 'EXCUSED' ? '#3b82f6' : undefined,
                }}
              />
            </Tooltip>
            <Tooltip title="View History">
              <Button
                icon={<EyeOutlined />}
                onClick={() => {
                  setSelectedStudent(record);
                  setDrawerVisible(true);
                }}
                size="small"
              />
            </Tooltip>
            <Tooltip title="Show QR Code">
              <Button
                icon={<QrcodeOutlined />}
                onClick={() => {
                  setSelectedStudent(record);
                  setShowQRModal(true);
                }}
                size="small"
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 24, background: 'var(--bg-gradient)', minHeight: '100vh' }}>
        <Skeleton active paragraph={{ rows: 2 }} style={{ marginBottom: 24 }} />
        <Row gutter={[16, 16]}>
          {[1, 2, 3, 4].map(i => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Card>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  if (showSuccessResult) {
    return (
      <div style={{ padding: 24, background: 'var(--bg-gradient)', minHeight: '100vh' }}>
        <Result
          status="success"
          title="Attendance Marked Successfully!"
          subTitle={`${markedCount} students marked present for ${dayjs(selectedDate).format('MMMM D, YYYY')}`}
          extra={[
            <Button type="primary" key="close" onClick={() => setShowSuccessResult(false)}>
              Continue
            </Button>,
          ]}
        />
      </div>
    );
  }

  if (showTransfer) {
    return (
      <div style={{ padding: 24, background: 'var(--bg-gradient)', minHeight: '100vh' }}>
        <Card style={{ borderRadius: 16, maxWidth: 1200, margin: '0 auto' }}>
          <Title level={3}>Bulk Mark Attendance</Title>
          <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
            Select students who are present today. Students on the right will be marked as present.
          </Text>
          <Transfer
            dataSource={transferDataSource}
            targetKeys={transferTargetKeys}
            onChange={(newTargetKeys) => setTransferTargetKeys(newTargetKeys as string[])}
            render={item => item.title}
            listStyle={{
              width: 350,
              height: 500,
            }}
            titles={['All Students', 'Present Today']}
            showSearch
            filterOption={(inputValue, item) =>
              item.title!.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
            }
          />
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setShowTransfer(false)}>Cancel</Button>
              <Button type="primary" icon={<CheckOutlined />} onClick={handleBulkSubmit}>
                Submit Attendance ({transferTargetKeys.length} students)
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: 'var(--bg-gradient)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Attendance Management
        </Title>
        <Text style={{ color: '#8c8c8c', fontSize: 16 }}>Track and manage student attendance</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              background: 'var(--success-gradient)',
              border: 'none',
            }}
            styles={{ body: {} }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>Present</span>}
              value={todayStats.present}
              prefix={<CheckCircleOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              background: 'var(--danger-gradient)',
              border: 'none',
            }}
            styles={{ body: {} }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>Absent</span>}
              value={todayStats.absent}
              prefix={<CloseCircleOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              background: 'var(--warning-gradient)',
              border: 'none',
            }}
            styles={{ body: {} }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>Late</span>}
              value={todayStats.late}
              prefix={<ClockCircleOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontWeight: 700 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              background: 'var(--info-gradient)',
              border: 'none',
            }}
            styles={{ body: {} }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>Monthly Avg</span>}
              value={getMonthlyAverage()}
              prefix={<CalendarOutlined style={{ color: 'white' }} />}
              suffix="%"
              valueStyle={{ color: 'white', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Controls Card */}
      <Card style={{ marginBottom: 24, borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <div>
              <Text strong style={{ marginBottom: 8, display: 'block' }}>Select Date:</Text>
              <DatePicker
                value={dayjs(selectedDate)}
                onChange={(date) => setSelectedDate(date ? date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'))}
                style={{ width: '100%', borderRadius: 8 }}
                size="large"
              />
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div>
              <Text strong style={{ marginBottom: 8, display: 'block' }}>Date Range (optional):</Text>
              <RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs] | null)}
                style={{ width: '100%', borderRadius: 8 }}
                size="large"
              />
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div>
              <Text strong style={{ marginBottom: 8, display: 'block' }}>View Mode:</Text>
              <Segmented
                value={viewMode}
                onChange={(value) => setViewMode(value as 'calendar' | 'table' | 'heatmap')}
                options={[
                  { label: 'Calendar', value: 'calendar', icon: <CalendarOutlined /> },
                  { label: 'Table', value: 'table', icon: <BarsOutlined /> },
                  { label: 'Heatmap', value: 'heatmap', icon: <HeatMapOutlined /> },
                ]}
                block
                size="large"
              />
            </div>
          </Col>
        </Row>

        <div style={{ marginTop: 16 }}>
          <Text strong style={{ marginRight: 12 }}>Filter by Status:</Text>
          <Space wrap>
            {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map(status => (
              <CheckableTag
                key={status}
                checked={statusFilters.includes(status)}
                onChange={(checked) => handleStatusFilterChange(status, checked)}
                style={{
                  borderRadius: 8,
                  padding: '4px 12px',
                  fontSize: 14,
                  border: statusFilters.includes(status) ? '1px solid #6366f1' : '1px solid #d9d9d9',
                  backgroundColor: statusFilters.includes(status) ? '#6366f1' : 'transparent',
                  color: statusFilters.includes(status) ? 'white' : '#595959',
                }}
              >
                {status}
              </CheckableTag>
            ))}
          </Space>
        </div>
      </Card>

      {/* View Content */}
      {viewMode === 'calendar' ? (
        <Card style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <Calendar
            fullscreen={false}
            cellRender={(date, info) => {
              if (info.type !== 'date') return info.originNode;
              const attendanceRate = getAttendanceForDate(date);
              return (
                <div style={{ textAlign: 'center' }}>
                  <Badge
                    status={attendanceRate > 90 ? 'success' : attendanceRate > 75 ? 'warning' : 'error'}
                    text={<Text style={{ fontSize: 11 }}>{attendanceRate}%</Text>}
                  />
                </div>
              );
            }}
            onSelect={(date) => setSelectedDate(date.format('YYYY-MM-DD'))}
          />
        </Card>
      ) : viewMode === 'table' ? (
        <Card style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          {filteredStudents.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No students found"
            />
          ) : (
            <Table
              dataSource={filteredStudents}
              columns={tableColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          )}
        </Card>
      ) : (
        <Card style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <Title level={4}>Monthly Attendance Heatmap</Title>
          <div style={{ padding: 24, textAlign: 'center' }}>
            <Calendar
              fullscreen={false}
              cellRender={(date, info) => {
                if (info.type !== 'date') return info.originNode;
                const attendanceRate = getAttendanceForDate(date);
                const color =
                  attendanceRate > 90 ? '#10b981' :
                  attendanceRate > 75 ? '#f59e0b' :
                  attendanceRate > 50 ? '#f97316' : '#ef4444';

                return (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: color,
                      opacity: attendanceRate / 100,
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                      {attendanceRate}%
                    </Text>
                  </div>
                );
              }}
            />
            <div style={{ marginTop: 24 }}>
              <Space>
                <Badge color="#10b981" text="90-100%" />
                <Badge color="#f59e0b" text="75-90%" />
                <Badge color="#f97316" text="50-75%" />
                <Badge color="#ef4444" text="<50%" />
              </Space>
            </div>
          </div>
        </Card>
      )}

      {/* FloatButton for Quick Actions */}
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24, bottom: 24 }}
        icon={<BarsOutlined />}
      >
        <FloatButton
          icon={<ScanOutlined />}
          tooltip="Scan QR Code"
          onClick={() => setShowScanner(true)}
        />
        <FloatButton
          icon={<CheckCircleOutlined />}
          tooltip="Mark All Present"
          onClick={markAllPresent}
        />
      </FloatButton.Group>

      {/* Student History Drawer */}
      <Drawer
        title="Student Attendance History"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        {selectedStudent && (
          <>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Statistic
                title="Student Name"
                value={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                prefix={<UserOutlined />}
              />
              <Text type="secondary">ID: {selectedStudent.studentId}</Text>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Class: {selectedStudent.class.name}</Text>
              </div>
            </Card>

            <Title level={5}>Recent Attendance</Title>
            <Timeline
              items={getStudentAttendanceHistory(selectedStudent.id).map(record => ({
                color:
                  record.status === 'PRESENT' ? 'green' :
                  record.status === 'ABSENT' ? 'red' :
                  record.status === 'LATE' ? 'orange' : 'blue',
                children: (
                  <div>
                    <div>
                      <Text strong>{dayjs(record.date).format('MMM D, YYYY')}</Text>
                    </div>
                    <Tag
                      color={
                        record.status === 'PRESENT' ? 'success' :
                        record.status === 'ABSENT' ? 'error' :
                        record.status === 'LATE' ? 'warning' : 'processing'
                      }
                    >
                      {record.status}
                    </Tag>
                    {record.notes && (
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>{record.notes}</Text>
                      </div>
                    )}
                  </div>
                ),
              }))}
            />
          </>
        )}
      </Drawer>

      {/* QR Scanner Modal */}
      <Modal
        title="Scan Student QR Code"
        open={showScanner}
        onCancel={() => setShowScanner(false)}
        footer={null}
        destroyOnHidden
      >
        <div style={{ borderRadius: 12, overflow: 'hidden' }}>
          <Scanner onScan={handleScan} />
        </div>
        <Typography.Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>
          Point the camera at the student's unique generated QR code to clock them in.
        </Typography.Text>
      </Modal>

      {/* Test QR Generator Modal */}
      <Modal
        title="Student QR Pass"
        open={showQRModal}
        onCancel={() => setShowQRModal(false)}
        footer={null}
      >
        {selectedStudent && (
          <div style={{ textAlign: 'center', padding: 24 }}>
             <QRCodeSVG value={JSON.stringify({ studentId: selectedStudent.id })} size={256} />
             <Typography.Title level={4} style={{ marginTop: 16 }}>
               {selectedStudent.firstName} {selectedStudent.lastName}
             </Typography.Title>
             <Typography.Text type="secondary">ID: {selectedStudent.studentId}</Typography.Text>
          </div>
        )}
      </Modal>
    </div>
  );
}
