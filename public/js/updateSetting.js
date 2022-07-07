import axios from 'axios';
import { showAlert } from './alert';
// type will be "password " or "data"
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'data'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMe'
        : 'http://127.0.0.1:3000/api/v1/users/updateMyPassword';
    const result = await axios({
      method: 'PATCH',
      url,
      data,
    });
    console.log(result);
    if (result.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()}successfully cahnged`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
