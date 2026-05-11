'use client';

import { useState, useEffect } from 'react';
import { X, Save, DollarSign, User, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  class?: {
    name: string;
    level: string;
  };
}

interface FeeFormData {
  type: string;
  description: string;
  amount: string;
  dueDate: string;
  studentId: string;
  notes: string;
}

interface FeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeeFormData) => void;
  isLoading?: boolean;
  fee?: any;
  mode?: 'create' | 'edit';
}

export default function FeeForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  fee,
  mode = 'create'
}: FeeFormProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState<FeeFormData>({
    type: '',
    description: '',
    amount: '',
    dueDate: '',
    studentId: '',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
      if (fee && mode === 'edit') {
        setFormData({
          type: fee.type || '',
          description: fee.description || '',
          amount: fee.amount?.toString() || '',
          dueDate: fee.dueDate ? fee.dueDate.split('T')[0] : '',
          studentId: fee.studentId || '',
          notes: fee.notes || '',
        });
      } else {
        // Set default due date to next month
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setFormData(prev => ({
          ...prev,
          dueDate: nextMonth.toISOString().split('T')[0],
        }));
      }
    }
  }, [isOpen, fee, mode]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students?status=ACTIVE');
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleInputChange = (field: keyof FeeFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    return !!(formData.type && formData.description && formData.amount && formData.dueDate && formData.studentId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const resetForm = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setFormData({
      type: '',
      description: '',
      amount: '',
      dueDate: nextMonth.toISOString().split('T')[0],
      studentId: '',
      notes: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const feeTypes = [
    { value: 'TUITION', label: 'Tuition Fee' },
    { value: 'REGISTRATION', label: 'Registration Fee' },
    { value: 'ACTIVITY', label: 'Activity Fee' },
    { value: 'TRANSPORT', label: 'Transportation' },
    { value: 'MEAL', label: 'Meal Plan' },
    { value: 'UNIFORM', label: 'Uniform & Supplies' },
    { value: 'BOOKS', label: 'Books & Materials' },
    { value: 'MEDICAL', label: 'Medical & Insurance' },
    { value: 'OTHER', label: 'Other' },
  ];

  const commonDescriptions = {
    TUITION: [
      'Monthly Tuition Fee',
      'Quarterly Tuition Fee',
      'Term Tuition Fee',
      'Annual Tuition Fee',
    ],
    REGISTRATION: [
      'New Student Registration',
      'Annual Registration Fee',
      'Re-enrollment Fee',
    ],
    ACTIVITY: [
      'Field Trip Fee',
      'Sports Day Registration',
      'Arts & Crafts Materials',
      'Music Lesson Fee',
      'Swimming Class Fee',
    ],
    TRANSPORT: [
      'Monthly Bus Service',
      'Weekly Transportation',
      'Field Trip Transport',
    ],
    MEAL: [
      'Monthly Meal Plan',
      'Weekly Lunch Program',
      'Snack Plan',
    ],
    UNIFORM: [
      'School Uniform Set',
      'PE Uniform',
      'School Supplies Kit',
      'Backpack & Stationery',
    ],
    BOOKS: [
      'Textbooks & Workbooks',
      'Reading Materials',
      'Learning Resources',
    ],
    MEDICAL: [
      'Health Insurance',
      'Medical Checkup',
      'First Aid Kit',
    ],
    OTHER: [
      'Late Payment Fee',
      'Extra Class Fee',
      'Special Event Fee',
    ],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'edit' ? 'Edit Fee' : 'Add New Fee'}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="h-full">
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-6">
              {/* Student Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Student Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Student <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName} ({student.studentId})
                        {student.class && ` - ${student.class.name}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fee Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Fee Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fee Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Fee Type</option>
                      {feeTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (RM) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  required
                >
                  <option value="">Select or type custom description</option>
                  {formData.type && commonDescriptions[formData.type as keyof typeof commonDescriptions]?.map(desc => (
                    <option key={desc} value={desc}>
                      {desc}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Or enter custom description"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select from dropdown or type your own description
                </p>
              </div>

              {/* Due Date */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Payment Schedule
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Any additional information about this fee, payment instructions, etc..."
                />
              </div>

              {/* Fee Summary */}
              {formData.studentId && formData.amount && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Fee Summary</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p>
                      <span className="font-medium">Student:</span>{' '}
                      {students.find(s => s.id === formData.studentId)?.firstName}{' '}
                      {students.find(s => s.id === formData.studentId)?.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Fee Type:</span>{' '}
                      {feeTypes.find(t => t.value === formData.type)?.label}
                    </p>
                    <p>
                      <span className="font-medium">Amount:</span> RM {formData.amount}
                    </p>
                    <p>
                      <span className="font-medium">Due Date:</span>{' '}
                      {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                </div>
              )}
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
              {mode === 'edit' ? 'Update Fee' : 'Create Fee'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}