'use client';

import { useState, useEffect } from 'react';
import { X, Save, BookOpen, Users, User } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  status: string;
}

interface ClassFormData {
  name: string;
  level: string;
  capacity: string;
  description: string;
  schedule: string;
  room: string;
  teacherId: string;
  academicYear: string;
}

interface ClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClassFormData) => void;
  isLoading?: boolean;
  classData?: any;
  mode?: 'create' | 'edit';
}

export default function ClassForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  classData,
  mode = 'create'
}: ClassFormProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    level: '',
    capacity: '',
    description: '',
    schedule: '',
    room: '',
    teacherId: '',
    academicYear: new Date().getFullYear().toString(),
  });

  useEffect(() => {
    if (isOpen) {
      fetchTeachers();
      if (classData && mode === 'edit') {
        setFormData({
          name: classData.name || '',
          level: classData.level || '',
          capacity: classData.capacity?.toString() || '',
          description: classData.description || '',
          schedule: classData.schedule || '',
          room: classData.room || '',
          teacherId: classData.teacherId || '',
          academicYear: classData.academicYear || new Date().getFullYear().toString(),
        });
      }
    }
  }, [isOpen, classData, mode]);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers?status=ACTIVE');
      if (response.ok) {
        const data = await response.json();
        setTeachers(data.filter((teacher: Teacher) => teacher.status === 'ACTIVE'));
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleInputChange = (field: keyof ClassFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    return !!(formData.name && formData.level && formData.capacity && formData.room && formData.academicYear);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      level: '',
      capacity: '',
      description: '',
      schedule: '',
      room: '',
      teacherId: '',
      academicYear: new Date().getFullYear().toString(),
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const academicYears = Array.from({ length: 5 }, (_, i) => currentYear + i - 2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'edit' ? 'Edit Class' : 'Add New Class'}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="h-full">
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Rose Class, Sunflower Class"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Level</option>
                      <option value="Nursery 1">Nursery 1 (18-24 months)</option>
                      <option value="Nursery 2">Nursery 2 (2-3 years)</option>
                      <option value="Playgroup">Playgroup (3-4 years)</option>
                      <option value="Pre-K">Pre-K (4-5 years)</option>
                      <option value="Kindergarten 1">Kindergarten 1 (5-6 years)</option>
                      <option value="Kindergarten 2">Kindergarten 2 (6+ years)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="30"
                      placeholder="e.g., 20"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum number of students</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Academic Year <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.academicYear}
                      onChange={(e) => handleInputChange('academicYear', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {academicYears.map(year => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Schedule and Location */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Schedule & Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.room}
                      onChange={(e) => handleInputChange('room', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Room A1, Rainbow Room"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule
                    </label>
                    <select
                      value={formData.schedule}
                      onChange={(e) => handleInputChange('schedule', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Schedule</option>
                      <option value="Monday - Friday, 8:00 AM - 12:00 PM">Half Day (8:00 AM - 12:00 PM)</option>
                      <option value="Monday - Friday, 8:00 AM - 5:00 PM">Full Day (8:00 AM - 5:00 PM)</option>
                      <option value="Monday - Friday, 8:00 AM - 3:00 PM">Extended Morning (8:00 AM - 3:00 PM)</option>
                      <option value="Monday, Wednesday, Friday, 8:00 AM - 12:00 PM">MWF Half Day</option>
                      <option value="Tuesday, Thursday, 8:00 AM - 12:00 PM">T-Th Half Day</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Teacher Assignment */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Teacher Assignment
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Teacher
                  </label>
                  <select
                    value={formData.teacherId}
                    onChange={(e) => handleInputChange('teacherId', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">No teacher assigned</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName} ({teacher.employeeId})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    You can assign a teacher later if needed
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Brief description of the class, special focus areas, or notes..."
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t bg-gray-50 space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!validateForm()}
            >
              <Save className="w-4 h-4 mr-2" />
              {mode === 'edit' ? 'Update Class' : 'Create Class'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}