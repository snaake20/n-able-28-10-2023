import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { database, auth } from '../config/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useAuthStore } from '../store/auth/authStore';
import { UserRole } from '../utils/constants';

const signUpValidation = Yup.object({
  accountType: Yup.string().required('You must select an account type'),
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters long')
    .required('Name required'),
  email: Yup.string().email('Invalid email address').required('Email required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password required'),
});

function SignUp() {
  const { saveUser } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      accountType: '',
      name: '',
      email: '',
      password: '',
    },
    validationSchema: signUpValidation,
    onSubmit: async (values) => {
      await createUserWithEmailAndPassword(auth, values.email, values.password);

      const newUser = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.accountType.toUpperCase(),
      };

      const userRef = await addDoc(collection(database, 'users'), newUser);
      newUser.id = userRef.id

      delete newUser.password;

      saveUser(newUser);
    },
  });

  return (
    <>
      <h2 className="text-center mb-3">Sign Up</h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2">
        <div className="form-control w-full max-w-xs">
          <label htmlFor="account-type" className="label">
            <span className="label-text">Account type</span>
          </label>
          <select
            id="account-type"
            name="accountType"
            className="select select-bordered w-full max-w-xs"
            value={formik.values.accountType}
            onChange={formik.handleChange}
          >
            <option disabled value="" label="Select an option" />
            <option value={UserRole.DOCTOR}>Doctor</option>
            <option value={UserRole.PATIENT}>Patient</option>
          </select>

          <span className="text-red-500 h-3  text-xs">
            {formik.errors.accountType}
          </span>
        </div>

        <div className="form-control w-full max-w-xs">
          <label htmlFor="name" className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={formik.values.name}
            onChange={formik.handleChange}
          />

          <span className="text-red-500 h-3 text-xs">{formik.errors.name}</span>
        </div>

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

          <span className="text-red-500 h-3  text-xs">
            {formik.errors.password}
          </span>
        </div>

        <button type="submit" className="btn w-full mt-3 btn-primary">
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignUp;
