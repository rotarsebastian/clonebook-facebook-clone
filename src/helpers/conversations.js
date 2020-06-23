import { endpoint } from './user';
const conversationsEndpoint = endpoint + '/conversations';

export const getConversation = async(friend, offset, token) => {
    try {
      const options = {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch(conversationsEndpoint + `/${friend}?offset=${offset}`, options);
      const data = await response.json();
      return data;
    }
    catch(err) {
      return { status: 0, message: 'Can not connect to the server', code: 999 };
    }
};

export const markConversationAsSeen = async(id, token) => {
  try {
    const options = {
        method: 'PATCH',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      }
    };
    const response = await fetch(conversationsEndpoint + `/${id}`, options);
    const data = await response.json();
    return data;
  }
  catch(err) {
    return { status: 0, message: 'Can not connect to the server', code: 999 };
  }
};
  