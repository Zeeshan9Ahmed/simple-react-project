import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUserError, getUserStatus } from '../store/slices/userSlice';
import $ from "jquery"
import 'datatables.net'
import GooglePlacesAutocomplete, { geocodeByPlaceId, getLatLng } from 'react-google-places-autocomplete';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { addEvent, deleteEvent, editEvent, getEvents } from '../store/featureActions';
import moment from 'moment/moment';
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
const AllEvents = () => {
    const [id, setId] = useState()
    const dispatch = useDispatch()
    const status = useSelector(getUserStatus)
    const error = useSelector(getUserError)
    const [eventList, setEventList] = useState(null)
    const [detail, setDetail] = useState(null)
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState()
    const [title, setTitle] = useState()
    const [participantLimit, setParticipantLimit] = useState()
    const [description, setDescription] = useState()
    const [type, setType] = useState()
    const [distance, setDistance] = useState()
    const [category, setCategory] = useState()
    const [lat, setLat] = useState()
    const [address, setAddress] = useState()
    const [long, setLong] = useState()
    const [value, setValue] = useState(null);
    const [valid, setValid] = useState()
    const [price, setPrice] = useState()
    const [files, setFiles] = useState([])
    const navigate = useNavigate()
    function viewModal(item, type) {
        setIsOpen(true);
        if (type == "detail") {
            setDetail(item)
        } else if (type == "create") {
            setId(item)
        } else if (type == "delete") {
            setId(item)
        } else if (type == "edit") {
            setDetail(item)
            setType(item?.type)
            setId(item?._id)
        }
        setModalType(type)
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
        setTitle()
        setParticipantLimit()
        setType()
        setDescription()
        setDistance()
        setCategory()
        setValid()
        setPrice()
        setValue()
        setFiles([])
    }

    const eventDelete = async (id) => {
        try {
            let payload = {
                params: id,
                isToast: true
            }
            await dispatch(deleteEvent(payload)).unwrap()
            setIsOpen(false)
            $('#tableData')
                .DataTable().destroy();
            events()
        } catch (rejectedValueOrSerializedError) {
            console.log(rejectedValueOrSerializedError)
        }
    }
    if (value) {
        geocodeByPlaceId(value?.value?.place_id)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                if (lat && lng) {
                    setLat(lat)
                    setAddress(value?.label)
                    setLong(lng)
                }
            })
    }
    const eventEdit = async () => {
        try {
            var formData = new FormData()
            const appendIfValue = (key, value) => {
                if (value !== undefined && value.trim() !== '') {
                    formData.append(key, value);
                }
            };
            appendIfValue("title", title);
            appendIfValue("participantLimit", participantLimit);
            appendIfValue("description", description);
            appendIfValue("type", type);
            appendIfValue("distance", distance);
            appendIfValue("category", category);
            appendIfValue("price", price);
            appendIfValue("valid", valid);
            appendIfValue("long", long?.toString());
            appendIfValue("lat", lat?.toString());
            appendIfValue("address", address);
            formData.append("eventImage", files);
            let payload = {
                body: formData,
                params: id,
                isToast: true
            }
            await dispatch(editEvent(payload)).unwrap()
            setIsOpen(false)
            setTitle()
            setParticipantLimit()
            setType()
            setDescription()
            setDistance()
            setCategory()
            setValid()
            setPrice()
            setFiles([])
            $('#tableData')
                .DataTable().destroy();
            events()
        } catch (rejectedValueOrSerializedError) {
            console.log(rejectedValueOrSerializedError)
        }
    }

    const CreateEvent = async () => {
        var formData = new FormData()
        const appendIfValue = (key, value) => {
            if (value !== undefined && value.trim() !== '') {
                formData.append(key, value);
            }
        };
        appendIfValue("title", title);
        appendIfValue("participantLimit", participantLimit);
        appendIfValue("description", description);
        appendIfValue("type", type);
        appendIfValue("distance", distance);
        appendIfValue("category", category);
        appendIfValue("valid", valid);
        appendIfValue("price", price);
        appendIfValue("long", long?.toString());
        appendIfValue("lat", lat?.toString());
        appendIfValue("address", address);
        formData.append("eventImage", files);

        let payload = {
            body: formData,
            params: false,
            isToast: true
        }
        try {
            await dispatch(addEvent(payload)).unwrap()
            setIsOpen(false)
            setTitle()
            setParticipantLimit()
            setType()
            setDescription()
            setDistance()
            setCategory()
            setPrice()
            setValid()
            setFiles([])
            if (eventList) {
                $('#tableData')
                    .DataTable().destroy();
            }
            events()
        } catch (rejectedValueOrSerializedError) {
            console.log(rejectedValueOrSerializedError)
        }
    }
    const events = async () => {
        try {
            setEventList(null)
            let payload = {
                params: false,
                isToast: false
            }
            const response = await dispatch(getEvents(payload)).unwrap()
            setEventList(response?.data?.events)
        } catch (rejectedValueOrSerializedError) {
            console.log(rejectedValueOrSerializedError)
        }
    }

    useEffect(() => {
        let mount = true
        if (mount) {
            events();
        }
        return () => {
            mount = false
        }
    }, [])
    useEffect(() => {
        if (eventList) {
            $('#tableData')
                .DataTable({
                    lengthMenu: [10, 25, 50, 100, 200],
                    language: {
                        "emptyTable": "Event List Not Found"
                    },
                    destroy: true,
                });
        }
    }, [eventList])
    console.log(type)
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
                    {modalType == "detail" ? <>
                        <p className="pass-text">Event Details</p>
                        <button onClick={closeModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        <div className="modal-body">
                            <p > <b>Image:</b> {detail?.image.length > 0 ? <><img height="20%" width="20%" style={{ borderRadius: 5 }} src={`${process.env.REACT_APP_APIURL}${detail?.image}`}></img></> : <>No Image Found</>}</p>
                            <p > <b>Distance:</b> {detail?.distance ? detail?.distance : <>No Distance Found</>}</p>
                            <p > <b>Description:</b> {detail?.description ? detail?.description : <>No Description Found</>}</p>
                        </div>
                    </> : modalType == "create" ? <>
                        <p className="pass-text">Create Event</p>
                        <button onClick={closeModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        <div className="modal-body">
                            <div className="input-group input-group-sm mb-3 w-75">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Title</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="input-group input-group-sm mb-3 w-75">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Type</span>
                                </div>
                                <select className="form-select form-select-sm" aria-label=".form-select-sm example" value={type} onChange={(e) => setType(e.target.value)}>
                                    <option selected value="">Select Type</option>
                                    <option value="free">Free</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                            {type == "paid" ?
                                <div className="input-group input-group-sm mb-3 w-75">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-sm">Price</span>
                                    </div>
                                    <input type="text" className="form-control" aria-label="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                                </div>
                                : <></>}
                            <div className="input-group input-group-sm mb-3 w-75">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Validity</span>
                                </div>
                                <input type="date" min={moment(new Date()).format("YYYY-MM-DD")} className="form-control" aria-label="Validity" value={valid} onChange={(e) => setValid(e.target.value)} />
                            </div>
                            <div className="input-group input-group-sm mb-3 w-100">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Location</span>
                                </div>
                                <GooglePlacesAutocomplete
                                    selectProps={{
                                        isClearable: true,
                                        placeholder: 'Select Location',
                                        value,
                                        onChange: setValue,
                                        styles: {
                                            input: (provided) => ({
                                                ...provided,
                                                padding: 0
                                            }),
                                        },
                                    }} />
                            </div>

                            <div className="input-group input-group-sm mb-3 w-50">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Participant Limit</span>
                                </div>
                                <input type="text" className="form-control" aria-label="ParticipantLimit" value={participantLimit} onChange={(e) => setParticipantLimit(e.target.value)} />
                            </div>
                            <div className="input-group input-group-sm mb-3 w-75">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Category</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
                            </div>
                            <div className="input-group input-group-sm mb-3 w-75">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Description</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="input-group input-group-sm mb-3 w-75">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Image</span>
                                </div>
                                <input type="file" className="form-control" aria-label="Image" onChange={(e) => setFiles(e?.target?.files[0])} />
                            </div>
                            <button className="excel-btn col-reds w-10 pt-2 pb-2" style={{ backgroundColor: "#0077DC" }} type="submit" onClick={CreateEvent}>Create</button>
                        </div>
                    </> : modalType == "edit" ? <>
                        <p className="pass-text">Edit Event</p>
                        <button onClick={closeModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        <div className="modal-body">
                            <div className="input-group input-group-sm mb-3 w-50">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Title</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Title" defaultValue={detail.title} value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="input-group input-group-sm mb-3 w-50">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Type</span>
                                </div>
                                <select className="form-select form-select-sm" aria-label=".form-select-sm example" defaultValue={detail.type} value={type} onChange={(e) => setType(e.target.value)}>
                                    <option selected value="">Select Type</option>
                                    <option value="free">Free</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                            {type == "paid" ?
                                <div className="input-group input-group-sm mb-3 w-50">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-sm">Price</span>
                                    </div>
                                    <input type="text" className="form-control" aria-label="Price" defaultValue={detail.price} value={price} onChange={(e) => setPrice(e.target.value)} />
                                </div>
                                : <></>}
                            <div className="input-group input-group-sm mb-3 w-50">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Validity</span>
                                </div>
                                <input type="date" min={moment(new Date()).format("YYYY-MM-DD")} className="form-control" aria-label="Validity" defaultValue={detail.valid} value={valid} onChange={(e) => setValid(e.target.value)} />
                            </div>
                            <div className="input-group input-group-sm mb-3 w-100">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Location</span>
                                </div>
                                <GooglePlacesAutocomplete
                                    selectProps={{
                                        isClearable: true,
                                        placeholder: 'Select Location',
                                        value,
                                        onChange: setValue,
                                        styles: {
                                            input: (provided) => ({
                                                ...provided,
                                                padding: 0
                                            }),
                                        },
                                    }} />
                            </div>
                            <div className="input-group input-group-sm mb-3 w-50">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Participant Limit</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Participant Limit" defaultValue={detail.participantLimit} value={participantLimit} onChange={(e) => setParticipantLimit(e.target.value)} />
                            </div>
                            <div className="input-group input-group-sm mb-3 w-50">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Category</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Category" defaultValue={detail.category} value={category} onChange={(e) => setCategory(e.target.value)} />
                            </div>
                            <div className="input-group input-group-sm mb-3 w-50">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Description</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Description" defaultValue={detail.description} value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="input-group input-group-sm mb-3 w-50">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">Image</span>
                                </div>
                                <input type="file" className="form-control" aria-label="Image" onChange={(e) => setFiles(e?.target?.files[0])} />
                            </div>
                            <button className="excel-btn col-reds w-10 pt-2 pb-2" style={{ backgroundColor: "#0077DC" }} type="submit" onClick={eventEdit}>Create</button>
                        </div>
                    </> : modalType == "delete" ? <>
                        <p className="pass-text">Delete Event Confirmation</p>
                        <button onClick={closeModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        <div className="modal-body">
                            <form >
                                <div className="pass-form-wrap" style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
                                    <div className="login-button mt-2" style={{ width: "40%" }}>
                                        <button type="button" onClick={() => eventDelete(id)} style={{ backgroundColor: "rgba(0, 69, 139,0.8)" }} className="cta-btn col-reds w-100">Delete</button>
                                    </div>
                                    <div className="login-button mt-2" style={{ width: "40%" }} >
                                        <button type="button" onClick={closeModal} style={{ backgroundColor: "rgba(0, 69, 139,0.8)" }} className="cta-btn col-reds w-100">Cancel</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </> : <></>}
                </div>
            </Modal>
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginTop: eventList ? "3%" : "12%"
            }}>
                <section className="coupon-sec-2">
                    <div className="container tableContainer">
                        <div className=" mt-2 mb-3 d-flex justify-content-end">
                            <button className="excel-btn col-reds w-10 pt-2 pb-2" style={{ backgroundColor: "#0077DC" }} onClick={() => viewModal(null, "create")} >Create Event
                            </button>
                        </div>
                    </div>
                </section>
                <section className="coupon-sec-2">
                    <div className="container tableContainer">
                        <div className="row">
                            <div className="col-12 col-md-12 col-lg-12">
                                <div className="card shadow mb-4">
                                    <div className="card-body">
                                        <div className="table-responsive" id="tableready">
                                            <table id="tableData" className="table table-bordered display" style={{ width: '100%', textAlign: "center" }}>
                                                <thead>
                                                    {eventList ? (<tr>
                                                        <th>S.No</th>
                                                        <th>Title</th>
                                                        <th>Type</th>
                                                        <th>Validity</th>
                                                        <th>Participant Limit</th>
                                                        <th>Category</th>
                                                        <th>Image</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>) : (<tr></tr>)}
                                                </thead>
                                                <tbody >
                                                    {eventList?.map((item, i) => (
                                                        <tr key={i}>
                                                            <td>{i + 1}</td>
                                                            <td>{item?.title}</td>
                                                            <td>{item?.type}</td>
                                                            <td>{item?.valid}</td>
                                                            <td>{item?.participantLimit}</td>
                                                            <td>{item?.category}</td>
                                                            <td>
                                                                <span className="edit-icon" >
                                                                    <span style={{ cursor: "pointer", fontWeight: "bold", margin: 10, fontSize: 13, }} onClick={() => viewModal(item, "detail")}  ><i className="fas fa-eye"></i> View</span>
                                                                </span>
                                                            </td>
                                                            <td>{moment(item.valid).format("YYYY-MM-DD") >= moment().format("YYYY-MM-DD") ? "Active" : "Previous"}</td>
                                                            <td>
                                                                <span className="edit-icon" >
                                                                    <span style={{ cursor: "pointer", fontWeight: "bold", margin: 10 }} onClick={() => viewModal(item, "edit")}  ><i className="fa fa-solid fa-edit"></i> Edit</span>
                                                                    <span style={{ cursor: "pointer", fontWeight: "bold", margin: 10 }} onClick={() => viewModal(item?._id, "delete")}  ><i className="fas fa-trash-alt"></i> Delete</span>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                    )}
                                                </tbody>
                                                {!eventList ?
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
export default AllEvents
