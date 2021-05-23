const contentType = {
  'Content-Type': 'application/json',
};

class Auth{
  constructor({ baseUrl, timeout}) {
    this._baseUrl = baseUrl;
    this._timeout = timeout;
  }

  signup(email, password) {
    return this._request('POST',
    `${this._baseUrl}/signup`,
    JSON.stringify({email, password}))
    .then( resp => resp.json());
  }

  signin(email, password) {
    return this._request('POST',
    `${this._baseUrl}/signin`,
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

  getAuthUser(token) {
    return this._request('GET',
    `${this._baseUrl}/users/me`,
    undefined, {
      'Authorization':`Bearer ${token}`
    }
    ).then( resp => resp.json())
    .then(data => {
      if(data.data.email) {
        return data.data.email
      }
      return Promise.reject('Что-то пошло не так...')
    })
  }

  _request(method, url, body = undefined,  initHeaders = {}){
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
      resp.json().then(console.log)
      return Promise.reject(resp.status);
    });
  }
}

export { Auth };
export default new Auth({
  baseUrl: 'https://auth.nomoreparties.co',
  timeout: 20000,
});

