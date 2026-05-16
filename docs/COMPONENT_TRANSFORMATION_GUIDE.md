# SwiftTaska Component Transformation Guide

## Quick Reference: Before → After Transformations

---

## 1. Teachers Page - Completed Implementation

### Import Statements

**BEFORE:**
```tsx
import {
  Card,
  Table,
  Button,
  Modal,
  Spin
} from 'antd';
```

**AFTER:**
```tsx
import {
  Card,
  Button,
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
```

### Main Content Layout

**BEFORE (Table):**
```tsx
<Card>
  <Table
    columns={columns}
    dataSource={filteredTeachers}
    pagination={{ pageSize: 10 }}
  />
</Card>
```

**AFTER (Tabs + List):**
```tsx
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
      // More tabs...
    ]}
  />

  <List
    dataSource={filteredTeachers}
    pagination={{ pageSize: 10 }}
    renderItem={(teacher) => (
      <List.Item
        actions={[/* Popover with actions */]}
      >
        <List.Item.Meta
          avatar={
            <Avatar size={64} style={{ background: getAvatarGradient(teacher.firstName) }}>
              {getInitials(teacher.firstName, teacher.lastName)}
            </Avatar>
          }
          title={/* Teacher name and status */}
          description={/* Teacher details */}
        />
      </List.Item>
    )}
  />
</Card>
```

### View Details

**BEFORE (Modal):**
```tsx
<Modal
  title="Teacher Details"
  open={showViewModal}
  width={800}
>
  <Row gutter={[24, 24]}>
    <Col span={12}>
      <Title level={4}>Personal Information</Title>
      {/* Simple key-value pairs */}
    </Col>
  </Row>
</Modal>
```

**AFTER (Drawer with Timeline):**
```tsx
<Drawer
  title={/* Avatar + Name */}
  width={720}
  open={showViewDrawer}
  placement="right"
>
  <Space direction="vertical" size="large" style={{ width: '100%' }}>
    <Card title="Personal Information" bordered={false} style={{ borderRadius: 12 }}>
      {/* Enhanced layout */}
    </Card>

    <Card title="Performance Metrics" bordered={false} style={{ borderRadius: 12 }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Statistic title="Classes Taught" value={teacher.classes?.length} />
          <Progress percent={(teacher.classes?.length || 0) * 20} />
        </Col>
      </Row>
    </Card>

    <Card title="Employment History" bordered={false} style={{ borderRadius: 12 }}>
      <Timeline
        items={[
          { color: 'green', children: 'Joined as Teacher' },
          { color: 'blue', children: 'Promoted to Senior' },
          { color: 'gray', children: 'Current Position' },
        ]}
      />
    </Card>
  </Space>
</Drawer>
```

---

## 2. Classes Page Transformations

### Add Carousel for Featured Classes

**ADD THIS (New Section):**
```tsx
{/* Featured Classes Carousel */}
<Carousel autoplay style={{ marginBottom: 24, borderRadius: 12 }}>
  {classes
    .filter(c => (c._count.students / c.capacity) >= 0.9)
    .map(c => (
      <div key={c.id}>
        <Badge.Ribbon text="Nearly Full" color="red">
          <Card
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: 12,
              color: 'white',
            }}
          >
            <Title level={3} style={{ color: 'white' }}>{c.name}</Title>
            <Text style={{ color: 'white', fontSize: 18 }}>
              {c._count.students}/{c.capacity} students
            </Text>
          </Card>
        </Badge.Ribbon>
      </div>
    ))
  }
</Carousel>
```

### Progress Transformation

**BEFORE (Linear Progress):**
```tsx
<Progress
  percent={Math.min(capacityPercentage, 100)}
  status={getProgressStatus(classItem._count.students, classItem.capacity)}
  strokeColor={
    capacityPercentage >= 90 ? '#ff4d4f' :
    capacityPercentage >= 75 ? '#faad14' : '#52c41a'
  }
/>
```

**AFTER (Circular Progress):**
```tsx
<Progress
  type="circle"
  percent={Math.round(capacityPercentage)}
  size={80}
  strokeColor={
    capacityPercentage >= 90 ? '#ef4444' :
    capacityPercentage >= 75 ? '#f59e0b' : '#10b981'
  }
  format={(percent) => (
    <>
      <div style={{ fontSize: 18, fontWeight: 'bold' }}>{percent}%</div>
      <div style={{ fontSize: 12 }}>Capacity</div>
    </>
  )}
/>
```

### Add Collapse in Cards

**ADD THIS (Inside Card):**
```tsx
<Collapse
  ghost
  items={[
    {
      key: '1',
      label: 'Class Details',
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text type="secondary">Schedule:</Text>
            <Text strong> {classItem.schedule}</Text>
          </div>
          <div>
            <Text type="secondary">Description:</Text>
            <Text> {classItem.description}</Text>
          </div>
          <div>
            <Text type="secondary">Room:</Text>
            <Text strong> {classItem.room}</Text>
          </div>
        </Space>
      ),
    },
  ]}
/>
```

### Add CheckableTag Filters

**ADD THIS (After Search):**
```tsx
const [selectedTags, setSelectedTags] = useState<string[]>([]);

const handleTagChange = (tag: string, checked: boolean) => {
  const nextSelectedTags = checked
    ? [...selectedTags, tag]
    : selectedTags.filter(t => t !== tag);
  setSelectedTags(nextSelectedTags);
};

{/* In filters section */}
<Space wrap>
  <CheckableTag
    checked={selectedTags.includes('available')}
    onChange={(checked) => handleTagChange('available', checked)}
  >
    Available Spots
  </CheckableTag>
  <CheckableTag
    checked={selectedTags.includes('full')}
    onChange={(checked) => handleTagChange('full', checked)}
  >
    Nearly Full
  </CheckableTag>
  <CheckableTag
    checked={selectedTags.includes('beginner')}
    onChange={(checked) => handleTagChange('beginner', checked)}
  >
    Beginner
  </CheckableTag>
  <CheckableTag
    checked={selectedTags.includes('advanced')}
    onChange={(checked) => handleTagChange('advanced', checked)}
  >
    Advanced
  </CheckableTag>
</Space>
```

---

## 3. Attendance Page Transformations

### Convert Tailwind to Ant Design

**BEFORE (Tailwind):**
```tsx
<div className="p-6">
  <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
    <input
      type="date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-2"
    />
  </div>
</div>
```

**AFTER (Ant Design):**
```tsx
import { Calendar, DatePicker, Card, Row, Col, Badge } from 'antd';
const { RangePicker } = DatePicker;

<div style={{ padding: 24 }}>
  <Card style={{ marginBottom: 24, borderRadius: 12 }}>
    <Space>
      <DatePicker
        value={dayjs(selectedDate)}
        onChange={(date) => setSelectedDate(date?.format('YYYY-MM-DD'))}
        style={{ borderRadius: 8 }}
      />
      <RangePicker
        onChange={(dates) => {
          if (dates) {
            setDateRange([
              dates[0]?.format('YYYY-MM-DD'),
              dates[1]?.format('YYYY-MM-DD'),
            ]);
          }
        }}
      />
    </Space>
  </Card>
</div>
```

### Add Calendar Component

**ADD THIS (Main View):**
```tsx
<Calendar
  dateCellRender={(date) => {
    const dateStr = date.format('YYYY-MM-DD');
    const dayAttendance = attendance.filter(a =>
      a.date.split('T')[0] === dateStr
    );

    const stats = {
      present: dayAttendance.filter(a => a.status === 'PRESENT').length,
      absent: dayAttendance.filter(a => a.status === 'ABSENT').length,
      late: dayAttendance.filter(a => a.status === 'LATE').length,
      excused: dayAttendance.filter(a => a.status === 'EXCUSED').length,
    };

    return (
      <div style={{ fontSize: 11, lineHeight: 1.2 }}>
        {stats.present > 0 && (
          <Badge status="success" text={`P: ${stats.present}`} />
        )}
        {stats.absent > 0 && (
          <Badge status="error" text={`A: ${stats.absent}`} />
        )}
        {stats.late > 0 && (
          <Badge status="warning" text={`L: ${stats.late}`} />
        )}
        {stats.excused > 0 && (
          <Badge status="processing" text={`E: ${stats.excused}`} />
        )}
      </div>
    );
  }}
  onSelect={(date) => setSelectedDate(date.format('YYYY-MM-DD'))}
  style={{ borderRadius: 12 }}
/>
```

### Replace Status Buttons with CheckableTag

**BEFORE:**
```tsx
<button
  onClick={() => markAttendance(student.id, 'PRESENT')}
  className={`p-2 rounded-lg ${
    status === 'PRESENT'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100'
  }`}
>
  <CheckCircle className="w-4 h-4" />
</button>
```

**AFTER:**
```tsx
const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

{/* Filter section */}
<Space wrap>
  {['Present', 'Absent', 'Late', 'Excused'].map(status => (
    <CheckableTag
      key={status}
      checked={selectedStatuses.includes(status.toUpperCase())}
      onChange={(checked) => {
        const newStatuses = checked
          ? [...selectedStatuses, status.toUpperCase()]
          : selectedStatuses.filter(s => s !== status.toUpperCase());
        setSelectedStatuses(newStatuses);
      }}
      style={{
        borderRadius: 16,
        padding: '4px 12px',
        fontSize: 14,
      }}
    >
      {status === 'Present' && <CheckCircleOutlined />}
      {status === 'Absent' && <CloseCircleOutlined />}
      {status === 'Late' && <ClockCircleOutlined />}
      {status === 'Excused' && <InfoCircleOutlined />}
      {' '}{status}
    </CheckableTag>
  ))}
</Space>
```

### Add Transfer Component for Bulk Marking

**ADD THIS (New Feature):**
```tsx
const [markedStudents, setMarkedStudents] = useState<string[]>([]);

<Transfer
  dataSource={students.map(s => ({
    key: s.id,
    title: `${s.firstName} ${s.lastName}`,
    description: `${s.studentId} - ${s.class.name}`,
  }))}
  targetKeys={markedStudents}
  onChange={setMarkedStudents}
  render={item => (
    <div>
      <div style={{ fontWeight: 500 }}>{item.title}</div>
      <div style={{ fontSize: 12, color: '#8c8c8c' }}>{item.description}</div>
    </div>
  )}
  titles={['Unmarked', 'Marked Present']}
  listStyle={{
    width: 300,
    height: 400,
  }}
  showSearch
  filterOption={(inputValue, item) =>
    item.title.toLowerCase().includes(inputValue.toLowerCase())
  }
/>

<Button
  type="primary"
  icon={<CheckCircleOutlined />}
  onClick={handleBulkMark}
  disabled={markedStudents.length === 0}
>
  Mark {markedStudents.length} Students as Present
</Button>
```

### Add Result Component for Success

**ADD THIS (Conditional Render):**
```tsx
const [showSuccess, setShowSuccess] = useState(false);
const [markedCount, setMarkedCount] = useState(0);

{showSuccess && (
  <Result
    status="success"
    title="Attendance Marked Successfully!"
    subTitle={`Successfully marked attendance for ${markedCount} students on ${selectedDate}`}
    extra={[
      <Button
        type="primary"
        key="mark-another"
        onClick={() => {
          setShowSuccess(false);
          setMarkedStudents([]);
        }}
      >
        Mark Another
      </Button>,
      <Button
        key="view-report"
        onClick={() => console.log('View report')}
      >
        View Report
      </Button>,
    ]}
  />
)}
```

### Add FloatButton for Quick Actions

**ADD THIS (Outside main content):**
```tsx
<FloatButton
  icon={<CheckCircleOutlined />}
  type="primary"
  tooltip="Mark All Present"
  onClick={handleMarkAllPresent}
  style={{
    right: 24,
    bottom: 24,
  }}
/>
```

---

## 4. Fees Page Transformations

### Replace Table with Descriptions (Invoice Style)

**BEFORE:**
```tsx
<div className="bg-white rounded-lg shadow-sm border overflow-hidden">
  <table className="min-w-full">
    <thead>
      <tr>
        <th>Student</th>
        <th>Fee Details</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      {/* Table rows */}
    </tbody>
  </table>
</div>
```

**AFTER:**
```tsx
import { Descriptions, Watermark } from 'antd';

<Watermark content="SwiftTaska Nursery" gap={[200, 200]}>
  <Card style={{ borderRadius: 12 }}>
    <Descriptions
      title={
        <Space>
          <FileTextOutlined style={{ fontSize: 24, color: '#6366f1' }} />
          <Text strong style={{ fontSize: 18 }}>Fee Invoice</Text>
        </Space>
      }
      bordered
      column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
      items={[
        {
          key: '1',
          label: 'Invoice Number',
          children: `FEE-${selectedFee.id.slice(-6)}`,
        },
        {
          key: '2',
          label: 'Issue Date',
          children: new Date(selectedFee.dueDate).toLocaleDateString(),
        },
        {
          key: '3',
          label: 'Student Name',
          children: (
            <Space>
              <Avatar style={{ background: '#6366f1' }}>
                {selectedFee.student.firstName[0]}
              </Avatar>
              <Text strong>
                {selectedFee.student.firstName} {selectedFee.student.lastName}
              </Text>
            </Space>
          ),
        },
        {
          key: '4',
          label: 'Student ID',
          children: selectedFee.student.studentId,
        },
        {
          key: '5',
          label: 'Class',
          children: `${selectedFee.student.class.name} - ${selectedFee.student.class.level}`,
        },
        {
          key: '6',
          label: 'Fee Type',
          children: (
            <Tag color="blue">{selectedFee.type.replace('_', ' ')}</Tag>
          ),
        },
        {
          key: '7',
          label: 'Amount',
          children: (
            <Text strong style={{ fontSize: 18, color: '#6366f1' }}>
              RM {selectedFee.amount.toLocaleString()}
            </Text>
          ),
        },
        {
          key: '8',
          label: 'Status',
          children: (
            <Tag
              color={getStatusColor(selectedFee.status)}
              icon={
                selectedFee.status === 'PAID' ? <CheckCircleOutlined /> :
                selectedFee.status === 'PARTIAL' ? <ClockCircleOutlined /> :
                <WarningOutlined />
              }
              style={{ fontSize: 14 }}
            >
              {selectedFee.status}
            </Tag>
          ),
        },
        selectedFee.paidAmount && {
          key: '9',
          label: 'Paid Amount',
          children: (
            <Text style={{ color: '#10b981', fontSize: 16, fontWeight: 500 }}>
              RM {selectedFee.paidAmount.toLocaleString()}
            </Text>
          ),
        },
        selectedFee.paidAmount && {
          key: '10',
          label: 'Balance',
          children: (
            <Text style={{ color: '#ef4444', fontSize: 16, fontWeight: 500 }}>
              RM {(selectedFee.amount - selectedFee.paidAmount).toLocaleString()}
            </Text>
          ),
        },
      ].filter(Boolean)}
    />
  </Card>
</Watermark>
```

### Add Timeline for Payment History

**ADD THIS (New Section):**
```tsx
<Card
  title={
    <Space>
      <ClockCircleOutlined />
      <Text strong>Payment History</Text>
    </Space>
  }
  style={{ borderRadius: 12, marginTop: 16 }}
>
  <Timeline
    mode="left"
    items={[
      {
        label: new Date(selectedFee.dueDate).toLocaleDateString(),
        children: (
          <>
            <Text strong>Fee Created</Text>
            <br />
            <Text type="secondary">Amount: RM {selectedFee.amount.toLocaleString()}</Text>
          </>
        ),
        color: 'blue',
        dot: <FileTextOutlined />,
      },
      selectedFee.paidDate && {
        label: new Date(selectedFee.paidDate).toLocaleDateString(),
        children: (
          <>
            <Text strong>Payment Received</Text>
            <br />
            <Text type="secondary">
              Amount: RM {selectedFee.paidAmount?.toLocaleString()}
            </Text>
            <br />
            <Text type="secondary">
              Method: {selectedFee.paymentMethod}
            </Text>
          </>
        ),
        color: 'green',
        dot: <CheckCircleOutlined />,
      },
      {
        label: 'Current',
        children: (
          <>
            <Text strong>Status: {selectedFee.status}</Text>
            <br />
            {selectedFee.status !== 'PAID' && (
              <Text type="secondary">
                Remaining: RM {(selectedFee.amount - (selectedFee.paidAmount || 0)).toLocaleString()}
              </Text>
            )}
          </>
        ),
        color: selectedFee.status === 'PAID' ? 'green' : 'red',
        dot: selectedFee.status === 'PAID' ? <CheckCircleOutlined /> : <WarningOutlined />,
      },
    ].filter(Boolean)}
  />
</Card>
```

### Replace Payment Modal

**BEFORE:**
```tsx
<div className="fixed inset-0 bg-black bg-opacity-50">
  <div className="bg-white rounded-lg p-6">
    <input type="number" />
    <select>
      <option value="CASH">Cash</option>
    </select>
  </div>
</div>
```

**AFTER:**
```tsx
<Modal
  title="Record Payment"
  open={showPaymentModal}
  onCancel={() => setShowPaymentModal(false)}
  footer={null}
  width={500}
>
  <Space direction="vertical" style={{ width: '100%' }} size="large">
    <Alert
      message={`Total Amount: RM ${selectedFee.amount.toLocaleString()}`}
      description={
        selectedFee.paidAmount
          ? `Already Paid: RM ${selectedFee.paidAmount.toLocaleString()}`
          : 'No payments made yet'
      }
      type="info"
      showIcon
    />

    <Form layout="vertical">
      <Form.Item label="Payment Amount">
        <InputNumber
          style={{ width: '100%', borderRadius: 8 }}
          min={0}
          max={selectedFee.amount - (selectedFee.paidAmount || 0)}
          precision={2}
          prefix="RM"
          value={paymentAmount}
          onChange={setPaymentAmount}
          size="large"
          placeholder="Enter payment amount"
        />
      </Form.Item>

      <Form.Item label="Payment Method">
        <Radio.Group
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{ width: '100%' }}
        >
          <Space direction="vertical">
            <Radio value="CASH">
              <Space>
                <DollarOutlined />
                Cash
              </Space>
            </Radio>
            <Radio value="BANK_TRANSFER">
              <Space>
                <BankOutlined />
                Bank Transfer
              </Space>
            </Radio>
            <Radio value="ONLINE">
              <Space>
                <CreditCardOutlined />
                Online Payment
              </Space>
            </Radio>
            <Radio value="CHEQUE">
              <Space>
                <FileTextOutlined />
                Cheque
              </Space>
            </Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item>
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handlePayment}
            disabled={!paymentAmount || paymentAmount <= 0}
          >
            Record Payment
          </Button>
        </Space>
      </Form.Item>
    </Form>
  </Space>
</Modal>
```

### Add Segmented for View Mode

**ADD THIS (Filters Section):**
```tsx
<Segmented
  value={viewMode}
  onChange={setViewMode}
  options={[
    {
      label: 'All',
      value: 'all',
      icon: <UnorderedListOutlined />,
    },
    {
      label: 'Pending',
      value: 'pending',
      icon: <ClockCircleOutlined />,
    },
    {
      label: 'Paid',
      value: 'paid',
      icon: <CheckCircleOutlined />,
    },
    {
      label: 'Overdue',
      value: 'overdue',
      icon: <WarningOutlined />,
    },
  ]}
  size="large"
/>
```

---

## 5. Activities Page Transformations

### Replace Card Grid with Timeline

**BEFORE:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredActivities.map((activity) => (
    <div key={activity.id} className="bg-white rounded-lg shadow-sm border">
      {/* Activity card content */}
    </div>
  ))}
</div>
```

**AFTER:**
```tsx
<Timeline
  mode="alternate"
  items={filteredActivities.map((activity, index) => ({
    color: isUpcoming(activity.date) ? '#6366f1' :
           isToday(activity.date) ? '#10b981' : '#8c8c8c',
    dot: (
      <Avatar
        icon={getTypeIcon(activity.type)}
        style={{
          background: getTypeColor(activity.type),
        }}
      />
    ),
    children: (
      <Card
        hoverable
        style={{
          borderRadius: 12,
          transition: 'all 0.3s',
        }}
        bodyStyle={{ padding: 16 }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Tag color={getTypeTagColor(activity.type)}>
              {activity.type.replace('_', ' ')}
            </Tag>
            {isToday(activity.date) && (
              <Tag color="success" icon={<ClockCircleOutlined />}>
                Today
              </Tag>
            )}
            {isUpcoming(activity.date) && !isToday(activity.date) && (
              <Tag color="processing" icon={<CalendarOutlined />}>
                Upcoming
              </Tag>
            )}
          </div>

          <Title level={4} style={{ margin: 0 }}>{activity.name}</Title>

          <Text type="secondary">{activity.description}</Text>

          <Divider style={{ margin: '8px 0' }} />

          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Space>
              <CalendarOutlined />
              <Text>
                {new Date(activity.date).toLocaleDateString()} at{' '}
                {new Date(activity.date).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </Space>

            <Space>
              <EnvironmentOutlined />
              <Text>{activity.location}</Text>
            </Space>

            {activity.duration && (
              <Space>
                <ClockCircleOutlined />
                <Text>{activity.duration} minutes</Text>
              </Space>
            )}

            <Space>
              <TeamOutlined />
              <Badge
                count={activity._count.participants}
                showZero
                style={{ backgroundColor: '#6366f1' }}
              />
              {activity.maxParticipants && (
                <Text type="secondary">of {activity.maxParticipants}</Text>
              )}
            </Space>
          </Space>

          <Divider style={{ margin: '8px 0' }} />

          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewActivity(activity)}
            >
              View
            </Button>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditClick(activity)}
            >
              Edit
            </Button>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteActivity(activity)}
            >
              Delete
            </Button>
          </Space>
        </Space>
      </Card>
    ),
  }))}
/>
```

### Add Image.PreviewGroup (If photos available)

**ADD THIS (In activity card):**
```tsx
{activity.photos && activity.photos.length > 0 && (
  <div style={{ marginTop: 16 }}>
    <Text strong>Photos:</Text>
    <Image.PreviewGroup>
      <Space wrap style={{ marginTop: 8 }}>
        {activity.photos.map((photo, index) => (
          <Image
            key={index}
            width={80}
            height={80}
            src={photo.url}
            alt={`Activity photo ${index + 1}`}
            style={{
              borderRadius: 8,
              objectFit: 'cover',
            }}
            placeholder={
              <Skeleton.Image style={{ width: 80, height: 80 }} />
            }
          />
        ))}
      </Space>
    </Image.PreviewGroup>
  </div>
)}
```

### Add FloatButton.Group

**ADD THIS (End of component):**
```tsx
<FloatButton.Group
  trigger="click"
  type="primary"
  style={{ right: 24, bottom: 24 }}
  icon={<PlusOutlined />}
  tooltip="Quick Actions"
>
  <FloatButton
    icon={<PlusOutlined />}
    tooltip="Add Activity"
    onClick={() => setShowAddModal(true)}
  />
  <FloatButton
    icon={<FilterOutlined />}
    tooltip="Filter Activities"
    onClick={() => setShowFilters(true)}
  />
  <FloatButton
    icon={<DownloadOutlined />}
    tooltip="Export Report"
    onClick={handleExportReport}
  />
  <FloatButton
    icon={<CalendarOutlined />}
    tooltip="View Calendar"
    onClick={() => setViewMode('calendar')}
  />
</FloatButton.Group>
```

### Replace Loading Spinner with Skeleton

**BEFORE:**
```tsx
{loading && (
  <div className="animate-pulse">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-32 bg-gray-200 rounded"></div>
    ))}
  </div>
)}
```

**AFTER:**
```tsx
{loading && (
  <Space direction="vertical" style={{ width: '100%' }} size="large">
    {[1, 2, 3, 4].map(i => (
      <Skeleton
        key={i}
        active
        avatar={{ size: 64, shape: 'circle' }}
        paragraph={{ rows: 4 }}
        title={{ width: '60%' }}
      />
    ))}
  </Space>
)}
```

### Add Calendar View Option

**ADD THIS (Alternative view):**
```tsx
const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');

{/* View mode toggle */}
<Segmented
  value={viewMode}
  onChange={setViewMode}
  options={[
    { label: 'Timeline', value: 'timeline', icon: <UnorderedListOutlined /> },
    { label: 'Calendar', value: 'calendar', icon: <CalendarOutlined /> },
  ]}
/>

{viewMode === 'calendar' ? (
  <Calendar
    dateCellRender={(date) => {
      const dateStr = date.format('YYYY-MM-DD');
      const dayActivities = activities.filter(a =>
        a.date.split('T')[0] === dateStr
      );

      return (
        <div style={{ minHeight: 60 }}>
          {dayActivities.map(activity => (
            <Badge
              key={activity.id}
              status="processing"
              text={
                <Text
                  ellipsis
                  style={{
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                  onClick={() => handleViewActivity(activity)}
                >
                  {activity.name}
                </Text>
              }
            />
          ))}
        </div>
      );
    }}
    onSelect={(date) => {
      const dateStr = date.format('YYYY-MM-DD');
      const dayActivities = activities.filter(a =>
        a.date.split('T')[0] === dateStr
      );
      if (dayActivities.length === 1) {
        handleViewActivity(dayActivities[0]);
      }
    }}
  />
) : (
  <Timeline>...</Timeline>
)}
```

---

## 6. Reports Page Transformations

### Add Tree Navigation

**ADD THIS (Left Sidebar or Top Section):**
```tsx
const [selectedReport, setSelectedReport] = useState<string>('enrollment');

<Tree
  showLine={{ showLeafIcon: false }}
  showIcon
  defaultExpandAll
  defaultSelectedKeys={['enrollment']}
  treeData={[
    {
      title: 'Student Reports',
      key: 'students',
      icon: <TeamOutlined style={{ color: '#6366f1' }} />,
      children: [
        {
          title: 'Enrollment Report',
          key: 'enrollment',
          icon: <FileTextOutlined />,
        },
        {
          title: 'Attendance Report',
          key: 'student-attendance',
          icon: <CalendarOutlined />,
        },
        {
          title: 'Performance Report',
          key: 'performance',
          icon: <TrophyOutlined />,
        },
      ],
    },
    {
      title: 'Financial Reports',
      key: 'financial',
      icon: <DollarOutlined style={{ color: '#10b981' }} />,
      children: [
        {
          title: 'Fee Collection',
          key: 'fees',
          icon: <FileTextOutlined />,
        },
        {
          title: 'Outstanding Payments',
          key: 'outstanding',
          icon: <WarningOutlined />,
        },
        {
          title: 'Revenue Analysis',
          key: 'revenue',
          icon: <RiseOutlined />,
        },
      ],
    },
    {
      title: 'Teacher Reports',
      key: 'teachers',
      icon: <BookOutlined style={{ color: '#f59e0b' }} />,
      children: [
        {
          title: 'Staff Overview',
          key: 'staff',
          icon: <FileTextOutlined />,
        },
        {
          title: 'Class Assignments',
          key: 'assignments',
          icon: <ScheduleOutlined />,
        },
      ],
    },
    {
      title: 'Activity Reports',
      key: 'activities',
      icon: <CalendarOutlined style={{ color: '#8b5cf6' }} />,
      children: [
        {
          title: 'Events Summary',
          key: 'events',
          icon: <FileTextOutlined />,
        },
        {
          title: 'Participation Analysis',
          key: 'participation',
          icon: <PieChartOutlined />,
        },
      ],
    },
  ]}
  onSelect={(selectedKeys) => {
    if (selectedKeys.length > 0) {
      setSelectedReport(selectedKeys[0] as string);
    }
  }}
  style={{
    background: '#fafafa',
    borderRadius: 12,
    padding: 16,
  }}
/>
```

### Add Statistic.Countdown

**ADD THIS (Dashboard Widgets):**
```tsx
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} lg={8}>
    <Card style={{ borderRadius: 12 }}>
      <Statistic.Countdown
        title={
          <Space>
            <ClockCircleOutlined />
            <Text>Report Deadline</Text>
          </Space>
        }
        value={Date.now() + 1000 * 60 * 60 * 24 * 7} // 7 days
        format="D [days] H [hours] m [min]"
        valueStyle={{
          color: '#6366f1',
          fontSize: 24,
        }}
      />
    </Card>
  </Col>

  <Col xs={24} sm={12} lg={8}>
    <Card style={{ borderRadius: 12 }}>
      <Statistic.Countdown
        title="Next Auto-Update"
        value={Date.now() + 1000 * 60 * 30} // 30 minutes
        format="HH:mm:ss"
        valueStyle={{ color: '#10b981' }}
        onFinish={() => {
          message.info('Report data refreshed');
          fetchReportData();
        }}
      />
    </Card>
  </Col>

  <Col xs={24} sm={12} lg={8}>
    <Card style={{ borderRadius: 12 }}>
      <Statistic
        title="Real-Time Active Users"
        value={42}
        prefix={<TeamOutlined />}
        suffix="online"
        valueStyle={{ color: '#f59e0b' }}
      />
    </Card>
  </Col>
</Row>
```

### Enhanced Chart Placeholders

**REPLACE Simple Divs:**
```tsx
{/* BEFORE */}
<div className="h-64 bg-gray-200 rounded"></div>

{/* AFTER */}
<Card
  title={
    <Space>
      <BarChartOutlined />
      <Text strong>Student Enrollment Trends</Text>
    </Space>
  }
  extra={
    <Button icon={<DownloadOutlined />}>
      Export Chart
    </Button>
  }
  style={{ borderRadius: 12 }}
>
  <div
    style={{
      height: 300,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: 12,
      padding: 32,
    }}
  >
    <BarChartOutlined
      style={{
        fontSize: 64,
        color: 'white',
        marginBottom: 16,
      }}
    />
    <Title level={4} style={{ color: 'white', margin: 0, textAlign: 'center' }}>
      Chart Visualization Placeholder
    </Title>
    <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 8, textAlign: 'center' }}>
      Integrate with Chart.js, Recharts, or Apache ECharts
    </Text>
    <div style={{ marginTop: 24 }}>
      <Space>
        <Button
          type="primary"
          ghost
          icon={<LineChartOutlined />}
          style={{ borderColor: 'white', color: 'white' }}
        >
          Line Chart
        </Button>
        <Button
          type="primary"
          ghost
          icon={<PieChartOutlined />}
          style={{ borderColor: 'white', color: 'white' }}
        >
          Pie Chart
        </Button>
      </Space>
    </div>
  </div>

  {/* Sample data table below chart */}
  <Table
    dataSource={sampleData}
    columns={sampleColumns}
    size="small"
    pagination={false}
    style={{ marginTop: 16 }}
  />
</Card>
```

### Replace Download Buttons

**BEFORE:**
```tsx
<button
  onClick={() => downloadReport('pdf')}
  className="bg-red-600 text-white px-3 py-2 rounded-lg"
>
  <Download className="w-4 h-4" />
  PDF
</button>
```

**AFTER:**
```tsx
<Dropdown
  menu={{
    items: [
      {
        key: 'pdf',
        label: 'Download as PDF',
        icon: <FilePdfOutlined />,
        onClick: () => downloadReport('pdf'),
      },
      {
        key: 'excel',
        label: 'Download as Excel',
        icon: <FileExcelOutlined />,
        onClick: () => downloadReport('excel'),
      },
      {
        key: 'csv',
        label: 'Download as CSV',
        icon: <FileTextOutlined />,
        onClick: () => downloadReport('csv'),
      },
      {
        key: 'json',
        label: 'Export as JSON',
        icon: <CodeOutlined />,
        onClick: () => downloadReport('json'),
      },
      {
        type: 'divider',
      },
      {
        key: 'print',
        label: 'Print Report',
        icon: <PrinterOutlined />,
        onClick: () => window.print(),
      },
      {
        key: 'share',
        label: 'Share Report',
        icon: <ShareAltOutlined />,
        onClick: handleShareReport,
      },
    ],
  }}
  placement="bottomRight"
  trigger={['click']}
>
  <Button
    type="primary"
    icon={<DownloadOutlined />}
    size="large"
    style={{
      borderRadius: 8,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
    }}
  >
    Export Report
    <DownOutlined style={{ marginLeft: 8, fontSize: 12 }} />
  </Button>
</Dropdown>
```

---

## Common Patterns Across All Pages

### 1. Loading States

**Pattern:**
```tsx
{loading ? (
  <Skeleton active avatar paragraph={{ rows: 4 }} />
) : (
  <ActualContent />
)}
```

### 2. Empty States

**Pattern:**
```tsx
{data.length === 0 ? (
  <Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    description={
      searchTerm || filters
        ? "No results found. Try adjusting your filters."
        : "Get started by adding your first item"
    }
    style={{ padding: '40px 0' }}
  >
    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
      Add New Item
    </Button>
  </Empty>
) : (
  <List />
)}
```

### 3. Stats Cards

**Pattern:**
```tsx
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} lg={6}>
    <Card
      hoverable
      style={{
        borderRadius: 12,
        transition: 'all 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <Statistic
        title="Title"
        value={value}
        prefix={<Icon />}
        valueStyle={{ color: '#6366f1' }}
      />
    </Card>
  </Col>
</Row>
```

### 4. Action Buttons

**Pattern:**
```tsx
<Space>
  <Tooltip title="View Details">
    <Button
      type="text"
      icon={<EyeOutlined />}
      onClick={handleView}
    />
  </Tooltip>
  <Tooltip title="Edit">
    <Button
      type="text"
      icon={<EditOutlined />}
      onClick={handleEdit}
    />
  </Tooltip>
  <Tooltip title="Delete">
    <Button
      type="text"
      danger
      icon={<DeleteOutlined />}
      onClick={handleDelete}
    />
  </Tooltip>
</Space>
```

### 5. Filter Section

**Pattern:**
```tsx
<Card style={{ marginBottom: 24, borderRadius: 12 }}>
  <Space wrap size="middle">
    <Input
      placeholder="Search..."
      prefix={<SearchOutlined />}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ width: 300, borderRadius: 8 }}
    />
    <Select
      placeholder="Filter by..."
      value={filter}
      onChange={setFilter}
      style={{ width: 200, borderRadius: 8 }}
      allowClear
    >
      {/* Options */}
    </Select>
    <Segmented
      value={viewMode}
      onChange={setViewMode}
      options={viewOptions}
    />
  </Space>
</Card>
```

---

## Final Notes

### Implementation Steps:
1. Add all new imports at the top
2. Add new state variables (tabs, view modes, filters)
3. Add helper functions (getInitials, getAvatarGradient, etc.)
4. Replace old components with new ones section by section
5. Test each section before moving to the next
6. Verify all API calls still work
7. Test responsive behavior

### Testing Checklist:
- [ ] Component renders without errors
- [ ] All interactions work (clicks, hovers, inputs)
- [ ] API calls execute correctly
- [ ] Loading states display properly
- [ ] Empty states show appropriate messages
- [ ] Responsive design works on all screen sizes
- [ ] Accessibility features intact
- [ ] Performance is acceptable

### Common Pitfalls to Avoid:
- Don't remove existing state variables
- Don't change API call patterns
- Don't alter data transformations
- Maintain existing event handler logic
- Keep form validation rules
- Preserve error handling

---

*Guide Last Updated: 2025-10-05*
*SwiftTaska Dashboard Redesign Project*
