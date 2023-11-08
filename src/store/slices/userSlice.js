import {
    createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_APIURL
axios.defaults.timeout = 10000
const initialState = {
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    user: null,
    dashboard: null,
    lineChart: null,
    areaChart: null,
    lakes: null, 
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        sessionOut: (state) => {
            state.status = 'idle'
            state.error = null
            state.user = null
            state.dashboard = null
            state.lineChart = null
            state.areaChart = null
            state.lakes = null
        }
    },
    extraReducers(builder) {
        builder

            //pending
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state, action) => {
                    // console.log(state,'s')
                    switch (action.type) {
                        // case 'signout/pending':
                        //      state.status = "idle";
                        //     break;
                        default:
                            state.status = "loading";
                            console.log('Unknown action');
                            break;
                    }
                }
            )

            //fulfilled 
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state, action) => {
                    state.status = 'succeeded'
                    state.error = null
                    console.log(action,'action')
                    switch (action.type) {
                        // console.log('full');
                        case 'signin/fulfilled':
                            state.user = action.payload.data.data
                            axios.defaults.headers.common['Authorization'] = action.payload.data.data.token;
                            break;
                        case 'dashboard/fulfilled':
                            state.dashboard = { usersCount: action.payload.data.usersCount, gameCount: action.payload.data.gameCount, lakeCount: action.payload.data.lakeCount }
                            state.lineChart = action.payload.data.users
                            state.areaChart = action.payload.data.game
                            break;
                        case 'recentLakes/fulfilled':
                            state.lakes = action.payload.data.lakes
                            break;
                        case 'getAllLakes/fulfilled':
                            state.lakes = action.payload.data.lakes
                            break;
                        case 'signout/fulfilled':
                            localStorage.clear(); 
                            state.status = 'idle'
                            state.user = null
                            state.dashboard = null
                            state.lineChart = null
                            state.areaChart = null
                            state.lakes = null
                            break;
                        default:
                            console.log('Unknown action');
                            break;
                    }
                }
            )

            //rejected 
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    if(action?.payload?.code=="ERR_NETWORK"){
                        state.status = 'failed'
                    }
                    else if (action.payload.status == 401) {
                        state.error = action.payload.status
                    } else {
                        switch (action.type) {
                            // case 'signin/rejected':
                            //     toast.error(action.payload.data.message);
                            //     break; 
                            default:
                                state.status = 'failed'
                                state.error = action.payload.data.message
                                console.log('Unknown action');
                                break;
                        }
                    }
                }
            );

    }

})
export const getUserStatus = (state) => state?.users?.status;
export const getUserError = (state) => state?.users?.error;
export const getUserToken = (state) => state?.users?.user?.token;
export const getProfile = (state) => state?.users?.user;
export const getDashboard = (state) => state?.users?.dashboard;
export const getareaChart = (state) => state?.users?.areaChart;
export const getlineChart = (state) => state?.users?.lineChart;
export const getLakes = (state) => state?.users?.lakes;

export const { sessionOut } = userSlice.actions
export default userSlice.reducer