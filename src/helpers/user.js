// ====================== DEVELOPMENT ======================
export const endpoint = 'http://localhost:9999/api';
const usersEndpoint = endpoint + '/users';

export const login = async(loginData) => {
    try {
        const options = {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
        };
        const response = await fetch(usersEndpoint + '/login', options);
        const data = await response.json();
        return data;
    }
    catch(err) {
        return { status: 0, message: 'Can not connect to the server', code: 999 };
    }
};

export const logout = async(token) => {
    try {
      const options = {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      };
      const response = await fetch(usersEndpoint + '/logout', options);
      const data = await response.json();
      return data;
    }
    catch(err) {
      console.log(err, 'err');
      return { status: 0, message: 'Can not connect to the server', code: 999 };
    }
};

export const recoverOrResendValidation = async(email) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(email)
      };
      const response = await fetch(usersEndpoint + '/recover', options);
      const data = await response.json();
      return data;
    }
    catch(err) {
        return { status: 0, message: 'Can not connect to the server', code: 999 };
    }
};

export const register = async(registerData) => {
    try {
        const options = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registerData)
        };
        const response = await fetch(usersEndpoint + '/register', options);
        const data = await response.json();
        return data;
    }
    catch(err) {
        return { status: 0, message: 'Can not connect to the server', code: 999 };
    }
};

export const changePassword = async(changePassData) => {
    try {
        const options = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(changePassData)
        };
        const response = await fetch(usersEndpoint + '/resetpass', options);
        const data = await response.json();
        return data;
    }
    catch(err) {
        return { status: 0, message: 'Can not connect to the server', code: 999 };
    }
};

export const getSpecificUser = async(id, token) => {
    try {
        const options = {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        };
        const response = await fetch(usersEndpoint + '/user/' + id, options);
        const data = await response.json();
        return data;
    }
    catch(err) {
        return { status: 0, message: 'Can not connect to the server', code: 999 };
    }
};

export const getLoggedUserData = async(token) => {
    try {
      const options = {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch(usersEndpoint + '/loggedUser', options);
      const data = await response.json();
      return data;
    }
    catch(err) {
      return { status: 0, message: 'Can not connect to the server', code: 999 };
    }
};

export const getAccessToken = async(refreshToken) => {
    try {
        const options = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token: refreshToken })
        };
        const response = await fetch(usersEndpoint + '/token', options);
        const data = await response.json();
        return data;
    }
    catch(err) {
        return { status: 0, message: 'Can not connect to the server', code: 999 };
    }
};

export const deleteFriend = async(friend_id, token) => {
  try {
    const options = {
        method: 'PATCH',
        headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
        }
    };
    const response = await fetch(usersEndpoint + `/friend/delete/${friend_id}`, options);
    const data = await response.json();
    return data;
  }
  catch(err) {
    return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};

export const searchUsers = async(search, token) => {
  try {
    const options = {
        headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
        }
    };
    const response = await fetch(usersEndpoint + `/search?search=${search}`, options);
    const data = await response.json();
    return data;
  }
  catch(err) {
    return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};

export const updateProfile = async(editData, token, newProfileImage) => {
  try {
    let newProfilePic = newProfileImage !== undefined ? `?new=${newProfileImage}` : '';
    const options = {
      method: 'PATCH',
      headers: {
        'Accept': '*/*',
        'Authorization': 'Bearer ' + token,
      },
      body: editData
    };
    const response = await fetch(usersEndpoint + newProfilePic, options);
    const data = await response.json();
    return data;
  }
  catch(err) {
    return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};

export const getUsersByIDs = async(users_ids, token) => {
  try {
      const options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(users_ids)
      };
      const response = await fetch(usersEndpoint + '/likes', options);
      const data = await response.json();
      return data;
  }
  catch(err) {
      return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};

// ====================== NOT IMPLEMENTED YET ======================
export const deleteUser = async(token) => {
  try {
      const options = {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch(usersEndpoint, options);
      const data = await response.json();
      return data;
  }
  catch(err) {
      return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};