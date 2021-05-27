async function apiV2(url, method = 'GET', body) {
    const options = {
        method,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    }
    if (body) {
        options.body = JSON.stringify(body)
    }
    let data = null;
    return fetch(`/api/${url}`, options)
        .then(res => {
            data = res;
            return res.json().catch(_e => data && data.status < 300)
        });
}

const api = {
    match: {
        get: async () => apiV2(`match`),
        getCurrent: async () => apiV2(`match/current`)
    },
    teams: {
        getOne: async (id) => apiV2(`teams/${id}`),
        get: () => apiV2(`teams`),
    },
    players: {
        get: async () => apiV2(`players`),
        getAvatarURLs: async (steamid) => apiV2(`players/avatar/steamid/${steamid}`)
    },
    tournaments: {
        get: () => apiV2('tournament')
    }
}

export { api };