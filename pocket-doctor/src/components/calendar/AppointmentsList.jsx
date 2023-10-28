import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { database } from '../../config/firebase'
import { useAuthStore } from '../../store/auth/authStore'

function AppointmentsList() {
  const { user } = useAuthStore()
  const [userAppointments, setUserAppointments] = useState([])

    useEffect(() => {
        const userRef = doc(database, "users", user.id);
        const q = query(collection(database, "appointments"), where("userRef", "==", userRef));
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const changedData = change.doc.data();
            const appointmentIndex = userAppointments.findIndex((appointment) => appointment.id === change.doc.id);
    
            if (change.type === "added") {
              setUserAppointments((prevAppointments) => [changedData, ...prevAppointments]);
            } else if (change.type === "modified" && appointmentIndex !== -1) {
              setUserAppointments((prevAppointments) => {
                const newAppointments = [...prevAppointments];
                newAppointments[appointmentIndex] = changedData;
                return newAppointments;
              });
            } else if (change.type === "removed" && appointmentIndex !== -1) {
              setUserAppointments((prevAppointments) =>
                prevAppointments.filter((appointment) => appointment.id !== change.doc.id)
              );
            }
          });
        });
    
        return () => unsubscribe();
      }, [user.id]);
  

  return (
    <div className="mt-[5vh]">
        <h2 className="text-lg text-center font-semibold mb-4">Your appointments</h2>

        <div className="flex flex-col items-center gap-3">
            {userAppointments?.map((appointment, index1) => {
                const currentIntervals = appointment.intervals
                return <div key={index1} className="border border-solid border-black flex flex-col items-center p-4 rounded-lg">
                    <p className="text-center mb-1">{appointment.reason}</p>

                    <div className="flex gap-2">
                        {currentIntervals.map((currInterval, index2) => {
                            const startDate = currInterval.start.toDate()
                            const endDate = currInterval.end.toDate()

                            let startHours = startDate.getHours()
                            let startMinutes = startDate.getMinutes()
                            let endHours = endDate.getHours()
                            let endMinutes = endDate.getMinutes() 

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


                            return <div 
                            key={index2} className="badge badge-accent">{`${startHours}:${startMinutes} - ${endHours}:${endMinutes}`}</div>
                        })}
                    </div>
                </div>
            })}
        </div>
    </div>
  )
}

export default AppointmentsList