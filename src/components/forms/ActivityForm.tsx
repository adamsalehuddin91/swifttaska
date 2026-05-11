'use client';

import { useState, useEffect } from 'react';
import { X, Save, Calendar, MapPin, Users, Clock, Star } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Class {
  id: string;
  name: string;
  level: string;
}

interface ActivityFormData {
  name: string;
  description: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  maxParticipants: string;
  classId: string;
}

interface ActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ActivityFormData) => void;
  isLoading?: boolean;
  activity?: any;
  mode?: 'create' | 'edit';
}

export default function ActivityForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  activity,
  mode = 'create'
}: ActivityFormProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [formData, setFormData] = useState<ActivityFormData>({
    name: '',
    description: '',
    type: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    maxParticipants: '',
    classId: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchClasses();
      if (activity && mode === 'edit') {
        const activityDate = new Date(activity.date);
        setFormData({
          name: activity.name || '',
          description: activity.description || '',
          type: activity.type || '',
          date: activityDate.toISOString().split('T')[0],
          time: activityDate.toTimeString().slice(0, 5),
          duration: activity.duration?.toString() || '',
          location: activity.location || '',
          maxParticipants: activity.maxParticipants?.toString() || '',
          classId: activity.classId || '',
        });
      } else {
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setFormData(prev => ({
          ...prev,
          date: tomorrow.toISOString().split('T')[0],
          time: '09:00',
        }));
      }
    }
  }, [isOpen, activity, mode]);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleInputChange = (field: keyof ActivityFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    return !!(formData.name && formData.type && formData.date && formData.time && formData.location);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const resetForm = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData({
      name: '',
      description: '',
      type: '',
      date: tomorrow.toISOString().split('T')[0],
      time: '09:00',
      duration: '',
      location: '',
      maxParticipants: '',
      classId: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const activityTypes = [
    { value: 'EDUCATIONAL', label: 'Educational', icon: Star },
    { value: 'RECREATIONAL', label: 'Recreational', icon: Calendar },
    { value: 'FIELD_TRIP', label: 'Field Trip', icon: MapPin },
    { value: 'SPORTS', label: 'Sports & Physical', icon: Users },
    { value: 'ARTS_CRAFTS', label: 'Arts & Crafts', icon: Star },
    { value: 'SPECIAL_EVENT', label: 'Special Event', icon: Calendar },
  ];

  const commonLocations = [
    'Main Classroom',
    'Activity Room',
    'Playground',
    'Music Room',
    'Art Studio',
    'Library',
    'Gymnasium',
    'Garden Area',
    'Outdoor Play Area',
    'Multi-purpose Hall',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'edit' ? 'Edit Activity' : 'Add New Activity'}
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
                  <Star className="w-5 h-5 mr-2" />
                  Activity Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Story Time, Nature Walk, Art & Craft Session"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Type</option>
                      {activityTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Class
                    </label>
                    <select
                      value={formData.classId}
                      onChange={(e) => handleInputChange('classId', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Classes</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} - {cls.level}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty if activity is open to all classes
                    </p>
                  </div>
                </div>
              </div>

              {/* Date, Time & Duration */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Duration</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                      <option value="180">3 hours</option>
                      <option value="240">4 hours</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Location & Participants */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Location & Capacity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Location</option>
                      {commonLocations.map(location => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                      <option value="Other">Other (specify below)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="50"
                      placeholder="Leave empty for unlimited"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional - limits how many children can join
                    </p>
                  </div>
                  {formData.location === 'Other' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Custom Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.location === 'Other' ? '' : formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Specify the location"
                        required
                      />
                    </div>
                  )}
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
                  rows={4}
                  placeholder="Describe the activity, what children will do, materials needed, learning objectives, etc..."
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
              {mode === 'edit' ? 'Update Activity' : 'Create Activity'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}