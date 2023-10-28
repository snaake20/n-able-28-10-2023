import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../store/auth/authStore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';

const signInSchema = Yup.object().shape({
  email: Yup.string()
    .email('A valid email is required')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function SignIn() {
  const { saveUser } = useAuthStore();

  const [authError, setAuthError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: signInSchema,
    onSubmit: async (values) => {
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          // save accessToken

          const usersCollection = collection(database, 'users');
          const q = query(usersCollection, where('email', '==', values.email));

          try {
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              // Assuming there is only one user with the given email
              const userDocument = querySnapshot.docs[0].data();
              userDocument.id = querySnapshot.docs[0].id;
              saveUser(userDocument);
            }
          } catch (error) {
            console.error('Error querying Firestore:', error);
            throw error;
          }
        })
        .catch((error) => {
          setAuthError(error.message);
        });

      // saveUser(newUser);
    },
  });

  return (
    <>
      <h2 className="text-center mb-3">Sign Up</h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2">
        <div className="form-control w-full max-w-xs">
          <label htmlFor="email" className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            id="email"
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={formik.values.email}
            onChange={formik.handleChange}
          />

          <span className="text-red-500 h-3  text-xs">
            {formik.errors.email}
          </span>
        </div>

        <div className="form-control w-full max-w-xs">
          <label htmlFor="password" className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={formik.values.password}
            onChange={formik.handleChange}
          />

          <span className="text-red-500 h-3  text-xs">{authError}</span>
        </div>
        <span></span>
        <button type="submit" className="btn w-full mt-3 btn-primary">
          Sign In
        </button>
      </form>
    </>
  );
}
