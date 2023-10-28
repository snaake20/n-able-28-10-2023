import { Link } from 'react-router-dom';
import map from 'lodash/map';
import routes from '../../app/routes.config';
import { APP_ROUTES } from '../../app/routes';

export default function NavWrapper({ children }) {
  // filter options based on roles
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {map(routes, (route) => {
            if (route.path === APP_ROUTES.not_found) return null;
            return (
              <li key={route.title}>
                <Link to={route?.path}>{route?.title}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
