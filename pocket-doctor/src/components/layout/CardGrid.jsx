/* eslint-disable react/prop-types */
import map from 'lodash/map';
import { useAuthStore } from '../../store/auth/authStore';
import { UserRole } from '../../utils/constants';

function Card({ item, type }) {
  const {
    user: { role },
  } = useAuthStore();
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{item?.title}</h2>
        <p>
          Medical Condition: <span>{item?.condition}</span>
        </p>
        <p>
          Creation date: <span>{item?.creation_date}</span>
        </p>
        <p>
          Status: <span>{item?.status}</span>
        </p>
        <div className="card-actions">
          <div className="justify-start">
            {role === UserRole.PATIENT && item?.document ? (
              <a href={item?.document} download>
                View {type}
              </a>
            ) : null}
          </div>
          <div className="justify-end">
            <button className="btn btn-primary">
              {role === UserRole.DOCTOR ? 'View' : 'Edit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CardGrid({ items, type }) {
  return (
    <div>
      {map(items, (item) => {
        return <Card item={item} type={type} />;
      })}
    </div>
  );
}
