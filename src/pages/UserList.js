import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getUserError, getUserStatus } from '../store/slices/userSlice';
import { CSVLink } from "react-csv";
import $ from "jquery"
import 'datatables.net'
import Modal from 'react-modal';
import { blockUnblock, deleteAccount, getAllUsers } from '../store/featureActions';
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        width: "30%",
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: 10
    },
};
Modal.setAppElement('#root');
const UserList = () => {
    const [id, setId] = useState()
    const dispatch = useDispatch()
    const [users, setUsers] = useState(null)
    const status = useSelector(getUserStatus)
    const error = useSelector(getUserError)
    const [userDetail, setUserDetail] = useState(null)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState()
    // var csvData = [
    //     ["Name", "Email", "Country", "Notification", "Verified"],
    // ]
    // users?.map((item) =>
    //     csvData.push([`${item?.name}`, `${item?.email}`, `${item?.country}`, `${item?.notification}`, `${item?.isVerified}`])
    // )

    function viewModal(item, type) {
        setIsOpen(true);
        if (type == "userDetail") {
            setUserDetail(item)
        } else if (type == "userImages") {
            setUserDetail(item)
        } else if (type == "delete") {
            setId(item)
        }
        setModalType(type)
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const accountDelete = async (id) => {
        try {
            let payload = {
                params: id,
                isToast: true
            }
            await dispatch(deleteAccount(payload)).unwrap()
            setIsOpen(false)
            $('#tableData')
                .DataTable().destroy();
            try {
                Users()
            } catch (rejectedValueOrSerializedError) {
                console.log(rejectedValueOrSerializedError)
            }
        } catch (rejectedValueOrSerializedError) {
            console.log(rejectedValueOrSerializedError)
        }
    }

    const blockUnblockAccount = async (id) => {
        try {
            let payload = {
                params: id,
                isToast: true
            }
            await dispatch(blockUnblock(payload)).unwrap()
            if (users) {
                $('#tableData')
                    .DataTable().destroy();
            }
            Users()
        } catch (rejectedValueOrSerializedError) {
            console.log(rejectedValueOrSerializedError)
        }
    }

    const Users = async () => {
        try {
            setUsers(null)
            let payload = {
                params: false,
                isToast: false
            }
            const response = await dispatch(getAllUsers(payload)).unwrap()
            setUsers(response?.data?.Users)
        } catch (rejectedValueOrSerializedError) {
            console.log(rejectedValueOrSerializedError)
        }
    }

    useEffect(() => {
        let mount = true
        if (mount) {
            Users();
        }
        return () => {
            mount = false
        }
    }, [])

    useEffect(() => {
        if (users) {
            $('#tableData')
                .DataTable({
                    lengthMenu: [10, 25, 50, 100, 200],
                    language: {
                        "emptyTable": "Users Not Found"
                    },
                    destroy: true,
                });
        }
    }, [users])

    return (
        <>
            <Modal
                closeTimeoutMS={500}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Change Password"
            >
                <div className='change-password-modal' id="exampleModalCenter" tabIndex={-1} aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style={{ display: "block", zIndex: 100 }}>
                    {modalType == "userImages" ? <>
                        <p className="pass-text">User Images</p>
                        <button onClick={closeModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        <div className="modal-body">
                            <p ><b>Image:</b> {userDetail?.imageName ? <><img height="20%" width="20%" style={{ borderRadius: 5 }} src={`${process.env.REACT_APP_APIURL}${userDetail?.imageName}`}></img></> : <>No Image Found</>}</p>
                            <p ><b>Other Images: </b> {
                                userDetail?.otherImages?.length > 0 ? userDetail?.otherImages?.map((item, i) => (
                                    <img key={i} height="20%" width="20%" style={{ borderRadius: 5 }} src={`${process.env.REACT_APP_APIURL}${item}`}></img>
                                )) : <>No Image Found</>
                            }</p>
                        </div>
                    </> : modalType == "userDetail" ? <>
                        <p className="pass-text">User Detail</p>
                        <button onClick={closeModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        <div className="modal-body">
                            <h5>Basic</h5>
                            <ul>
                                <li>Name: {userDetail?.basics?.name ? userDetail?.basics?.name : "N/A"}</li>
                                <li>Date of birth: {userDetail?.basics?.dob ? userDetail?.basics?.dob : "N/A"}</li>
                                <li>Gender: {userDetail?.basics?.gender ? userDetail?.basics?.gender : "N/A"}</li>
                                <li>State of Life: {userDetail?.basics?.stateOfLife?.length > 0 ?
                                    <ul>
                                        {userDetail?.basics?.stateOfLife?.map((item, i) => (
                                            <li>{item}</li>
                                        ))}</ul> : "N/A"}</li>
                                <li>Religion: {userDetail?.basics?.religion ? userDetail?.basics?.religion : "N/A"}</li>
                                <li>City: {userDetail?.basics?.city ? userDetail?.basics?.city : "N/A"}</li>
                            </ul>
                            <hr></hr>
                            <h5>Career</h5>
                            <ul>
                                <li>School: {userDetail?.career?.school ? userDetail?.career?.school : "N/A"}</li>
                                <li>Job: {userDetail?.career?.job ? userDetail?.career?.job : "N/A"}</li>
                                <li>Company: {userDetail?.career?.company ? userDetail?.career?.company : "N/A"}</li>
                                <li>Income: {userDetail?.career?.income ? userDetail?.career?.income : "N/A"}</li>
                            </ul>
                            <hr></hr>
                            <h5>Physical</h5>
                            <ul>
                                <li>Height: {userDetail?.physical?.heightFt && userDetail?.physical?.heightInch ? userDetail?.physical?.heightFt+"."+userDetail?.physical?.heightInch : "N/A"}</li>
                                <li>Weight: {userDetail?.physical?.weight ? userDetail?.physical?.weight : "N/A"}</li>
                                <li>Race: {userDetail?.physical?.race?.length > 0 ?
                                    <ul>
                                        {userDetail?.physical?.race?.map((item, i) => (
                                            <li>{item}</li>
                                        ))}</ul> : "N/A"}</li>
                                <li>Eye Color: {userDetail?.physical?.eyeColor ? userDetail?.physical?.eyeColor : "N/A"}</li>
                                <li>Hair Color: {userDetail?.physical?.hairColor ? userDetail?.physical?.hairColor : "N/A"}</li>
                                <li>Body Type: {userDetail?.physical?.bodyType ? userDetail?.physical?.bodyType : "N/A"}</li>
                            </ul>
                            <hr></hr>
                            <h5>Personality</h5>
                            <ul>
                                <li>Personality Type: {userDetail?.personality?.personalityType ? userDetail?.personality?.personalityType : "N/A"}</li>
                                <li>Night/Morning: {userDetail?.personality?.nightMorning ? userDetail?.personality?.nightMorning : "N/A"}</li>
                                <li>Introverted/Extroverted: {userDetail?.personality?.introvertedExtroverted ? userDetail?.personality?.introvertedExtroverted : "N/A"}</li>
                                <li>Fav Emojis: {userDetail?.personality?.favEmojis?.length > 0 ?
                                    <ul>
                                        {userDetail?.personality?.favEmojis?.map((item, i) => (
                                            <li>{item}</li>
                                        ))}</ul> : "N/A"}
                                </li>
                                <li>Ideal RelationShipD8: {userDetail?.personality?.idealRelationShipD8?.length > 0 ?
                                    <ul>
                                        {userDetail?.personality?.idealRelationShipD8?.map((item, i) => (
                                            <li>{item}</li>
                                        ))}</ul> : "N/A"}
                                </li>
                                <li>Ideal FriendShipD8: {userDetail?.personality?.idealfriendShipD8?.length > 0 ?
                                    <ul>
                                        {userDetail?.personality?.idealfriendShipD8?.map((item, i) => (
                                            <li>{item}</li>
                                        ))}</ul> : "N/A"}
                                </li>
                                <li>Friendship Intent: {userDetail?.personality?.friendShipIntent ? userDetail?.personality?.friendShipIntent : "N/A"}</li>
                                <li>Relationship Intent: {userDetail?.personality?.relationShipIntent ? userDetail?.personality?.relationShipIntent : "N/A"}</li>
                            </ul>
                            <hr></hr>

                            <h5>The Tea</h5>
                            <ul>
                                <li>Interest: {userDetail?.theTea?.interest?.length > 0 ?
                                    <ul>
                                        {userDetail?.theTea?.interest?.map((item, i) => (
                                            <li>{item}</li>
                                        ))}</ul> : "N/A"}
                                </li>
                                <li>Recreational Substances: {userDetail?.theTea?.recreationalSubstances?.length > 0 ?
                                    <ul>
                                        {userDetail?.theTea?.recreationalSubstances?.map((item, i) => (
                                            <li>{item}</li>
                                        ))}</ul> : "N/A"}
                                </li>
                                <li>Music: {userDetail?.theTea?.music?.length > 0 ?
                                    <ul>
                                        {userDetail?.theTea?.music?.map((item, i) => (
                                            <li>{item}</li>
                                        ))}</ul> : "N/A"}
                                </li>
                                <li>Tv: {userDetail?.theTea?.tv?.length > 0 ?
                                    <ul>
                                        {userDetail?.theTea?.tv?.map((item, i) => (
                                            <li>{item}</li>
                                        ))}</ul> : "N/A"}
                                </li>
                                <li>Comedian: {userDetail?.theTea?.comedian?.length > 0 ?
                                    <ul>
                                        {userDetail?.theTea?.comedian?.map((item, i) => (
                                            <li>{item}</li>
                                        ))}</ul> : "N/A"}
                                </li>
                                <li>Sport Team: {userDetail?.theTea?.sportTeam ? userDetail?.theTea?.sportTeam : "N/A"}</li>
                                <li>Cities Visited: {userDetail?.theTea?.citiesVisited ? userDetail?.theTea?.citiesVisited : "N/A"}</li>
                                <li>Politics: {userDetail?.theTea?.politics ? userDetail?.theTea?.politics : "N/A"}</li>
                                <li>Sexuality: {userDetail?.theTea?.sexuality ? userDetail?.theTea?.sexuality : "N/A"}</li>
                                <li>Looking For RoomMates: {userDetail?.theTea?.lookingForRoomMates ? userDetail?.theTea?.lookingForRoomMates : "N/A"}</li>
                            </ul>
                            <hr></hr>
                        </div>
                    </> : modalType == "delete" ? <>
                        <p className="pass-text">Delete Account Confirmation</p>
                        <button onClick={closeModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        <div className="modal-body">
                            <form >
                                <div className="pass-form-wrap" style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
                                    <div className="login-button mt-2" style={{ width: "40%" }}>
                                        <button type="button" onClick={() => accountDelete(id)} style={{ backgroundColor: "rgba(0, 69, 139,0.8)" }} className="cta-btn col-reds w-100">Delete</button>
                                    </div>
                                    <div className="login-button mt-2" style={{ width: "40%" }} >
                                        <button type="button" onClick={closeModal} style={{ backgroundColor: "rgba(0, 69, 139,0.8)" }} className="cta-btn col-reds w-100">Cancel</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </> : <></>}
                </div>
            </Modal >
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginTop: users ? "1%" : "12%"
            }}>
                {/* <section className="excel-sec">
                    <div className="container tableContainer">
                        <div className=" mt-2 mb-3">
                            {users ?
                                <button className="excel-btn col-reds w-10 pt-2 pb-2" style={{ backgroundColor: "rgba(0, 69, 139,0.8)" }}  >
                                    <CSVLink filename={"User List.csv"} data={csvData} style={{ textDecoration: "none" }}>Export Excel</CSVLink>
                                </button>
                                : <></>}
                        </div>
                    </div>
                </section> */}
                <section className="coupon-sec-2">
                    <div className="container tableContainer">
                        <div className="row">
                            <div className="col-12 col-md-12 col-lg-12">
                                <div className="card shadow mb-4">
                                    <div className="card-body">
                                        <div className="table-responsive" id="tableready">
                                            <table id="tableData" className="table table-bordered display" style={{ width: '100%', textAlign: "center" }}>
                                                <thead>
                                                    {users ? (<tr>
                                                        <th>S.No</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Gender</th>
                                                        <th>Joined date</th>
                                                        <th>Detail</th>
                                                        <th>Images</th>
                                                        <th>Action</th>
                                                    </tr>) : (<tr></tr>)}
                                                </thead>
                                                <tbody >
                                                    {users?.map((item, i) => (
                                                        <tr key={i}>
                                                            <td>{i + 1}</td>
                                                            <td>{item?.basics?.name}</td>
                                                            <td>{item?.email}</td>
                                                            <td>{item?.basics?.gender}</td>
                                                            <td>{moment(item?.createdAt).format("DD-MMM-YYYY")}</td>
                                                            <td>
                                                                <span className="edit-icon" >
                                                                    <span style={{ cursor: "pointer", fontWeight: "bold", margin: 10, fontSize: 13, }} onClick={() => viewModal(item, "userDetail")}  ><i className="fas fa-eye"></i> View</span>
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className="edit-icon" >
                                                                    <span style={{ cursor: "pointer", fontWeight: "bold", margin: 10, fontSize: 13, }} onClick={() => viewModal(item, "userImages")}  ><i className="fas fa-eye"></i> View</span>
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className="edit-icon" >
                                                                    <span style={{ cursor: "pointer", fontWeight: "bold", margin: 10 }} onClick={() => viewModal(item?._id, "delete")}  ><i className="fas fa-trash-alt"></i> Delete</span>
                                                                    <span style={{ cursor: "pointer", fontWeight: "bold", margin: 10 }} onClick={() => blockUnblockAccount(item?._id)}  >{item?.block ? <i className="fa fa-unlock-alt"> UnBlock</i> : <i className="fa fa-solid fa-ban"> Block</i>}</span>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                    )}
                                                </tbody>
                                                {!users ?
                                                    status == "loading" || error ? <tfoot>
                                                        <tr><th>{status == "loading" ? "Loading..." : error ? error : ""}</th></tr>
                                                    </tfoot> : <></> : <></>}
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div >
        </>
    )
}
export default UserList
