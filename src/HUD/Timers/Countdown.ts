export default class Countdown {
    last: number;
    time: number;
    step: (time: number) => void;
    on: boolean;
    resetFunc?: Function;

    constructor(step: (time: number) => void){
        this.last = 0;
        this.time = 0;
        this.on = false;
        this.step = step;
    }
    onReset(func: Function) {
        this.resetFunc = func;
    }
    stepWrapper = (time: number) =>{
        if(this.time < 0) return this.reset();
        if(!this.on) return this.reset();
        if(!this.last) this.last = time;
        if(this.time !== Number((this.time - (time - this.last)/1000))){
            this.time = Number((this.time - (time - this.last)/1000));
            this.step(this.time);
        }
        this.last =time;


        if(this.last) requestAnimationFrame(this.stepWrapper)
    }

    go(duration: string | number){
        //console.log("STARTED WITH ", duration);
        if(typeof duration === "string") duration = Number(duration);
        if(Math.abs(duration - this.time) > 2) this.time = duration;
        this.on = true;
        if(!this.last ) requestAnimationFrame(this.stepWrapper);

    }

    reset(){
        this.last = 0;
        this.time = 0;
        this.on = false;
        if(this.resetFunc) this.resetFunc();
    }
}