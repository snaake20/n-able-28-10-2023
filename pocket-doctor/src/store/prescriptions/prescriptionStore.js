import { create } from 'zustand';
import { database } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const usePrescriptionStore = create((set) => ({
  prescriptions: [],
  addPrescription: (prescription) => {
    set((state) => ({ prescriptions: [...state.prescriptions, prescription] }));
  },
  getPrescriptionsFromFirebase: async () => {
    const querySnapshot = await getDocs(collection(database, 'prescriptions'));
    console.log(querySnapshot);
    let prescriptions = [];
    querySnapshot.forEach((doc) => {
      const prescription = doc.data();
      prescriptions.push(prescription);
    });
    set({ prescriptions });
  },
  editPrescription: (prescription) => {
    set((state) => ({
      prescriptions: state.prescriptions.map((item) =>
        item.id === prescription.id ? prescription : item
      ),
    }));
  },
}));
