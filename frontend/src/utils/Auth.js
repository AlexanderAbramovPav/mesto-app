// export const BASE_URL = 'http://localhost:3000/api';
export const BASE_URL = 'https://api.alexander.abramov.nomoredomains.sbs';

export const getServerStatus = (res) => {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
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
    // .then((data) => {
    //   if (data.token){
    //     localStorage.setItem('jwt', data.token);
    //     return data;
    //   }
    // })
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
