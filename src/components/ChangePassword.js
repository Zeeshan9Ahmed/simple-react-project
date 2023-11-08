import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updatePassword } from '../store/featureActions'
 const ChangePassword = ({ closeModal }) => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [isSecureEntry, setisSecureEntry] = useState(true)
  const [isSecureEntry2, setisSecureEntry2] = useState(true)
  const [isSecureEntry3, setisSecureEntry3] = useState(true)
  const dispatch = useDispatch()
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = {
        body: { currentPassword, newPassword, confirmNewPassword },
        params: false,
        isToast:true
      }
      await dispatch(updatePassword(payload)).unwrap()
      closeModal()
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (rejectedValueOrSerializedError) {
      console.log(rejectedValueOrSerializedError);
    }
  }

  return (
    <div className='change-password-modal' id="exampleModalCenter" tabIndex={-1} aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style={{ display: "block", zIndex: 100 }}>
      <p className="pass-text">Change Password</p>
      <button onClick={closeModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
      <div className="modal-body">
        <form onSubmit={handleSubmit}>
          <div className="pass-form-wrap">
            <div className="fieldBox mb-2">
              <input type={isSecureEntry ? "password" : "text"} placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              <span><i className={isSecureEntry ? "fas fa-eye" : "fas fa-eye-slash"} onClick={() => { setisSecureEntry((prev) => !prev) }} /></span>
            </div>
            <div className="fieldBox mb-3">
              <input type={isSecureEntry2 ? "password" : "text"} placeholder="Enter New Password" value={newPassword} id="password" onChange={(e) => setNewPassword(e.target.value)} />
              <span><i className={isSecureEntry2 ? "fas fa-eye" : "fas fa-eye-slash"} onClick={() => { setisSecureEntry2((prev) => !prev) }} /></span>
            </div>
            <div className="fieldBox mb-3">
              <input type={isSecureEntry3 ? "password" : "text"} placeholder="Confirm New Password" value={confirmNewPassword} id="cpassword" onChange={(e) => setConfirmNewPassword(e.target.value)} />
              <span><i className={isSecureEntry3 ? "fas fa-eye" : "fas fa-eye-slash"} onClick={() => { setisSecureEntry3((prev) => !prev) }} /></span>
            </div>
            <div className="login-button mt-2">
              <button type="submit" className="excel-btn col-reds w-10 pt-2 pb-2" style={{ backgroundColor: "rgba(0, 69, 139,0.8)" }}  >Update</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword