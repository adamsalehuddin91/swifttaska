'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, Activity } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  notes: string | null;
}

interface AttendanceData {
  records: AttendanceRecord[];
  stats: {
    total: number;
    present: number;
    absent: number;
    late: number;
    sick: number;
    excused: number;
    rate: number;
  };
  studentName: string;
}

export default function ParentAttendancePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AttendanceData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth, selectedYear]);

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(
        `/api/parents/attendance?month=${selectedMonth}&year=${selectedYear}`
      );
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'ABSENT':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'LATE':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'SICK':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'EXCUSED':
        return <Activity className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ABSENT':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'LATE':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'SICK':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'EXCUSED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No attendance data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Attendance Records</h1>
        <p className="text-gray-600 mt-1">{data.studentName}</p>
      </div>

      {/* Month/Year Selector */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600 mb-1">Total Days</p>
          <p className="text-2xl font-bold text-gray-900">{data.stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-4 border border-green-200">
          <p className="text-sm text-green-700 mb-1 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" /> Present
          </p>
          <p className="text-2xl font-bold text-green-900">{data.stats.present}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow-md p-4 border border-red-200">
          <p className="text-sm text-red-700 mb-1 flex items-center">
            <XCircle className="w-4 h-4 mr-1" /> Absent
          </p>
          <p className="text-2xl font-bold text-red-900">{data.stats.absent}</p>
        </div>
        <div className="bg-orange-50 rounded-lg shadow-md p-4 border border-orange-200">
          <p className="text-sm text-orange-700 mb-1 flex items-center">
            <Clock className="w-4 h-4 mr-1" /> Late
          </p>
          <p className="text-2xl font-bold text-orange-900">{data.stats.late}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-md p-4 border border-yellow-200">
          <p className="text-sm text-yellow-700 mb-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" /> Sick
          </p>
          <p className="text-2xl font-bold text-yellow-900">{data.stats.sick}</p>
        </div>
        <div className="bg-indigo-50 rounded-lg shadow-md p-4 border border-indigo-200">
          <p className="text-sm text-indigo-700 mb-1">Attendance Rate</p>
          <p className="text-2xl font-bold text-indigo-900">{data.stats.rate}%</p>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            Daily Records
          </h2>
        </div>
        <div className="divide-y">
          {data.records.length > 0 ? (
            data.records.map((record) => (
              <div key={record.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(record.status)}
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      {record.notes && (
                        <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No attendance records for this period
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
