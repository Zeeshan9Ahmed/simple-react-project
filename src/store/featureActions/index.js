import { deleteRequest, getRequest, postRequest } from '../apiHelper';

//POST REQUEST
export const updatePassword = postRequest('admin/changepassword', 'changepassword');
export const signinUser = postRequest('signin', 'signin');
export const userLogout = postRequest('admin/signout/', 'signout');
export const addFished = postRequest('admin/addFishEd/', 'addFishEd');
export const addEvent = postRequest('admin/addEvent/', 'addEvent');
export const editEvent = postRequest('admin/editEvent/', 'editEvent');
export const addPointTable = postRequest('admin/addPointTable/', 'addPointTable');
export const editPoints = postRequest('admin/editPoints/', 'editPoints');
export const addLake = postRequest('admin/addLake/', 'addLake');
export const editLake = postRequest('admin/editLake/', 'editLake');
export const updateTcpp = postRequest('admin/TcPp/', 'content');

//GET REQUEST
export const dashboard = getRequest('admin/dashboard/', 'dashboard');
export const getFished = getRequest('admin/getFished/', 'getFished');
export const recentLakes = getRequest('admin/recentLakes/', 'recentLakes');
export const getAllUsers = getRequest('admin/getAllUsers/', 'getAllUsers');
export const getEvents = getRequest('admin/getEvents/', 'getEvents');
export const getSpeciePoints = getRequest('admin/getSpeciePoints/', 'getSpeciePoints');
export const getAllLakes = getRequest('admin/getLakes/', 'getLakes');
export const blockUnblock = getRequest('admin/blockUnblock/', 'blockUnblock');
export const TcPp = getRequest('api/getTcPp/', 'getTcPp');

//DELETE REQUEST
export const deleteFished = deleteRequest('admin/deleteFished/', 'deleteFished');
export const deleteEvent = deleteRequest('admin/deleteEvent/', 'deleteEvent');
export const deletePoints = deleteRequest('admin/deletePoints/', 'deletePoints');
export const deleteLake = deleteRequest('admin/deleteLake/', 'deleteLake');
export const deleteAccount = deleteRequest('admin/deleteAccount/', 'deleteAccount');

