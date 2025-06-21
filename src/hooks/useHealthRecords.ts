import { useState, useEffect } from 'react';
import { 
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './useAuth';

export interface HealthRecord {
  id?: string;
  patientName: string;
  age: number;
  symptoms: string;
  diagnosis: string;
  prescriptions: string;
  createdAt: Date;
  userId: string;
}

export const useHealthRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch health records for the current user
  const fetchRecords = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Simple query without orderBy to avoid index requirement
      const q = query(
        collection(db, 'healthRecords'),
        where('userId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedRecords: HealthRecord[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedRecords.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate()
        } as HealthRecord);
      });
      
      // Sort in memory instead of using Firestore orderBy
      fetchedRecords.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setRecords(fetchedRecords);
    } catch (err) {
      setError('Failed to fetch health records');
      console.error('Error fetching records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new health record
  const addRecord = async (record: Omit<HealthRecord, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) throw new Error('User not authenticated');

    setIsLoading(true);
    setError(null);

    try {
      const newRecord = {
        ...record,
        userId: user.uid,
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'healthRecords'), newRecord);
      
      // Add to local state
      const addedRecord: HealthRecord = {
        id: docRef.id,
        ...record,
        userId: user.uid,
        createdAt: new Date()
      };
      
      setRecords(prev => [addedRecord, ...prev]);
    } catch (err) {
      setError('Failed to add health record');
      console.error('Error adding record:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a health record
  const updateRecord = async (id: string, updates: Partial<HealthRecord>) => {
    if (!user) throw new Error('User not authenticated');

    setIsLoading(true);
    setError(null);

    try {
      const recordRef = doc(db, 'healthRecords', id);
      await updateDoc(recordRef, updates);
      
      // Update local state
      setRecords(prev => 
        prev.map(record => 
          record.id === id ? { ...record, ...updates } : record
        )
      );
    } catch (err) {
      setError('Failed to update health record');
      console.error('Error updating record:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a health record
  const deleteRecord = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    setIsLoading(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'healthRecords', id));
      
      // Remove from local state
      setRecords(prev => prev.filter(record => record.id !== id));
    } catch (err) {
      setError('Failed to delete health record');
      console.error('Error deleting record:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch records when user changes
  useEffect(() => {
    if (user) {
      fetchRecords();
    } else {
      setRecords([]);
    }
  }, [user]);

  return {
    records,
    isLoading,
    error,
    addRecord,
    updateRecord,
    deleteRecord,
    refetch: fetchRecords
  };
};