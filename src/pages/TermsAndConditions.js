import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import JoditEditor from 'jodit-react';
import moment from 'moment'
import { toast } from 'react-hot-toast';
import { TcPp, updateTcpp } from '../store/featureActions';
const TermsAndConditions = () => {
  const [getTcPP, setGetTcPP] = useState('')
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const dispatch = useDispatch()
  const config = useMemo(
    () => (
      {
        askBeforePasteHTML: false,
        askBeforePasteFromWord: false,
        placeholder: 'Start typings...'
      }
    ),
    []
  );
  const updateTc = async () => {
    try {
      if (!content || content == "<p><br></p>") {
        toast.error("Terms And Conditions can't be empty")
      } else {
        let payload = {
          body: {
            termCondition: content ? content : getTcPP?.termCondition ? getTcPP?.termCondition : ""
          },
          params: false,
          isToast:true
        }
        await dispatch(updateTcpp(payload)).unwrap()
        TcPpData()
      }
    } catch (rejectedValueOrSerializedError) {
      console.log(rejectedValueOrSerializedError)
    }
  }
  const TcPpData = async () => {
    try {
      let payload = {
        params: `?type=terms_and_conditions`,
        isToast:false
      }
      const response = await dispatch(TcPp(payload)).unwrap()
      setGetTcPP(response?.data?.tcAndPp)
      setContent(response?.data?.tcAndPp?.termCondition)
    } catch (rejectedValueOrSerializedError) {
      console.log(rejectedValueOrSerializedError)
    }
  }
  useEffect(() => {
    let mount = true
    if (mount) {
      TcPpData();
    }
    return () => {
      mount = false
    }
  }, [])

  return (
    <>
      <section className="term-condition-sec">
        <div className="container type-2">
          <div className="term-condition-wrap">
            <div className="term-condition-box">
              <h1 className="heading" style={{ fontSize: 25, fontWeight: "Normal" }}>Terms and conditions</h1>
              <div className="content-box">
                <JoditEditor
                  ref={editor}
                  value={content ? content : getTcPP?.termCondition}
                  config={config}
                  tabIndex={1} // tabIndex of textarea
                  onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                  onChange={newContent => { }}


                />
                <p className="last-update">Last Updated: {getTcPP?.updatedAt ? moment(getTcPP?.updatedAt).format("MMM DD, YYYY") : ""}</p>
                <div className=" mt-2">
                  <button onClick={() => updateTc()} className="excel-btn col-reds w-10 pt-2 pb-2" style={{ backgroundColor: "rgba(0, 69, 139,0.8)" }}  >Update</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default TermsAndConditions