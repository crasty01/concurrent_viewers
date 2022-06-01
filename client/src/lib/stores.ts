import { readable, writable } from "svelte/store";
import { GetItemWithTTL, SetItemWithTTL } from "./localStoragettl";
import dayjs from "dayjs";


export const sessionToken = writable<string>(null,(set)=>{
    const token = new URLSearchParams(location.hash.substring(1)).get("token")
    location.hash =''
    if (token){
        SetItemWithTTL('sessionToken',token,dayjs.duration(4,'hour'))
        set(token)
        return
    }
    set(GetItemWithTTL('sessionToken'))
})