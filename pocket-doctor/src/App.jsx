/* eslint-disable react/prop-types */
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import map from 'lodash/map';
import routes from './app/routes.config';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { APP_ROUTES } from './app/routes';
import { UserRole } from './utils/constants';
import Auth from './pages/Auth';
import NavWrapper from './components/layout/NavWrapper';
import { useAuthStore } from './store/auth/authStore';

function RoleCheckOutlet({ route }) {
  // take user role from store
  // replace under this line

  // const {
  //   user: { role: userRole },
  // } = useAuthStore();
  const userRole = UserRole.DOCTOR;

  if (!route.roles || route?.roles?.length === 0) return <Outlet />;

  const hasRole = route?.roles?.some((role) => userRole === role);

  return hasRole ? <Outlet /> : <Navigate replace to={APP_ROUTES.not_found} />;
}

function ProtectedRoutes() {
  return (
    <NavWrapper>
      <Routes>
        {map(routes, (route, idx) => (
          <Route
            key={`app-route-${idx}`}
            element={<RoleCheckOutlet route={route} />}
          >
            <Route
              {...route}
              element={
                <>
                  <Helmet>
                    <title>{route?.headTitle}</title>
                  </Helmet>
                  <route.element {...route} />
                </>
              }
            />
          </Route>
        ))}
      </Routes>
    </NavWrapper>
  );
}

export default function App() {
  // use isLoading from react-query, role and other data for the user

  // const {
  //   user: { role },
  //   isLoggedIn,
  // } = useAuthStore();


  const role = UserRole.DOCTOR;

  function loadingHandler(next, fallback) {
    // if (isLoggedIn) return next;
    // return fallback;
    return next;
  }

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={loadingHandler(
              <Navigate
                to={
                  role === UserRole.DOCTOR
                    ? APP_ROUTES.referrals
                    : APP_ROUTES.appointments
                }
                replace
              />,
              <Auth />
            )}
          />
          <Route
            path="/*"
            element={loadingHandler(
              <ProtectedRoutes />,
              <Navigate to="/" replace />
            )}
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
