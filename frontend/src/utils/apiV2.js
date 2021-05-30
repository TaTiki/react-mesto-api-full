const contentType = {
  'Content-Type': 'application/json',
};

class Api {
  constructor({ baseUrl, timeout }) {
    this._baseUrl = baseUrl;
    this._timeout = timeout;
    this.likeCard = this.likeCard.bind(this);
    this.unlikeCard = this.unlikeCard.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
  }

  signup(email, password) {
    return this._request('POST',
    `${this._baseUrl}/signup`, {},
    JSON.stringify({email, password}))
    .then( resp => resp.json());
  }

  signin(email, password) {
    return this._request('POST',
    `${this._baseUrl}/signin`, {},
    JSON.stringify({email, password}))
    .then( resp => resp.json())
    .then((data)=> {
      if(data.token) {
        localStorage.setItem('JWT', data.token);
        return data.token;
      }
      return Promise.reject('Что-то пошло не так...')
    })
  }

  getAuthUser() {
    const token = localStorage.getItem('JWT')
    if (!token) {
      return Promise.reject('Please login first')
    }
    return this._request('GET',
    `${this._baseUrl}/users/me`,
    {
      'Authorization':`Bearer ${token}`
    }).then( resp => resp.json())
    .then(data => {
      if(data.data.email) {
        return data.data
      }
      return Promise.reject('Что-то пошло не так...')
    })
  }

  updateUserInfo(userInfo){
    const token = localStorage.getItem('JWT')
    if (!token) {
      return Promise.reject('Please login first')
    }
    return this._request(
      'PATCH',
      `${this._baseUrl}/users/me`,
      {
        'Authorization':`Bearer ${token}`
      },
      JSON.stringify(userInfo)
    ).then((resp) => resp.json())
    .then((body) => body.data);
  }

  updateUserAvatar(avatar){
    const token = localStorage.getItem('JWT')
    if (!token) {
      return Promise.reject('Please login first')
    }
    return this._request(
      'PATCH',
      `${this._baseUrl}/users/me/avatar`,
      {
        'Authorization':`Bearer ${token}`
      },
      JSON.stringify(avatar)
    ).then((resp) => resp.json())
    .then((body) => body.data);
  }

  getInitialCards(){
    const token = localStorage.getItem('JWT')
    if (!token) {
      return Promise.reject('Please login first')
    }
    return this._request('GET', `${this._baseUrl}/cards`, {
      'Authorization':`Bearer ${token}`
    }).then((body) => body.json())
    .then((body) => body.data);
  }

  postCard(card){
    const token = localStorage.getItem('JWT')
    if (!token) {
      return Promise.reject('Please login first')
    }
    return this._request(
      'POST',
      `${this._baseUrl}/cards`,
      {
        'Authorization':`Bearer ${token}`
      },
      JSON.stringify(card)
    ).then((body) => body.json())
    .then((body) => body.data);
  }

  deleteCard(cardId){
    const token = localStorage.getItem('JWT')
    if (!token) {
      return Promise.reject('Please login first')
    }
    return this._request(
      'DELETE',
      `${this._baseUrl}/cards/${cardId}`,
      { 'Authorization':`Bearer ${token}` },
    );
  }

  likeCard(cardId){
    const token = localStorage.getItem('JWT')
    if (!token) {
      return Promise.reject('Please login first')
    }
    return this._request('PUT',
    `${this._baseUrl}/cards/${cardId}/likes`,
    {
      'Authorization':`Bearer ${token}`
    }).then((body) => body.json())
    .then((body) => body.data);
  }

  unlikeCard(cardId){
    const token = localStorage.getItem('JWT')
    if (!token) {
      return Promise.reject('Please login first')
    }
    return this._request('DELETE',
    `${this._baseUrl}/cards/${cardId}/likes`,
    {
      'Authorization':`Bearer ${token}`
    }).then((body) => body.json())
    .then((body) => body.data);
  }

  _request(method, url, initHeaders = {}, body = undefined){
    const headers = body ? {
      ...initHeaders,
      ...contentType,
    } : initHeaders;
    const opt = {
      method,
      headers,
    };
    if (body) {
      opt.body = body;
    }
    const promises = [fetch(url, opt)];
    let timeout;
    if (this._timeout){
      const timeoutPromise = new Promise((_, reject) => {
        timeout = setTimeout(reject, this._timeout, 'timeout');
      })
      promises.push(timeoutPromise);
    }
    return Promise.race(promises).then((resp) => {
      if (this._timeout){
        clearTimeout(timeout);
      }
      if (resp.ok){
        return resp;
      }
      return Promise.reject(resp.status);
    });
  }
}

export { Api };
export default new Api({
  baseUrl: process.env.NODE_ENV === 'production' ? "https://api.mata.hari.nomoredomains.icu" : 'http://localhost:5000',
  timeout: 20000,
});