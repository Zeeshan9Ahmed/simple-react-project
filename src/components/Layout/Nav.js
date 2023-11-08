import React, { useContext, useState, useEffect } from 'react'
import { context } from '../../context/context';
import {persistor}from "../../store"
 import { useDispatch, useSelector } from 'react-redux'
import { getProfile } from "../../store/slices/userSlice"
import {
  useNavigate
} from "react-router-dom";
import ChangePassword from '../ChangePassword';
import Modal from 'react-modal';
import Tooltip from '@mui/material/Tooltip';
import { useProSidebar } from 'react-pro-sidebar';
import { userLogout } from '../../store/featureActions';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    width: "30%",
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
Modal.setAppElement('#root');
const Nav = () => {
  const { collapseSidebar } = useProSidebar();
  const { toggleSidebar } = useProSidebar();

  const { SetToggleButton } = useContext(context);
  const [modalIsOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const profile = useSelector(getProfile)
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  const handleLogout = async () => {
    try {
      let payload = {
        body: false,
        params: false,
        isToast:true
      }
      await dispatch(userLogout(payload)).unwrap()
      navigate("/")
      persistor.purge().then(() => { 
        console.log('Persisted storage cleared successfully');
    }).catch((error) => {
        console.log('Error occurred while clearing persisted storage:', error);
    });
    } catch (rejectedValueOrSerializedError) {
      console.log(rejectedValueOrSerializedError)
    }
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <div id="content" >
        <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0">
          <div className="navbar-menu-wrapper d-flex align-items-stretch">
            <div className="left-menu">
              <img src='/assets/images/left-menu.png' alt="" onClick={() => { windowSize[0] < 768 ? toggleSidebar() : collapseSidebar() }} className="img-fluid mobile-toggle" />
            </div>
            <ul className="navbar-nav navbar-nav-right">
              <li className="nav-item nav-profile dropdown-wrapper dropdown">
                <a className="nav-link dropdown-toggle" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <div className="nav-profile-img">
                    <i className="fa fa-duotone fa-user" aria-hidden="true"></i>
                    <span className="availability-status online" />
                  </div>
                  <div className="nav-profile-text">
                    <p className="mb-1 mr-3 text-black">{profile?.name}</p>
                  </div>
                </a>
                <div className="dropdown-menu navbar-dropdown drop-down" aria-labelledby="profileDropdown">
                  <div className="dropdown-divider" />
                  <a onClick={openModal} className="dropdown-item" >
                    <i className="mdi  mdi-lock-reset me-2 text-success" /> Change Password </a>
                  <a onClick={() => handleLogout()} className="dropdown-item" >
                    <i className="mdi mdi-logout me-2 text-success" /> Signout </a>
                </div>
              </li>
              <li className="nav-item nav-logout d-lg-block">
                <a onClick={() => handleLogout()} className="nav-link " >
                  <Tooltip title="Sign Out">
                    <i className="mdi mdi-power" />
                  </Tooltip>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <Modal
        closeTimeoutMS={500}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Change Password"
      >
        <ChangePassword closeModal={closeModal} />
      </Modal>
    </>
  )
}

export default Nav