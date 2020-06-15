// ====================== DEVELOPMENT ======================
export const endpoint = 'http://localhost:9999/api';
const postsEndpoint = endpoint + '/posts';

export const getUserPosts = async(id, offset, token) => {
  try {
    const options = {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(postsEndpoint + `/${id}?offset=${offset}`, options);
    const data = await response.json();
    return data;
  }
  catch(err) {
    return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};

export const addPost = async(postData, token) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Authorization': 'Bearer ' + token,
      },
      body: postData
    };
    const response = await fetch(postsEndpoint, options);
    const data = await response.json();
    return data;
  }
  catch(err) {
    return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};

export const removePost = async(id, token) => {
  try {
      const options = {
          method: 'DELETE',
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        }
      };
      const response = await fetch(postsEndpoint + '/' + id, options);
      const data = await response.json();
      return data;
  }
  catch(err) {
      return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};

export const editPost = async(id, text, token) => {
  try {
    const options = {
        method: 'PATCH',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ text })
    };
    const response = await fetch(postsEndpoint + '/' + id, options);
    const data = await response.json();
    return data;
  }
  catch(err) {
    return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};

export const likePost = async(id, likeType, token) => {
  try {
    const options = {
        method: 'PATCH',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }
    };
    const response = await fetch(postsEndpoint + `/${id}/${likeType}/like`, options);
    const data = await response.json();
    return data;
  }
  catch(err) {
    return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};

export const addCommentToPost = async(id, commentData, token) => {
  try {
    const options = {
        method: 'PATCH',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(commentData)
    };
    const response = await fetch(postsEndpoint + `/${id}/comment`, options);
    const data = await response.json();
    return data;
  }
  catch(err) {
    return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};

export const editComment = async(id, text, comment_id, token) => {
  try {
    const options = {
        method: 'PATCH',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ text })
    };
    const response = await fetch(postsEndpoint + `/${id}/comment/${comment_id}`, options);
    const data = await response.json();
    return data;
  }
  catch(err) {
    return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};

export const removeComment = async(id, comment_id, token) => {
  try {
    const options = {
        method: 'PATCH',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }
    };
    const response = await fetch(postsEndpoint + `/${id}/comment/${comment_id}/delete`, options);
    const data = await response.json();
    return data;
  }
  catch(err) {
    return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};

export const likeComment = async(id, comment_id, answer, token) => {
  try {
    const options = {
        method: 'PATCH',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }
    };
    const response = await fetch(postsEndpoint + `/${id}/comment/${comment_id}/like?answer=${answer}`, options);
    const data = await response.json();
    return data;
  }
  catch(err) {
    return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};
