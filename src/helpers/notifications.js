// ====================== DEVELOPMENT ======================
export const endpoint = 'http://localhost:9999/api';
const notificationsEndpoint = endpoint + '/notifications';

export const getUserNotifications = async(token, offset) => {
  try {
    const options = {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(notificationsEndpoint + `?offset=${offset}`, options);
    const data = await response.json();
    return data;
  }
  catch(err) {
    return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};

export const answerFriendReq = async(notification, answer, token) => {
  try {
    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...notification, answer })
    };
    const response = await fetch(notificationsEndpoint + '/answerFriendReq', options);
    const data = await response.json();
    return data;
  }
  catch(err) {
    return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};

export const sendFriendRequest = async(request_for_id, token) => {
  try {
    const options = {
        headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
        }
    };
    const response = await fetch(notificationsEndpoint + `/sendFriendRequest?id=${request_for_id}`, options);
    const data = await response.json();
    return data;
  }
  catch(err) {
    return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};

export const deleteNotification = async(notificationId, token) => {
  try {
    const options = {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
        }
    };
    const response = await fetch(notificationsEndpoint + `/deleteNotification/${notificationId}`, options);
    const data = await response.json();
    return data;
  }
  catch(err) {
    return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};