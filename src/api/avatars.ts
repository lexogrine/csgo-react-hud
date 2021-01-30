import api from './api';
interface AvatarLoader {
    loader: Promise<string>,
    url: string,
}

export const avatars: { [key: string]: AvatarLoader } = {};

export const loadAvatarURL = (steamid: string) => {
    if(!steamid) return;
    if(avatars[steamid]) return avatars[steamid].url;
    avatars[steamid] = {
        url: '',
        loader: new Promise((resolve) => {
            api.players.getAvatarURLs(steamid).then(result => {
                avatars[steamid].url = result.custom || result.steam;
                resolve(result.custom || result.custom);
            }).catch(() => {
                delete avatars[steamid];
                resolve('');
            });
        })
    }
}
