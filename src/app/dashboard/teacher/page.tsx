'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Calendar, CheckCircle, BookOpen, ClipboardList } from 'lucide-react';

interface TeacherDashboardData {
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    classes: Array<{
      id: string;
      name: string;
      level: string;
      _count: {
        students: number;
      };
    }>;
  } | null;
  todayAttendance: number;
  totalStudents: number;
  upcomingActivities: number;
  pendingTasks: number;
}

export default function TeacherDashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<TeacherDashboardData>({
    teacher: null,
    todayAttendance: 0,
    totalStudents: 0,
    upcomingActivities: 0,
    pendingTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, [session]);

  const fetchTeacherData = async () => {
    if (!session?.user?.id) return;

    try {
      // Fetch teacher profile with classes
      const teacherRes = await fetch(`/api/teachers/me`);
      if (teacherRes.ok) {
        const teacher = await teacherRes.json();

        // Calculate stats
        const totalStudents = teacher.classes?.reduce((sum: number, c: any) => sum + c._count.students, 0) || 0;

        setData({
          teacher,
          todayAttendance: 0, // TODO: Fetch today's attendance count
          totalStudents,
          upcomingActivities: 0, // TODO: Fetch upcoming activities
          pendingTasks: 0, // TODO: Fetch pending tasks
        });
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">
          Welcome, {data.teacher?.firstName || session?.user?.name}!
        </h2>
        <p className="text-blue-100">
          Employee ID: {data.teacher?.employeeId || 'N/A'}
        </p>
        <div className="mt-4">
          <p className="text-blue-100">
            You are teaching <strong>{data.teacher?.classes?.length || 0} classes</strong> with <strong>{data.totalStudents} students</strong>
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">My Classes</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {data.teacher?.classes?.length || 0}
              </p>
              <p className="text-sm text-gray-600">{data.totalStudents} students total</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Today's Attendance</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {data.todayAttendance}
              </p>
              <p className="text-sm text-gray-600">Students marked</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Upcoming Activities</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {data.upcomingActivities}
              </p>
              <p className="text-sm text-gray-600">This week</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Pending Tasks</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {data.pendingTasks}
              </p>
              <p className="text-sm text-gray-600">To complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Classes */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">My Classes</h3>
        {data.teacher?.classes && data.teacher.classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.teacher.classes.map((classItem) => (
              <Link
                key={classItem.id}
                href={`/dashboard/teacher/class/${classItem.id}`}
                className="border rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{classItem.name}</h4>
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-2">{classItem.level}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  {classItem._count.students} students
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No classes assigned yet</p>
            <p className="text-sm text-gray-500 mt-1">Contact admin to get assigned to classes</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/teacher/attendance"
          className="bg-white rounded-lg shadow-sm border p-6 hover:border-blue-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Take Attendance</h3>
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600">Mark student attendance for today</p>
        </Link>

        <Link
          href="/dashboard/teacher/activities"
          className="bg-white rounded-lg shadow-sm border p-6 hover:border-blue-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Plan Activity</h3>
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600">Create new activity for your class</p>
        </Link>

        <Link
          href="/dashboard/teacher/profile"
          className="bg-white rounded-lg shadow-sm border p-6 hover:border-blue-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">My Profile</h3>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">View and update your profile</p>
        </Link>
      </div>
    </div>
  );
}
