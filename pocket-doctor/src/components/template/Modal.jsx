/* eslint-disable react/prop-types */
import { Field, Formik, Form } from 'formik';
import * as Yup from 'yup';
import map from 'lodash/map';
import { Status, UserRole, conditions } from '../../utils/constants';
import { useRef } from 'react';
import { useAuthStore } from '../../store/auth/authStore';
import { v4 as uuidv4 } from 'uuid';
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { database } from '../../config/firebase';

const schema = Yup.object().shape({
  custom_name: Yup.string()
    .required('The reason is required')
    .min(5, 'Should have at least 5 characters')
    .trim('No trailing spaces')
    .strict(true),
  reason: Yup.string()
    .required('The reason is required')
    .min(5, 'Should have at least 5 characters')
    .trim('No trailing spaces')
    .strict(true),
  medical_condition: Yup.string().required('The reason is required'),
});

export default function Modal({ id, onSubmit, edit_values }) {
  const {
    user: { role },
  } = useAuthStore();

  const ref = useRef(null);
  return (
    <dialog ref={ref} id={`modal-${id}`} className="modal">
      <div className="modal-box">
        <Formik
          initialValues={{
            custom_name: edit_values?.title ?? '',
            reason: edit_values?.reason ?? '',
            medical_condition: edit_values?.condition ?? '',
          }}
          validationSchema={schema}
          onSubmit={async (values) => {
            if (edit_values) {
              const editedPrescription = {
                ...edit_values,
                title: values.custom_name,
                condition: values.medical_condition,
                reason: values.reason,
              };
              // save to firebase
              onSubmit(editedPrescription);
              ref.current.close();
              return;
            }
            const newPrescription = {
              prescription_id: uuidv4(),
              title: values.custom_name,
              condition: values.medical_condition,
              reason: values.reason,
              creation_date: new Date().toLocaleString(),
              status: Status.PENDING,
            };
            onSubmit(newPrescription);
            await addDoc(
              collection(database, 'prescriptions'),
              newPrescription
            );
            ref.current.close();
          }}
        >
          {() => {
            return (
              <Form className="flex flex-col gap-5">
                <Field
                  className="flex-1 p-5"
                  name="custom_name"
                  component="input"
                  type="text"
                  placeholder="Please give a name for ease of finding"
                  disabled={role === UserRole.DOCTOR}
                />
                <Field
                  className="flex-1 p-5"
                  name="reason"
                  component="textarea"
                  placeholder="Please give a reason for the request"
                  disabled={role === UserRole.DOCTOR}
                />
                <Field
                  className="flex-1 p-5"
                  name="medical_condition"
                  component="select"
                  disabled={role === UserRole.DOCTOR}
                >
                  <option value="">Please select a condition</option>
                  {map(conditions.split(','), (condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </Field>
                {!edit_values && role === UserRole.PATIENT ? (
                  <button className="btn btn-accent" type="submit">
                    Request
                  </button>
                ) : null}
                {edit_values && role === UserRole.PATIENT ? (
                  <button className="btn btn-accent" type="submit">
                    Edit
                  </button>
                ) : edit_values && role === UserRole.DOCTOR ? (
                  <div className="flex justify-between">
                    <button
                      className="btn btn-error"
                      type="button"
                      onClick={async () => {
                        // save to firebase
                        onSubmit({ ...edit_values, status: Status.REJECTED });
                        ref.current.close();
                      }}
                    >
                      Reject
                    </button>
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={async () => {
                        // save to firebase
                        onSubmit({ ...edit_values, status: Status.ACCEPTED });
                        ref.current.close();
                      }}
                    >
                      Accept
                    </button>
                  </div>
                ) : null}
              </Form>
            );
          }}
        </Formik>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
