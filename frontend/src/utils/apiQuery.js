export const BASE_URL = 'http://localhost:3001';

export const getServerStatus = (res) => {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Error: ${res.status}`);
    }
}

export const fetchUserInfo = async () => {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const userInfo = getServerStatus(response)
    return userInfo
};

export const updateUserInfo = async (bodyOptions) => {
const response = await fetch(`${BASE_URL}/users/me`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyOptions),
  })

  const updatedUserInfo = getServerStatus(response)
  return updatedUserInfo
};

export const updateUserAvatar = async (bodyOptions) => {
  const response = await fetch(`${BASE_URL}/users/me/avatar`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyOptions),
    })
  
    const updatedUserAvatar = getServerStatus(response)
    return updatedUserAvatar
};  


export const fetchUserCards = async () => {
const response = await fetch(`${BASE_URL}/cards`, {
    method: 'GET',
    credentials: 'include',
    headers: {
    'Content-Type': 'application/json',
    },
})

  const userCards = getServerStatus(response)
  return userCards
};

export const fetchSomeUserCards = async (page = 1, sortType) => {
  const response = await fetch(`${BASE_URL}/cards?limit=9&page=${page}&sort=${sortType}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
      'Content-Type': 'application/json',
      },
  })
  
    const userCards = getServerStatus(response)
    return userCards
  };

export const changeLikeCardStatus = async (data) => {

  const [cardId, isLiked] = data

  if (isLiked) {
    const response = await fetch(`${BASE_URL}/cards/${cardId}/likes`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
      'Content-Type': 'application/json',
      },
    })

    const userCard = getServerStatus(response)
    return userCard

  } else {
    const response = await fetch(`${BASE_URL}/cards/${cardId}/likes`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
      'Content-Type': 'application/json',
      },
    })

    const userCard = getServerStatus(response)
    return userCard

  }
};

export const deleteUserCard = async (cardId) => {
  const response = await fetch(`${BASE_URL}/cards/${cardId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
      'Content-Type': 'application/json',
      },
    })
  
    const deletedCard = getServerStatus(response)
    return deletedCard
};  

export const addUserCard = async (bodyOptions) => {
  const response = await fetch(`${BASE_URL}/cards`, {
      method: 'POST',
      credentials: 'include',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyOptions),
    })
  
    const deletedCard = getServerStatus(response)
    return deletedCard
};  



