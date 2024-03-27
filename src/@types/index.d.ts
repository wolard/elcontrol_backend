export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  light: (light:ILight) => void;
  outlet: (light:IOutlet) => void;
  watts: (index:number,kwh:number) => void;
  outputStatus(statuses:boolean[])
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
export interface Irelay{
  card:number
  relay:number
}
export interface ILight extends Irelay{
 
  type:string
  status:boolean
  title?:string
  }
  export interface IOutlet extends Irelay{
 
    type:string
    status:boolean
    title?:string
    
     
  }