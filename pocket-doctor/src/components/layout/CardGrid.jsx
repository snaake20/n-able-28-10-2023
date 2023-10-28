/* eslint-disable react/prop-types */
import map from 'lodash/map';
import { useAuthStore } from '../../store/auth/authStore';
import { UserRole } from '../../utils/constants';
import Modal from '../template/Modal';
import { usePrescriptionStore } from '../../store/prescriptions/prescriptionStore';

function Card({ item, type }) {
  const {
    user: { role },
  } = useAuthStore();

  const { editPrescription } = usePrescriptionStore();

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
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                document.getElementById('modal-card').showModal();
              }}
            >
              {role === UserRole.DOCTOR ? 'View' : 'Edit'}
            </button>
            <Modal id="card" onSubmit={editPrescription} edit_values={item} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CardGrid({ items, type }) {
  const {
    user: { role },
  } = useAuthStore();

  const { addPrescription } = usePrescriptionStore();

  return (
    <div className="w-full h-full px-5 py-5">
      {role === UserRole.PATIENT ? (
        <div className="w-full flex justify-end">
          <button
            className="btn btn-accent"
            type="button"
            onClick={() => {
              document.getElementById('modal-add').showModal();
            }}
          >
            Request {type}
          </button>
          <Modal id="add" onSubmit={addPrescription} />
        </div>
      ) : null}
      {items?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {map(items, (item) => {
            return <Card key={item?.prescription_id} item={item} type={type} />;
          })}
        </div>
      ) : (
        <p className="w-full h-full flex justify-center items-center">
          No items available
        </p>
      )}
    </div>
  );
}
