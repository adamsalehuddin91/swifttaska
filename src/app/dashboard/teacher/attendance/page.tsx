'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Clock, AlertCircle, Users, Save } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
}

interface Class {
  id: string;
  name: string;
  level: string;
  students: Student[];
}

interface AttendanceRecord {
  studentId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'SICK' | 'EXCUSED';
}

function TeacherAttendanceInner() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState(searchParams?.get('classId') || '');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchTeacherClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId && classes.length > 0) {
      const classData = classes.find(c => c.id === selectedClassId);
      setSelectedClass(classData || null);

      if (classData) {
        // Initialize attendance with all students as PRESENT
        setAttendance(classData.students.map(s => ({
          studentId: s.id,
          status: 'PRESENT' as const
        })));
      }
    }
  }, [selectedClassId, classes]);

  const fetchTeacherClasses = async () => {
    try {
      const teacherRes = await fetch('/api/teachers/me');
      if (teacherRes.ok) {
        const teacher = await teacherRes.json();

        // Fetch full class details with students
        const classesWithStudents = await Promise.all(
          (teacher.classes || []).map(async (c: any) => {
            const res = await fetch(`/api/classes/${c.id}`);
            return res.ok ? res.json() : null;
          })
        );

        setClasses(classesWithStudents.filter(Boolean));
      }
    } catch (error) {
      console.error('Error fetching teacher classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: AttendanceRecord['status']) => {
    setAttendance(prev =>
      prev.map(a => a.studentId === studentId ? { ...a, status } : a)
    );
  };

  const handleSubmit = async () => {
    if (!selectedClassId || attendance.length === 0) {
      toast.warning('Please select a class and mark attendance');
      return;
    }

    setSubmitting(true);
    try {
      const promises = attendance.map(record => {
        const student = selectedClass?.students.find(s => s.id === record.studentId);
        if (!student) return null;

        return fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: record.studentId,
            classId: selectedClassId,
            date: new Date(date),
            status: record.status
          })
        });
      });

      const results = await Promise.all(promises.filter(Boolean));
      const allSuccess = results.every(r => r?.ok);

      if (allSuccess) {
        toast.success('Attendance recorded successfully!');
        // Reset
        setAttendance(selectedClass?.students.map(s => ({
          studentId: s.id,
          status: 'PRESENT' as const
        })) || []);
      } else {
        toast.error('Some attendance records failed to save');
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast.error('Failed to record attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'ABSENT': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'LATE': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'SICK': return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'EXCUSED': return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-100 text-green-800 border-green-300';
      case 'ABSENT': return 'bg-red-100 text-red-800 border-red-300';
      case 'LATE': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'SICK': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'EXCUSED': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const statusOptions: AttendanceRecord['status'][] = ['PRESENT', 'ABSENT', 'LATE', 'SICK', 'EXCUSED'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Take Attendance</h1>
        <p className="text-gray-600 mt-1">Mark student attendance for today</p>
      </div>

      {/* Class & Date Selection */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a class...</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} - {c.level}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Attendance Grid */}
      {selectedClass ? (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedClass.name}</h2>
                <p className="text-sm text-gray-600">{selectedClass.students.length} students</p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Attendance
                  </>
                )}
              </button>
            </div>
          </div>

          {selectedClass.students.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No students in this class</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {selectedClass.students.map((student) => {
                const record = attendance.find(a => a.studentId === student.id);
                const currentStatus = record?.status || 'PRESENT';

                return (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {student.studentId}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusOptions.map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(student.id, status)}
                          className={`px-3 py-2 rounded-lg border-2 transition-all ${
                            currentStatus === status
                              ? getStatusColor(status)
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                          title={status}
                        >
                          {getStatusIcon(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Class</h3>
          <p className="text-gray-600">Choose a class to mark attendance</p>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-medium text-gray-900 mb-4">Attendance Status Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statusOptions.map(status => (
            <div key={status} className="flex items-center gap-2">
              {getStatusIcon(status)}
              <span className="text-sm text-gray-700">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TeacherAttendancePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
      <TeacherAttendanceInner />
    </Suspense>
  );
}
