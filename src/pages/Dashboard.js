import React, { useEffect } from 'react'
import LineChart from "../utils/LineChart"
import { useDispatch, useSelector } from 'react-redux';
import AreaChart from '../utils/AreaChart';
import { getDashboard, getLakes, getUserError } from '../store/slices/userSlice';
import moment from 'moment';
import { dashboard, recentLakes } from '../store/featureActions';

const Dashboard = () => {
  const dispatch = useDispatch()
  const dashboardData = useSelector(getDashboard)
  const lakes = useSelector(getLakes)
  const error = useSelector(getUserError)
  async function data() {
    try {
      let payload = {
        params: false,
        isToast:false
      }
      await dispatch(dashboard(payload)).unwrap()
    } catch (rejectedValueOrSerializedError) {
      console.log(rejectedValueOrSerializedError)
    }
  }

  async function lakesData() {
    try {
      let payload = {
        params: false,
        isToast:false
      }
      await dispatch(recentLakes(payload)).unwrap()
    } catch (rejectedValueOrSerializedError) {
      console.log(rejectedValueOrSerializedError)
    }
  }
  useEffect(() => {
    let mount = true
    if ((mount && !dashboardData || (mount && !lakes))) {
      data();
      lakesData();
    }
    return () => {
      mount = false
    }
  }, [dispatch])

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper2">
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <i className="mdi mdi-home" />
              </span> Dashboard
            </h3>
          </div>
          <div className="row">
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-danger card-img-holder text-white">
                <div className="card-body">
                  <img src="/assets/images/circle.png" className="card-img-absolute" alt="circle-image" />
                  <h4 className="font-weight-normal mb-3">Total Users<i className="mdi mdi-account-outline mdi-24px float-right" />
                  </h4>
                  <h2 className="mb-5">{dashboardData?.usersCount}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-info card-img-holder text-white">
                <div className="card-body">
                  <img src="/assets/images/circle.png" className="card-img-absolute" alt="circle-image" />
                  <h4 className="font-weight-normal mb-3">Total Events<i className="mdi mdi-controller-classic mdi-24px float-right" />
                  </h4>
                  <h2 className="mb-5">{dashboardData?.gameCount}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-success card-img-holder text-white">
                <div className="card-body">
                  <img src="/assets/images/circle.png" className="card-img-absolute" alt="circle-image" />
                  <h4 className="font-weight-normal mb-3">Total Categories <i className="mdi mdi-waves mdi-24px float-right" />
                  </h4>
                  <h2 className="mb-5">{dashboardData?.lakeCount}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="clearfix">
                    <h4 className="card-title float-left">All Users</h4>
                    <div id="visit-sale-chart-legend" className="rounded-legend legend-horizontal legend-top-right float-right" />
                  </div>
                  <LineChart />
                </div>
              </div>
            </div>
            <div className="col-md-6 grid-margin stretch-card">
              <div className="card">
                <div className="card-body ">
                  <h4 className="card-title">All Games</h4>
                  <AreaChart />
                  <div id="traffic-chart-legend" className="rounded-legend legend-vertical legend-bottom-left pt-4" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Recent Events</h4>
                  <div className="table-responsive" style={{ textAlign: "center" }}>
                    {lakes?.length > 0 ? (
                      <table className="table">
                        <thead style={{ textAlign: "center" }}>
                          <tr>
                            <th> S.No </th>
                            <th> Lake Name</th>
                            <th> Lake Added</th>
                          </tr>
                        </thead>
                        <tbody style={{ textAlign: "center" }}>
                          {lakes?.map((item, i) =>
                          (<tr key={i}>
                            <td>{i + 1}</td>
                            <td style={{ textAlign: "start" }}>{item?.name}</td>
                            <td>
                              <span>{moment(item?.createdAt).format("DD-MMM-YYYY")}</span><br />
                            </td>
                          </tr>)
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <>{error}</>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* partial */}
      </div>
      <div></div>
    </>
  )
}

export default Dashboard