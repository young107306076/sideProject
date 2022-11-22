const api = {
  hostname: 'http://localhost:3000/api/1.0',
  getProducts(category, paging) {
    return fetch(`${this.hostname}/products/${category}?paging=${paging}`).then(
      (response) => response.json()
    );
  },
  getCampaigns() {
    return fetch(`${this.hostname}/marketing/campaigns`).then((response) =>
      response.json()
    );
  },
  searchProducts(keyword, paging) {
    return fetch(
      `${this.hostname}/products/search?keyword=${keyword}&paging=${paging}`
    ).then((response) => response.json());
  },
  getProduct(id) {
    return fetch(`${this.hostname}/products/details?id=${id}`).then(
      (response) => response.json()
    );
  },
  checkout(data, jwtToken) {
    return fetch(`${this.hostname}/order/checkout`, {
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
      method: 'POST',
    }).then((response) => response.json());
  },
  signin(data) {
    return fetch(`${this.hostname}/user/signin`, {
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'POST',
    }).then((response) => response.json());
  },
  getProfile(jwtToken) {
    return fetch(`${this.hostname}/user/profile`, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
    }).then((response) => response.json());
  },
  getCollectAmount(id, jwtToken) {
    return fetch(`${this.hostname}/whistlist/amount/` + id, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
    }).then((response) => response.json());
  },
  addToWhistlist(id, jwtToken) {
    return fetch(`${this.hostname}/whistlist`, {
      body: JSON.stringify({'productId': id}),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
      method: 'POST',
    }).then((response) => response.json());
  },
  removeFromWhistlist(id, jwtToken) {
    return fetch(`${this.hostname}/whistlist`, {
      body: JSON.stringify({'productId': id}),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
      method: 'DELETE',
    }).then((response) => response.json());
  },
  getTrending(amount, jwtToken) {
    return fetch(`${this.hostname}/whistlist/trending/` + amount, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
    }).then((response) => response.json());
  },
};
