import React, { useState, useEffect } from 'react';
import { Plus, Clock, Trash2, Bell, CheckCircle, AlertCircle } from 'lucide-react';

interface MedicineReminder {
  id: string;
  medicineName: string;
  time: string;
  isActive: boolean;
  createdAt: Date;
}

const MedicineReminders: React.FC = () => {
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [medicineName, setMedicineName] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load reminders from localStorage on component mount
  useEffect(() => {
    const savedReminders = localStorage.getItem('medicineReminders');
    if (savedReminders) {
      const parsed = JSON.parse(savedReminders);
      setReminders(parsed.map((reminder: any) => ({
        ...reminder,
        createdAt: new Date(reminder.createdAt)
      })));
    }
  }, []);

  // Save reminders to localStorage whenever reminders change
  useEffect(() => {
    localStorage.setItem('medicineReminders', JSON.stringify(reminders));
  }, [reminders]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Check for due reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTimeString = now.toTimeString().slice(0, 5); // HH:MM format

      reminders.forEach((reminder) => {
        if (reminder.isActive && reminder.time === currentTimeString) {
          // Show browser notification if permission granted
          if (Notification.permission === 'granted') {
            new Notification('Medicine Reminder', {
              body: `Time to take your ${reminder.medicineName}`,
              icon: '/favicon.ico'
            });
          } else {
            // Fallback to alert
            alert(`⏰ Medicine Reminder: Time to take your ${reminder.medicineName}`);
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders]);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const addReminder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medicineName.trim() || !reminderTime) {
      return;
    }

    const newReminder: MedicineReminder = {
      id: Date.now().toString(),
      medicineName: medicineName.trim(),
      time: reminderTime,
      isActive: true,
      createdAt: new Date()
    };

    setReminders(prev => [...prev, newReminder]);
    setMedicineName('');
    setReminderTime('');
    setShowAddForm(false);
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, isActive: !reminder.isActive }
          : reminder
      )
    );
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isReminderDue = (reminderTime: string) => {
    const currentTimeString = currentTime.toTimeString().slice(0, 5);
    return reminderTime === currentTimeString;
  };

  const sortedReminders = [...reminders].sort((a, b) => {
    // Sort by time, then by creation date
    if (a.time !== b.time) {
      return a.time.localeCompare(b.time);
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-600 rounded-full p-3">
            <Clock className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Medicine Reminders</h2>
        <p className="text-gray-600">
          Never miss a dose with smart medication reminders
        </p>
      </div>

      {/* Add Reminder Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full md:w-auto bg-[#2b7a78] hover:bg-[#1e5a57] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Reminder</span>
        </button>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Medicine Reminder</h3>
          <form onSubmit={addReminder} className="space-y-4">
            <div>
              <label htmlFor="medicineName" className="block text-sm font-medium text-gray-700 mb-2">
                Medicine Name
              </label>
              <input
                type="text"
                id="medicineName"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a78] focus:border-transparent transition-colors duration-200"
                placeholder="e.g., Paracetamol, Vitamin D"
                required
              />
            </div>

            <div>
              <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Time
              </label>
              <input
                type="time"
                id="reminderTime"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a78] focus:border-transparent transition-colors duration-200"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-[#2b7a78] hover:bg-[#1e5a57] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Add Reminder
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reminders List */}
      <div className="space-y-4">
        {sortedReminders.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No reminders set</h3>
            <p className="text-gray-400">Add your first medicine reminder to get started</p>
          </div>
        ) : (
          sortedReminders.map((reminder) => {
            const isDue = isReminderDue(reminder.time);
            
            return (
              <div
                key={reminder.id}
                className={`border rounded-xl p-4 transition-all duration-300 ${
                  isDue && reminder.isActive
                    ? 'border-red-300 bg-red-50 shadow-lg animate-pulse'
                    : reminder.isActive
                    ? 'border-green-200 bg-green-50 hover:shadow-md'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      isDue && reminder.isActive
                        ? 'bg-red-100 text-red-600'
                        : reminder.isActive
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isDue && reminder.isActive ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : (
                        <Bell className="h-5 w-5" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {reminder.medicineName}
                      </h4>
                      <p className={`text-sm ${
                        isDue && reminder.isActive
                          ? 'text-red-600 font-medium'
                          : 'text-gray-600'
                      }`}>
                        {formatTime(reminder.time)}
                        {isDue && reminder.isActive && ' - DUE NOW!'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className={`p-2 rounded-full transition-colors duration-200 ${
                        reminder.isActive
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={reminder.isActive ? 'Disable reminder' : 'Enable reminder'}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                      title="Delete reminder"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Current Time Display */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Current time: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Notification Permission Info */}
      {Notification.permission === 'denied' && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> Browser notifications are disabled. You'll receive alert popups instead. 
            To enable notifications, please allow them in your browser settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicineReminders;