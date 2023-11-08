import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

export const postRequest = (apiEndpoint, thunkName) => {
  // console.log(apiEndpoint);
  // return;
  return createAsyncThunk(
    thunkName,
    async ({ body, params, isToast }, { rejectWithValue }) => {
      try {
        const endPoint = params ? `${apiEndpoint}${params}` : apiEndpoint;
        const response = await axios.post(endPoint, body);
        if (isToast) {
          toast.success(response?.data?.message);
        }
        return response;
      } catch (error) { 
        if (error?.code == "ERR_NETWORK") {
          toast.error(error?.message);
          return rejectWithValue(error);
        }
       else if (isToast) {
          toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error.response);
      }
    }
  );
};

export const getRequest = (apiEndpoint, thunkName) => {
  return createAsyncThunk(
    thunkName,
    async ({ params, isToast }, { rejectWithValue }) => {
      try {
        const endPoint = params ? `${apiEndpoint}${params}` : apiEndpoint;
        const response = await axios.get(endPoint);
        if (isToast) {
          toast.success(response?.data?.message);
        }
        return response;
      } catch (error) {
        if (error?.code == "ERR_NETWORK") {
            toast.error(error?.message);
            return rejectWithValue(error);
          }
         else if (isToast) {
          toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error.response);
      }
    }
  );
};

export const deleteRequest = (apiEndpoint, thunkName) => {
  return createAsyncThunk(
    thunkName,
    async ({ params, isToast }, { rejectWithValue }) => {
      try {
        const endPoint = params ? `${apiEndpoint}${params}` : apiEndpoint;
        const response = await axios.delete(endPoint);
        if (isToast) {
          toast.success(response?.data?.message);
        }
        return response;
      } catch (error) {
        if (error?.code == "ERR_NETWORK") {
            toast.error(error?.message);
            return rejectWithValue(error);
          }
         else  if (isToast) {
          toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error.response);
      }
    }
  );
};
