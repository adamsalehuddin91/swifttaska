'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { User, Calendar, Heart, AlertCircle, Phone, MapPin } from 'lucide-react';

interface ChildData {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  religion: string;
  profilePhoto: string | null;
  medicalInfo: string | null;
  allergies: string | null;
  emergencyContact: string | null;
  address: string;
  city: string;
  state: string;
  postcode: string;
  class: {
    name: string;
    level: string;
    teacher: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    };
  };
  enrollmentDate: string;
  status: string;
}

export default function MyChildPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState<ChildData | null>(null);

  useEffect(() => {
    fetchChildData();
  }, []);

  const fetchChildData = async () => {
    try {
      const response = await fetch('/api/parents/me');
      if (response.ok) {
        const result = await response.json();
        setChild(result.parent.student);
      }
    } catch (error) {
      console.error('Failed to fetch child data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No child information found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Child</h1>
        <p className="text-gray-600 mt-1">Complete information about your child</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
            {child.firstName[0]}{child.lastName[0]}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {child.firstName} {child.lastName}
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div>
                <p className="text-sm text-gray-500">Student ID</p>
                <p className="font-medium">{child.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {child.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-indigo-600" />
            Personal Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-900">
                {new Date(child.dateOfBirth).toLocaleDateString()} ({calculateAge(child.dateOfBirth)} years old)
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium text-gray-900">{child.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nationality</p>
              <p className="font-medium text-gray-900">{child.nationality}</p>
            </div>
            {child.religion && (
              <div>
                <p className="text-sm text-gray-500">Religion</p>
                <p className="font-medium text-gray-900">{child.religion}</p>
              </div>
            )}
          </div>
        </div>

        {/* Class Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-600" />
            Class Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Class</p>
              <p className="font-medium text-gray-900">{child.class.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Level</p>
              <p className="font-medium text-gray-900">{child.class.level}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Teacher</p>
              <p className="font-medium text-gray-900">
                {child.class.teacher.firstName} {child.class.teacher.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Teacher Contact</p>
              <p className="font-medium text-gray-900">{child.class.teacher.phone}</p>
              <p className="text-sm text-gray-600">{child.class.teacher.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Enrollment Date</p>
              <p className="font-medium text-gray-900">
                {new Date(child.enrollmentDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Medical & Health Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Medical Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-600" />
            Medical Information
          </h3>
          {child.medicalInfo ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-800">{child.medicalInfo}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No medical information on file</p>
          )}
        </div>

        {/* Allergies */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
            Allergies
          </h3>
          {child.allergies ? (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-gray-800 font-medium">{child.allergies}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No known allergies</p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-green-600" />
          Address & Contact
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Home Address</p>
            <p className="font-medium text-gray-900">{child.address}</p>
            <p className="text-gray-600">
              {child.city}, {child.state} {child.postcode}
            </p>
          </div>
          {child.emergencyContact && (
            <div>
              <p className="text-sm text-gray-500 mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Emergency Contact
              </p>
              <p className="font-medium text-gray-900">{child.emergencyContact}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
