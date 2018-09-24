interface IColorStops{
    stop: number,
    color: string
}

export class GradientReader{
    canvas : any= null
    ctx : any= null
    gr : any= null
    i : any= null
    cs : any= null

    constructor(colorStops : IColorStops[]){
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')            // get context
        this.gr = this.ctx.createLinearGradient(0, 0, 355, 0)   // create a gradient
        this.i = 0

        this.canvas.width = 355;                                // 101 pixels incl.
        this.canvas.height = 1;                                 // as the gradient

        for(; this.cs =colorStops[this.i++];)                       // add color stops
            this.gr.addColorStop(this.cs.stop, this.cs.color);

        this.ctx.fillStyle = this.gr;                                // set as fill style
        this.ctx.fillRect(0, 0, 355, 1);
    }

    getColor = (pst : number) => {
        let data = this.ctx.getImageData(pst|0, 0, 1, 1).data;
        return data
    };
}