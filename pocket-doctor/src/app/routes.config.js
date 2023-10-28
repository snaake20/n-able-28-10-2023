import { APP_ROUTES } from './routes';
import Appointments from '../pages/Appointments';
import NotFound from '../pages/NotFound';
import Prescriptions from '../pages/Prescriptions';
import Profile from '../pages/Profile';
import Referrals from '../pages/Referrals';
import { UserRole } from '../utils/constants';

export default [
  {
    path: APP_ROUTES.appointments,
    element: Appointments,
    headTitle: 'PocketDoctor - Appointments',
    roles: [UserRole.DOCTOR, UserRole.PATIENT],
    title: 'Appointments',
  },
  {
    path: APP_ROUTES.referrals,
    element: Referrals,
    headTitle: 'PocketDoctor - Referrals',
    roles: [UserRole.DOCTOR, UserRole.PATIENT],
    title: 'Referrals',
  },
  {
    path: APP_ROUTES.prescriptions,
    element: Prescriptions,
    headTitle: 'PocketDoctor - Prescriptions',
    roles: [UserRole.DOCTOR, UserRole.PATIENT],
    title: 'Prescriptions',
  },
  {
    path: APP_ROUTES.profile,
    element: Profile,
    headTitle: 'PocketDoctor - My Profile',
    roles: [UserRole.DOCTOR, UserRole.PATIENT],
    title: 'My Profile',
  },
  {
    path: APP_ROUTES.not_found,
    element: NotFound,
    headTitle: 'PocketDoctor - Page not found',
  },
];
