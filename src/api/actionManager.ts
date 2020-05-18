export default class ActionManager {
    listeners: Map<string, Function[]>;

    constructor(){
        this.listeners = new Map();

        /*this.on('data', _data => {
        });*/
    }
    execute(eventName: string, argument?: any){
        const listeners = this.listeners.get(eventName);
        if(!listeners) return false;
        listeners.forEach(callback => {
            if(argument) callback(argument);
            else callback();
        });
        return true;
    }

    on(eventName: string, listener: Function){
        const listOfListeners = this.listeners.get(eventName) || [];
        listOfListeners.push(listener);
        this.listeners.set(eventName, listOfListeners);

        return true;
    }
}
export class ConfigManager {
    listeners: Function[];
    data: any;

    constructor(){
        this.listeners = [];
        this.data = {};
    }
    save(data: any){
        this.data = data;
        this.execute();

        /*const listeners = this.listeners.get(eventName);
        if(!listeners) return false;
        listeners.forEach(callback => {
            if(argument) callback(argument);
            else callback();
        });
        return true;*/
    }

    execute(){
        const listeners = this.listeners;
        if(!listeners || !listeners.length) return false;
        listeners.forEach(listener => {
            listener(this.data);
        });
        return true;
    }

    onChange(listener: Function){
        const listOfListeners = this.listeners || [];
        listOfListeners.push(listener);
        this.listeners = listOfListeners;

        return true;
    }
}