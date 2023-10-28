import { useEffect } from 'react';
import CardGrid from '../components/layout/CardGrid';
import { usePrescriptionStore } from '../store/prescriptions/prescriptionStore';
import { CardType } from '../utils/constants';

export default function Prescriptions() {
  const { prescriptions, getPrescriptionsFromFirebase } =
    usePrescriptionStore();

  useEffect(() => {
    async function fetchData() {
      await getPrescriptionsFromFirebase();
    }
    fetchData();
  }, [getPrescriptionsFromFirebase]);

  return <CardGrid items={prescriptions} type={CardType.PRESCRIPTION} />;
}
