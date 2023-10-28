import CardGrid from '../components/layout/CardGrid';
import { CardType } from '../utils/constants';

export default function Prescriptions() {
  const items = [];
  return <CardGrid items={items} type={CardType.PRESCRIPTION} />;
}
