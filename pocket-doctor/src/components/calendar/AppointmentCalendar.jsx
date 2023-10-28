import { useFormik } from 'formik';
import React, { useMemo, useRef, useState } from 'react'

import * as Yup from 'yup';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuthStore } from '../../store/auth/authStore';
import { addDoc, collection, doc } from 'firebase/firestore';
import { database } from '../../config/firebase';

const months = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
]

const appointmentValidation = Yup.object({
    reason: Yup.string().min(10, "Reason must be at least 10 characters long").required('You must have a reason for appointment'),
    intervals: Yup.array().test("notEmpty", "You must select at least an interval", (value) => value && value.length > 0)
  });

function AppointmentCalendar() {
    const { user } = useAuthStore()

  const currentDate = useMemo(() => {
    new Date()
  })

  const appointmentModal = useRef()

  const [showToast, setShowToast] = useState(false)

  const formik = useFormik({
    initialValues: {
        reason: "",
        intervals: []
    },
    validationSchema: appointmentValidation,
    onSubmit: async (values) => {
        const userDocRef = doc(database, "users", user.id)
        try{
            await addDoc(collection(database, "appointments"), {
                reason: values.reason,
                intervals: values.intervals,
                userRef: userDocRef
               })
               appointmentModal.current.close()

               setShowToast(true)

               setTimeout(() => {
                setShowToast(false)
               }, 3000)
        }catch(error){
            console.log(error)
        }
    }
  })

  const [selectedDate, setSelectedDate] = useState(new Date())

  const [intervals, setIntervals] = useState([])
  const durations = 30
  
  function generateIntervalsDay(date){
      const copyDate = new Date(date)
      copyDate.setHours(0, 0, 0, 0)
  
      const generatedIntervals = []
      for(let i = 0; i < 48; i++){
          const random = Math.random()
  
          const startTime = new Date(copyDate)
          const endTime = new Date(copyDate)
          endTime.setMinutes(copyDate.getMinutes() + durations)
  
          if(random >= 0.8 && copyDate > new Date()){
              generatedIntervals.push({
                  start: startTime,
                  end: endTime,
                  seleted: false
              })
          }  
          
        copyDate.setMinutes(copyDate.getMinutes() + 30)
      }

      setIntervals(generatedIntervals)
  }

  function handleDaySelect(value, event){
    setSelectedDate(value)
    appointmentModal.current.showModal()
    generateIntervalsDay(value)
  }

  function selectInterval(index){
    const newIntervals = [...intervals]
    newIntervals[index].selected = !newIntervals[index].selected

    setIntervals(newIntervals)

    let selectedIntervals = newIntervals.filter((currentInterval) => currentInterval.selected === true)

    formik.setFieldValue("intervals", selectedIntervals)
  }

  return (
    <div>
        <Calendar 
        activeStartDate={currentDate}
        defaultView="month"
        locale="ro"
        onClickDay={handleDaySelect}
        />

        <dialog id="appointment-modal" ref={appointmentModal} className="modal">
        <div className="modal-box">
            <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg">Appointment {selectedDate.getDate()} {months[selectedDate.getMonth()]}</h3>
            
            <form onSubmit={formik.handleSubmit}>
                <div className="form-control">
                    <label htmlFor="reason" className="label">
                        <span className="label-text">Reason</span>
                    </label>
                    <textarea id="reason" className="textarea textarea-bordered" placeholder="Type"
                    value={formik.values.reason}
                    onChange={formik.handleChange}
                    ></textarea>

                    <span className="text-red-500 h-3 text-xs">
                        {formik.errors.reason}
                    </span>
                </div>

                <div className="form-control items-center">
                    {intervals.length > 0 ? <>
                        <label className="label">
                        <span className="label-text">Intervals</span>
                    </label>

                    {intervals.map((interval, index) => {
                        let startHours = interval.start.getHours()
                        let startMinutes = interval.start.getMinutes()
                        let endHours = interval.end.getHours()
                        let endMinutes = interval.end.getMinutes() 

                        if(startHours < 10){
                            startHours = `0${startHours}`
                        }

                        if(startMinutes < 10){
                            startMinutes = `0${startMinutes}`
                        }

                        if(endHours < 10){
                            endHours = `0${endHours}`
                        }

                        if(endMinutes < 10){
                            endMinutes = `0${endMinutes}`
                        }

                        return <div key={interval.start} onClick={() => selectInterval(index)} className={`bg-blue-500 text-white w-fit p-3 rounded-lg mb-2 hover:cursor-pointer ${interval.selected === true ? "bg-blue-800" : ""}`}>{`${startHours}:${startMinutes} - ${endHours}:${endMinutes}`}</div>
                    })}
                    </>
                    :
                    <p className="mt-2">No intervals</p>
                    }
                    
                    <span className="text-red-500 h-3 text-xs">
                        {intervals.length > 0 && formik.errors.intervals}
                    </span>
                    
                    <button type="submit" className="btn mt-4">Request appointment</button>
                </div>
            </form>
        </div>
        </dialog>

        {showToast && <div className="toast toast-top toast-end">
            <div className="alert alert-success">
                <span>Appointment request was sent</span>
            </div>
        </div>}
    </div>
  )
}

export default AppointmentCalendar