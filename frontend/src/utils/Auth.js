export const BASE_URL = 'https://mesto-app-phi.vercel.app';

export const getServerStatus = (res) => {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Error: ${res.status}`);
    }
}

export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({password, email})
  })
  .then((response) => {
    return getServerStatus(response)
  })
  .then (data => data)
};


export const authorize = (password, email) => {
    return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({password, email})
    })
    .then((response => {
        return getServerStatus(response)
      }))
    .then (data => data)
  }; 


export const checkToken = () => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        },
        credentials: 'include',
    })
    .then(response => {
      return getServerStatus(response)
      })
    .then(data => data)
}

export const logout = () => {
  return fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      },
      credentials: 'include',
  })
  .then(response => {
    return getServerStatus(response)
    })
  .then(data => data)
}
