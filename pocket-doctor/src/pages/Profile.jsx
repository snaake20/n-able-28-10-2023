import { collection, getDocs, query, where } from "firebase/firestore"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { database } from "../config/firebase"

export default function Profile() {
    const formik = useFormik({
        initialValues: {
            address: "",
            age: 0,
            doctor: ""
        }
    })

    const [doctors, setDoctors] = useState([])

    useEffect(() => {
        const doctorsDB = []

        const queryDocs = query(collection(database, "users"), where("role", "==", "DOCTOR"))

        getDocs(queryDocs).then((querySnap) => {
            querySnap.docs.forEach((doc) => {
            doctorsDB.push({
                id: doc.id,
                ...doc.data()
            })
        })})

        setDoctors(doctorsDB)
    }, [])

    console.log(doctors)

    return <div className="flex justify-center items-center h-screen">
    <form className="min-w-[300px] w-[30vw]">
<div className="form-control w-full max-w-xs">
          <label htmlFor="account-type" className="label">
            <span className="label-text">Doctor</span>
          </label>
          <select
            id="account-type"
            name="accountType"
            className="select select-bordered w-full max-w-xs"
            value={formik.values.doctor}
            onChange={formik.handleChange}
          >
            <option disabled value="" label="Select an option" />
            {doctors.map((currentDoctor) => {
                return <option key={currentDoctor.id} value={currentDoctor.id}>{currentDoctor.name}</option>
            })}
          </select>

          <span className="text-red-500 h-3  text-xs">
            {formik.errors.doctor}
          </span>
        </div>

        <div className="form-control w-full max-w-xs">
          <label htmlFor="name" className="label">
            <span className="label-text">Address</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={formik.values.address}
            onChange={formik.handleChange}
          />

          <span className="text-red-500 h-3 text-xs">{formik.errors.address}</span>
        </div>

        <div className="form-control w-full max-w-xs">
          <label htmlFor="age" className="label">
            <span className="label-text">Age</span>
          </label>
          <input
            id="age"
            type="number"
            placeholder="Type here"
            min="1"
            max="100"
            className="w-full input input-bordered max-w-xs"
            value={formik.values.age}
            onChange={formik.handleChange}
          />

          <span className="text-red-500 h-3  text-xs">
            {formik.errors.age}
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
          Update profile
        </button>
    </form>
            
    </div>
}
