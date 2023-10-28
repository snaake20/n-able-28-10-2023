import CardGrid from '../components/layout/CardGrid';
import { CardType } from '../utils/constants';

export default function Referrals() {
  const items = [];
  return <CardGrid items={items} type={CardType.REFERRAL} />;
}
