import api from './api';
interface AvatarObject {
    steamid: string,
    done: boolean,
    loading: boolean,
    custom: string,
    steam: string
}

export const avatars: AvatarObject[] = [];

export const getAvatarURL = async (steamid: string) =>{
    const avatar = avatars.filter(avatar => avatar.steamid === steamid)[0];
    if(avatar && (avatar.loading || avatar.done)){
        return;
    }
    avatars.push({steamid, done: false, loading: true, custom: '', steam: ''})

    try {
        const response = await api.players.getAvatarURLs(steamid);
        if(response.steam.length || response.custom.length){
            for(let i = 0; i < avatars.length; i++) {
                if(avatars[i].steamid === steamid){
                    avatars[i].done = true;
                    avatars[i].loading = false;
                    avatars[i].steam = response.steam;
                    avatars[i].custom = response.custom;
                }
            }
        }
    } catch {
        for(let i = 0; i < avatars.length; i++) {
            if(avatars[i].steamid === steamid){
                avatars[i].done = true;
                avatars[i].loading = false;
            }
        }
    }

    return;
}