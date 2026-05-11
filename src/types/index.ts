// API Response Types
export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE';
  nationality: string;
  religion?: string;
  medicalInfo?: string;
  allergies?: string;
  emergencyContact?: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  fatherName: string;
  fatherPhone: string;
  fatherEmail?: string;
  fatherOccupation?: string;
  motherName: string;
  motherPhone: string;
  motherEmail?: string;
  motherOccupation?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardianRelationship?: string;
  classId?: string;
  class?: Class;
  enrollmentDate: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'WITHDRAWN';
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

export interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE';
  nationality: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  position: string;
  department?: string;
  hireDate: Date;
  salary?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
  qualifications?: string;
  experience?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

export interface Class {
  id: string;
  name: string;
  level: string;
  capacity: number;
  academicYear: string;
  teacherId?: string;
  teacher?: Teacher;
  createdAt: Date;
  updatedAt: Date;
}

export interface Fee {
  id: string;
  type: 'TUITION' | 'REGISTRATION' | 'ACTIVITY' | 'TRANSPORT' | 'MEAL' | 'UNIFORM' | 'BOOKS' | 'MEDICAL' | 'OTHER';
  description: string;
  amount: number;
  dueDate: Date;
  status: 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'WAIVED';
  paidDate?: Date;
  paidAmount?: number;
  paymentMethod?: string;
  notes?: string;
  studentId: string;
  student?: Student;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  name: string;
  description?: string;
  type: 'ACADEMIC' | 'SPORTS' | 'ARTS' | 'MUSIC' | 'FIELD_TRIP' | 'CELEBRATION' | 'WORKSHOP' | 'OTHER';
  date: Date;
  duration?: number;
  location?: string;
  maxParticipants?: number;
  classId?: string;
  class?: Class;
  createdById: string;
  createdBy?: Teacher;
  createdAt: Date;
  updatedAt: Date;
}

// Report Data Types
export interface ClassCount {
  name: string;
  count: number;
}

export interface GenderCount {
  gender: string;
  count: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface AttendanceTrend {
  date: string;
  rate: number;
}

export interface FeeByType {
  type: string;
  amount: number;
}

export interface ActivityByType {
  type: string;
  count: number;
}

export interface ReportData {
  students: {
    total: number;
    byClass: ClassCount[];
    byGender: GenderCount[];
  };
  teachers: {
    total: number;
    active: number;
    byStatus: StatusCount[];
  };
  attendance: {
    averageRate: number;
    todayPresent: number;
    todayTotal: number;
    monthlyTrend: AttendanceTrend[];
  };
  fees: {
    totalAmount: number;
    collected: number;
    pending: number;
    overdue: number;
    byType: FeeByType[];
  };
  activities: {
    total: number;
    upcoming: number;
    completed: number;
    byType: ActivityByType[];
  };
}