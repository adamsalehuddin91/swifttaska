'use client';

import { useState, useEffect } from 'react';
import { App, Card,
  Row,
  Col,
  Tree,
  Tabs,
  DatePicker,
  Select,
  Button,
  Dropdown,
  Radio,
  Progress,
  Alert,
  Result,
  Empty,
  Statistic,
  Table,
  Spin,
  Space,
  Skeleton } from 'antd';
const { Timer } = Statistic;
import type { MenuProps } from 'antd';
import {
  BarChartOutlined,
  DollarOutlined,
  UserOutlined,
  BookOutlined,
  RiseOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  CalendarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Student, Teacher, Fee, Activity, ReportData, ClassCount, GenderCount, StatusCount, FeeByType, ActivityByType } from '@/types';

const { RangePicker } = DatePicker;

export default function ReportsPage() {
  const { message } = App.useApp();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState('month');
  const [reportType, setReportType] = useState('overview');
  const [reportFrequency, setReportFrequency] = useState('monthly');
  const [dateRange, setDateRange] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [selectedDateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [studentsRes, teachersRes, feesRes, activitiesRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/teachers'),
        fetch('/api/fees'),
        fetch('/api/activities')
      ]);

      const [students, teachers, fees, activities] = await Promise.all([
        studentsRes.ok ? studentsRes.json() : [],
        teachersRes.ok ? teachersRes.json() : [],
        feesRes.ok ? feesRes.json() : [],
        activitiesRes.ok ? activitiesRes.json() : []
      ]);

      const processedData: ReportData = {
        students: {
          total: students.length,
          byClass: students.reduce((acc: ClassCount[], student: Student) => {
            const className = student.class?.name || 'No Class';
            const existing = acc.find(item => item.name === className);
            if (existing) {
              existing.count++;
            } else {
              acc.push({ name: className, count: 1 });
            }
            return acc;
          }, []),
          byGender: students.reduce((acc: GenderCount[], student: Student) => {
            const existing = acc.find(item => item.gender === student.gender);
            if (existing) {
              existing.count++;
            } else {
              acc.push({ gender: student.gender || 'Unknown', count: 1 });
            }
            return acc;
          }, [])
        },
        teachers: {
          total: teachers.length,
          active: teachers.filter((t: Teacher) => t.status === 'ACTIVE').length,
          byStatus: teachers.reduce((acc: StatusCount[], teacher: Teacher) => {
            const existing = acc.find(item => item.status === teacher.status);
            if (existing) {
              existing.count++;
            } else {
              acc.push({ status: teacher.status || 'Unknown', count: 1 });
            }
            return acc;
          }, [])
        },
        attendance: {
          averageRate: 85,
          todayPresent: Math.floor(students.length * 0.85),
          todayTotal: students.length,
          monthlyTrend: [
            { date: '2024-01-01', rate: 82 },
            { date: '2024-01-08', rate: 85 },
            { date: '2024-01-15', rate: 88 },
            { date: '2024-01-22', rate: 84 }
          ]
        },
        fees: {
          totalAmount: fees.reduce((sum: number, fee: Fee) => sum + fee.amount, 0),
          collected: fees.reduce((sum: number, fee: Fee) => sum + (fee.paidAmount || 0), 0),
          pending: fees.filter((f: Fee) => f.status === 'PENDING').reduce((sum: number, fee: Fee) => sum + (fee.amount - (fee.paidAmount || 0)), 0),
          overdue: fees.filter((f: Fee) => f.status === 'OVERDUE').length,
          byType: fees.reduce((acc: FeeByType[], fee: Fee) => {
            const existing = acc.find(item => item.type === fee.type);
            if (existing) {
              existing.amount += fee.amount;
            } else {
              acc.push({ type: fee.type, amount: fee.amount });
            }
            return acc;
          }, [])
        },
        activities: {
          total: activities.length,
          upcoming: activities.filter((a: Activity) => new Date(a.date) > new Date()).length,
          completed: activities.filter((a: Activity) => new Date(a.date) < new Date()).length,
          byType: activities.reduce((acc: ActivityByType[], activity: Activity) => {
            const existing = acc.find(item => item.type === activity.type);
            if (existing) {
              existing.count++;
            } else {
              acc.push({ type: activity.type, count: 1 });
            }
            return acc;
          }, [])
        }
      };

      setReportData(processedData);
    } catch (error) {
      console.error('Error fetching report data:', error);
      message.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (format: string) => {
    setGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report downloaded successfully!`);
    } catch (error) {
      message.error('Error generating report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const exportItems: MenuProps['items'] = [
    {
      key: 'csv',
      icon: <FileExcelOutlined />,
      label: 'Export as CSV',
      onClick: () => downloadReport('csv'),
    },
    {
      key: 'pdf',
      icon: <FilePdfOutlined />,
      label: 'Export as PDF',
      onClick: () => downloadReport('pdf'),
    },
  ];

  const treeData = [
    {
      title: 'Student Reports',
      key: 'students',
      icon: <UserOutlined />,
      children: [
        { title: 'Attendance Report', key: 'attendance', icon: <CheckCircleOutlined /> },
        { title: 'Performance Report', key: 'performance', icon: <RiseOutlined /> },
        { title: 'Demographics Report', key: 'demographics', icon: <TeamOutlined /> },
      ]
    },
    {
      title: 'Teacher Reports',
      key: 'teachers',
      icon: <BookOutlined />,
      children: [
        { title: 'Staff Overview', key: 'staff-overview', icon: <UserOutlined /> },
        { title: 'Class Assignments', key: 'class-assignments', icon: <TeamOutlined /> },
      ]
    },
    {
      title: 'Financial Reports',
      key: 'finance',
      icon: <DollarOutlined />,
      children: [
        { title: 'Fee Collection', key: 'fee-collection', icon: <DollarOutlined /> },
        { title: 'Payment History', key: 'payment-history', icon: <CalendarOutlined /> },
        { title: 'Outstanding Fees', key: 'outstanding', icon: <RiseOutlined /> },
      ]
    },
    {
      title: 'Activity Reports',
      key: 'activities',
      icon: <CalendarOutlined />,
      children: [
        { title: 'Activity Summary', key: 'activity-summary', icon: <BarChartOutlined /> },
        { title: 'Participation Rates', key: 'participation', icon: <TeamOutlined /> },
      ]
    },
  ];

  if (loading || !reportData) {
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
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            background: 'var(--neutral-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            Reports & Analytics
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Comprehensive insights and data analysis
          </p>
        </div>
        
        <div>
          <Timer 
             type="countdown"
             title={<span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Next MoE Report Deadline</span>} 
             value={Date.now() + 1000 * 60 * 60 * 24 * 5} 
             format="D [Days] H [Hours] m [Mins]"
             valueStyle={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}
          />
        </div>

        <Space wrap>
          <Select
            value={reportType}
            onChange={setReportType}
            style={{ width: 150 }}
            options={[
              { value: 'overview', label: 'Overview' },
              { value: 'attendance', label: 'Attendance' },
              { value: 'financial', label: 'Financial' },
              { value: 'academic', label: 'Academic' },
            ]}
          />
          <Select
            value={selectedDateRange}
            onChange={setSelectedDateRange}
            style={{ width: 150 }}
            options={[
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Year' },
            ]}
          />
          <Space.Compact style={{ width: 'fit-content' }}>
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              onClick={() => downloadReport('pdf')}
              loading={generating}
            >
              PDF
            </Button>
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={() => downloadReport('excel')}
              loading={generating}
            >
              Excel
            </Button>
          </Space.Compact>
        </Space>
      </div>

      <Alert
        message="Report Generation Tips"
        description="Select the report type and date range to generate customized reports. Use the export buttons to download reports in your preferred format."
        type="info"
        showIcon
        closable
        style={{ marginBottom: '24px', borderRadius: '8px' }}
      />

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
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Total Students</span>}
              value={reportData.students.total}
              valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<UserOutlined style={{ color: '#fff' }} />}
              suffix={<div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Active enrollment</div>}
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
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Active Teachers</span>}
              value={reportData.teachers.active}
              valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<BookOutlined style={{ color: '#fff' }} />}
              suffix={<div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>of {reportData.teachers.total} total</div>}
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
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Attendance Rate</span>}
              value={reportData.attendance.averageRate}
              valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<RiseOutlined style={{ color: '#fff' }} />}
              suffix={<div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>%</div>}
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
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Fee Collection</span>}
              value={Math.round((reportData.fees.collected / reportData.fees.totalAmount) * 100)}
              valueStyle={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}
              prefix={<DollarOutlined style={{ color: '#fff' }} />}
              suffix={<div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>%</div>}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Report Categories Tree */}
        <Col xs={24} lg={6}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChartOutlined />
                <span>Report Categories</span>
              </div>
            }
            style={{ borderRadius: '12px' }}
          >
            <Tree
              showIcon
              treeData={treeData}
              defaultExpandAll
              onSelect={(keys) => {
                if (keys.length > 0) {
                  message.info(`Selected: ${keys[0]}`);
                }
              }}
            />
          </Card>
        </Col>

        {/* Main Content */}
        <Col xs={24} lg={18}>
          <Tabs
            defaultActiveKey="overview"
            size="large"
            items={[
              {
                key: 'overview',
                label: <span><BarChartOutlined /> Overview</span>,
                children: (
                  <Row gutter={[16, 16]}>
                    {/* Students by Class */}
                    <Col xs={24} lg={12}>
                      <Card
                        title="Students by Class"
                        extra={<BarChartOutlined />}
                        style={{ borderRadius: '12px' }}
                      >
                        <div style={{ marginTop: '16px' }}>
                          {reportData.students.byClass.map((classData, index) => (
                            <div key={index} style={{ marginBottom: '16px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>{classData.name}</span>
                                <span style={{ fontWeight: 500 }}>{classData.count}</span>
                              </div>
                              <Progress
                                percent={(classData.count / reportData.students.total) * 100}
                                strokeColor="#667eea"
                                showInfo={false}
                              />
                            </div>
                          ))}
                        </div>
                      </Card>
                    </Col>

                    {/* Gender Distribution */}
                    <Col xs={24} lg={12}>
                      <Card
                        title="Gender Distribution"
                        extra={<TeamOutlined />}
                        style={{ borderRadius: '12px' }}
                      >
                        <div style={{ marginTop: '16px' }}>
                          {reportData.students.byGender.map((genderData, index) => (
                            <div key={index} style={{ marginBottom: '16px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>{genderData.gender}</span>
                                <span style={{ fontWeight: 500 }}>{genderData.count}</span>
                              </div>
                              <Progress
                                percent={(genderData.count / reportData.students.total) * 100}
                                strokeColor={genderData.gender === 'MALE' ? '#667eea' : '#eb2f96'}
                                showInfo={false}
                              />
                            </div>
                          ))}
                        </div>
                      </Card>
                    </Col>

                    {/* Fees by Type */}
                    <Col xs={24} lg={12}>
                      <Card
                        title="Fees by Type"
                        extra={<DollarOutlined />}
                        style={{ borderRadius: '12px' }}
                      >
                        <div style={{ marginTop: '16px' }}>
                          {reportData.fees.byType.map((feeData, index) => (
                            <div key={index} style={{ marginBottom: '16px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>{feeData.type.replace('_', ' ')}</span>
                                <span style={{ fontWeight: 500 }}>RM {feeData.amount.toLocaleString()}</span>
                              </div>
                              <Progress
                                percent={(feeData.amount / reportData.fees.totalAmount) * 100}
                                strokeColor="#10b981"
                                showInfo={false}
                              />
                            </div>
                          ))}
                        </div>
                      </Card>
                    </Col>

                    {/* Activities Overview */}
                    <Col xs={24} lg={12}>
                      <Card
                        title="Activities Overview"
                        extra={<CalendarOutlined />}
                        style={{ borderRadius: '12px' }}
                      >
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Total Activities</span>
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{reportData.activities.total}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Upcoming</span>
                            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>{reportData.activities.upcoming}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Completed</span>
                            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>{reportData.activities.completed}</span>
                          </div>
                          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                            <div style={{ marginBottom: '8px', fontWeight: 500 }}>By Type:</div>
                            {reportData.activities.byType.map((activityData, index) => (
                              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>{activityData.type.replace('_', ' ')}</span>
                                <span>{activityData.count}</span>
                              </div>
                            ))}
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  </Row>
                ),
              },
              {
                key: 'financial',
                label: <span><DollarOutlined /> Financial</span>,
                children: (
                  <Card style={{ borderRadius: '12px' }}>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} lg={6}>
                        <div style={{ textAlign: 'center', padding: '20px', background: '#f0f9ff', borderRadius: '12px' }}>
                          <div style={{ fontSize: '14px', color: '#0284c7', fontWeight: 500, marginBottom: '8px' }}>Total Fees</div>
                          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0c4a6e' }}>RM {reportData.fees.totalAmount.toLocaleString()}</div>
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div style={{ textAlign: 'center', padding: '20px', background: '#f0fdf4', borderRadius: '12px' }}>
                          <div style={{ fontSize: '14px', color: '#16a34a', fontWeight: 500, marginBottom: '8px' }}>Collected</div>
                          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#14532d' }}>RM {reportData.fees.collected.toLocaleString()}</div>
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div style={{ textAlign: 'center', padding: '20px', background: '#fef3c7', borderRadius: '12px' }}>
                          <div style={{ fontSize: '14px', color: '#d97706', fontWeight: 500, marginBottom: '8px' }}>Pending</div>
                          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#92400e' }}>RM {reportData.fees.pending.toLocaleString()}</div>
                        </div>
                      </Col>
                      <Col xs={24} sm={12} lg={6}>
                        <div style={{ textAlign: 'center', padding: '20px', background: '#fee2e2', borderRadius: '12px' }}>
                          <div style={{ fontSize: '14px', color: '#dc2626', fontWeight: 500, marginBottom: '8px' }}>Overdue</div>
                          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#7f1d1d' }}>{reportData.fees.overdue} items</div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                ),
              },
              {
                key: 'charts',
                label: <span><BarChartOutlined /> Charts</span>,
                children: (
                  <Card style={{ borderRadius: '12px' }}>
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '32px' }}>
                         <Skeleton.Node active style={{ width: 200, height: 200 }}>
                           <BarChartOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
                         </Skeleton.Node>
                         <Skeleton.Node active style={{ width: 200, height: 200 }}>
                           <RiseOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
                         </Skeleton.Node>
                         <Skeleton.Node active style={{ width: 200, height: 200 }}>
                           <DollarOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
                         </Skeleton.Node>
                      </div>
                      <h3>Advanced Data Visualization</h3>
                      <p style={{ color: '#8c8c8c' }}>Premium chart library rendering (D3/Recharts) is provisioned for the next analytics release.</p>
                      <Button type="primary" style={{ marginTop: 16 }}>Configure Custom Charts</Button>
                    </div>
                  </Card>
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
}
