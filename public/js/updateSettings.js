/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

//type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${
        type === 'password' ? 'updateMyPassword' : 'updateMe'
      }`,
      data
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `Your account ${type.toUpperCase()} has been updated successfully`
      );
      console.log(res);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err);
  }
};
