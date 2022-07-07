import axios from 'axios';

import { showAlert } from './alert';
export const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'post',
      url: 'http://127.0.0.1:3000/api/v1/users/signin',
      data: {
        email,
        password,
      },
    });
    if (result.data.status === 'success') {
      showAlert('success', 'you successfully logged in');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const logout = async () => {
  try {
    const result = await axios({
      method: 'get',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });
    if (result.data.status === 'success') location.reload(true);
  } catch (err) {
    console.log(err.message);
  }
};
