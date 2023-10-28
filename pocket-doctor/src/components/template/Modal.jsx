export default function Modal() {
  // add formik
  return (
    <dialog id="modal" className="modal">
      <div className="modal-box">
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
