import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  FileText, 
  Edit3, 
  Trash2, 
  Calendar,
  User,
  Stethoscope,
  Pill,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useHealthRecords, HealthRecord } from '../hooks/useHealthRecords';
import { useAuth } from '../hooks/useAuth';

const HealthRecords: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { records, isLoading, error, addRecord, updateRecord, deleteRecord } = useHealthRecords();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    symptoms: '',
    diagnosis: '',
    prescriptions: ''
  });

  const resetForm = () => {
    setFormData({
      patientName: '',
      age: '',
      symptoms: '',
      diagnosis: '',
      prescriptions: ''
    });
    setShowAddForm(false);
    setEditingRecord(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName.trim() || !formData.age || !formData.symptoms.trim()) {
      return;
    }

    try {
      const recordData = {
        patientName: formData.patientName.trim(),
        age: parseInt(formData.age),
        symptoms: formData.symptoms.trim(),
        diagnosis: formData.diagnosis.trim(),
        prescriptions: formData.prescriptions.trim()
      };

      if (editingRecord) {
        await updateRecord(editingRecord.id!, recordData);
      } else {
        await addRecord(recordData);
      }
      
      resetForm();
    } catch (err) {
      console.error('Error saving record:', err);
    }
  };

  const handleEdit = (record: HealthRecord) => {
    setFormData({
      patientName: record.patientName,
      age: record.age.toString(),
      symptoms: record.symptoms,
      diagnosis: record.diagnosis,
      prescriptions: record.prescriptions
    });
    setEditingRecord(record);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('healthRecords.confirmDelete'))) {
      try {
        await deleteRecord(id);
      } catch (err) {
        console.error('Error deleting record:', err);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            {t('healthRecords.signInRequired')}
          </h3>
          <p className="text-gray-400">
            {t('healthRecords.signInToAccess')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-600 rounded-full p-3">
            <FileText className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {t('healthRecords.title')}
        </h2>
        <p className="text-gray-600">
          {t('healthRecords.subtitle')}
        </p>
      </div>

      {/* Add Record Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full md:w-auto bg-[#2b7a78] hover:bg-[#1e5a57] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>{t('healthRecords.addRecord')}</span>
        </button>
      </div>

      {/* Add/Edit Record Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingRecord ? t('healthRecords.editRecord') : t('healthRecords.addNewRecord')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('healthRecords.patientName')} *
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a78] focus:border-transparent transition-colors duration-200"
                  placeholder={t('healthRecords.enterPatientName')}
                  required
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('healthRecords.age')} *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a78] focus:border-transparent transition-colors duration-200"
                  placeholder={t('healthRecords.enterAge')}
                  min="1"
                  max="120"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
                {t('healthRecords.symptoms')} *
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a78] focus:border-transparent transition-colors duration-200 resize-none"
                rows={3}
                placeholder={t('healthRecords.enterSymptoms')}
                required
              />
            </div>

            <div>
              <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-2">
                {t('healthRecords.diagnosis')}
              </label>
              <textarea
                id="diagnosis"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a78] focus:border-transparent transition-colors duration-200 resize-none"
                rows={3}
                placeholder={t('healthRecords.enterDiagnosis')}
              />
            </div>

            <div>
              <label htmlFor="prescriptions" className="block text-sm font-medium text-gray-700 mb-2">
                {t('healthRecords.prescriptions')}
              </label>
              <textarea
                id="prescriptions"
                name="prescriptions"
                value={formData.prescriptions}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2b7a78] focus:border-transparent transition-colors duration-200 resize-none"
                rows={3}
                placeholder={t('healthRecords.enterPrescriptions')}
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-[#2b7a78] hover:bg-[#1e5a57] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                {editingRecord ? t('healthRecords.updateRecord') : t('healthRecords.saveRecord')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">{t('common.error')}</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#2b7a78] mx-auto mb-2" />
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      )}

      {/* Records List */}
      <div className="space-y-4">
        {records.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              {t('healthRecords.noRecords')}
            </h3>
            <p className="text-gray-400">
              {t('healthRecords.addFirstRecord')}
            </p>
          </div>
        ) : (
          records.map((record) => (
            <div
              key={record.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {record.patientName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t('healthRecords.ageLabel')}: {record.age} {t('healthRecords.years')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(record)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-200"
                    title={t('common.edit')}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(record.id!)}
                    className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors duration-200"
                    title={t('common.delete')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Stethoscope className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {t('healthRecords.symptoms')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                    {record.symptoms}
                  </p>
                </div>

                {record.diagnosis && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {t('healthRecords.diagnosis')}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                      {record.diagnosis}
                    </p>
                  </div>
                )}
              </div>

              {record.prescriptions && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Pill className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {t('healthRecords.prescriptions')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                    {record.prescriptions}
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  {t('healthRecords.createdOn')}: {record.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HealthRecords;