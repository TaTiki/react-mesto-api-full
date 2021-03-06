const contentType = {
  'Content-Type': 'application/json',
};

class Api {
  constructor({ baseUrl, headers, timeout }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    this._timeout = timeout;
    this.likeCard = this.likeCard.bind(this);
    this.unlikeCard = this.unlikeCard.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    //this.postCard = this.postCard.bind(this);
  }

  getUser(){
    return this._request('GET', `${this._baseUrl}/users/me`)
    .then((user) => (
      user.json()
    ));
  }

  updateUserInfo(userInfo){
    return this._request(
      'PATCH',
      `${this._baseUrl}/users/me`,
      JSON.stringify(userInfo)
    ).then((user) => (
      user.json()
    ));
  }

  updateUserAvatar(avatar){
    return this._request(
      'PATCH',
      `${this._baseUrl}/users/me/avatar`,
      JSON.stringify(avatar)
    ).then((user) => (
      user.json()
    ));
  }

  getInitialCards(){
    return this._request('GET', `${this._baseUrl}/cards`)
    .then((cards) => (
      cards.json()
    ));
  }

  postCard(card){
    return this._request(
      'POST',
      `${this._baseUrl}/cards`,
      JSON.stringify(card)
    ).then((card) => (
      card.json()
    ));
  }

  deleteCard(cardId){
    return this._request('DELETE',`${this._baseUrl}/cards/${cardId}`);
  }

  likeCard(cardId){
    return this._request('PUT',`${this._baseUrl}/cards/likes/${cardId}`)
    .then((card) => (
      card.json()
    ));
  }

  unlikeCard(cardId){
    return this._request('DELETE',`${this._baseUrl}/cards/likes/${cardId}`)
    .then((card) => (
      card.json()
    ));
  }

  _request(method, url, body){
    const headers = body ? {
      ...this._headers,
      ...contentType,
    } : this._headers;
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
      return Promise.reject(`????????????: ${resp.status}`);
    });
  }
}

export { Api };
export default new Api({
  baseUrl: 'http://localhost:5000',
  headers: {
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGFiMjMwYWY1ZDJlNzAwMWRlYTBmYWYiLCJpYXQiOjE2MjE4Mjg1MTMsImV4cCI6MTYyMjQzMzMxM30.twhk8N_wq_1Al2xDebccHeY-Z-gwDwgN80XuM-TkcNg',
  },
  timeout: 20000,
});