#!/usr/bin/env python
from __future__ import absolute_import, division, print_function, \
                                                    unicode_literals
import time
#import threading
import numpy as np
import asyncio
import socketio
import logging


try:
    from IOPi import IOPi
except ImportError:
    print("Failed to import IOPi from python system path")
    print("Importing from parent folder instead")
    try:
        import sys
        sys.path.append('..')
        from IOPi import IOPi
    except ImportError:
        raise ImportError(
            "Failed to import library from parent folder")

#pulses=np.zeros(8,dtype=np.uint8)



#pulses=np.zeros(8,dtype=np.uint8)
logging.basicConfig(filename='poll.log', level=logging.DEBUG)
switches=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

pulses=[0,0,0,0,0,0,0,0]
wattpulses=[0,0,0,0,0,0,0,0]
iobus = IOPi(0x20)
iobus2 = IOPi(0x21)

    # Set all pins on the IO bus to be inputs with internal pull-ups enabled.
  #sqlite3
#db.fetchdb(con)
    
iobus2.set_port_pullups(0, 0xFF)
iobus2.set_port_pullups(1, 0xFF)
iobus.set_port_pullups(0, 0xFF)
iobus.set_port_pullups(1, 0xFF)
iobus.set_port_direction(0, 0xFF)
iobus.set_port_direction(1, 0xFF)
iobus2.set_port_direction(0, 0xFF)
iobus2.set_port_direction(1, 0xFF)

    # Invert both ports so pins will show 1 when grounded
iobus.invert_port(0, 0xFF)
iobus.invert_port(1, 0xFF)
iobus2.invert_port(0, 0xFF)
iobus2.invert_port(1, 0xFF)
iobus.invert_pin(1, 0)
iobus.invert_pin(3, 0)
iobus.invert_pin(4, 0)
iobus.invert_pin(5, 0)
iobus.invert_pin(6, 0)

#iobus.invert_pin(7, 0)


    # Set the interrupt polarity to be active high and mirroring disabled, so
    # pins 1 to 8 trigger INT A and pins 9 to 16 trigger INT B
iobus2.set_interrupt_polarity(1)
iobus2.mirror_interrupts(1)

    # Set the interrupts default value to 0x00 so the interrupt will trigger when any pin registers as true
iobus2.set_interrupt_defaults(0, 0x00)
iobus2.set_interrupt_defaults(1, 0x00)

    # Set the interrupt type to be 1 for ports A and B so an interrupt is
    # fired when the pin matches the default value
iobus2.set_interrupt_type(0, 0xFF)
iobus2.set_interrupt_type(1, 0xFF)

    # Enable interrupts for all pins
iobus2.set_interrupt_on_port(0, 0xFF)
iobus2.set_interrupt_on_port(1, 0xFF)
        
sio = socketio.AsyncClient()


class poller():
        start_time=0
        last_time=0
        time_between_pulses=0
        
        
        oldpulses=np.empty(0)
        async def poll(self):
            while 1:   
                
                 
                
                ports_on=iobus.read_port(0)    
                
                if ports_on>0:
                    
                    newpulses=np.empty(0)
                    poller.last_time=poller.start_time
                    poller.start_time = time.perf_counter() 
                    poller.time_between_pulses=poller.start_time-poller.last_time
                   ## logging.debug(f'{ poller.time_between_pulses} time between pulses')
                    a = np.array([ports_on],dtype=np.uint8)
                    b=np.unpackbits(a,bitorder='little')
                    result = np.where(b == 1)
                   ## logging.debug(f'{result} bits on') 
                    for r in result:
                        for i in r:
                                       
                            newpulses=np.append(newpulses,i)

                       ## logging.debug(f'{newpulses} newpulses')                             
                    if poller.time_between_pulses<0.035:
                       ## logging.debug('possible doublepulse')
                       ## logging.debug(f'{ poller.oldpulses} pulses that came earlier')
                        
                        s=np.isin(newpulses,poller.oldpulses,invert=True)
                       ## logging.debug(f'{s} difference')
                        #mask=np.empty(0,dtype=np.uint8)
                        mask=newpulses[s]
                        poller.oldpulses=np.copy(newpulses)
                        for x in mask:
                            f=x.astype(np.int64)
                            pulses[f]=pulses[f]+1
                            wattpulses[f]=wattpulses[f]+1
                        ##    logging.debug('writing pulse')
                      ##  logging.debug(f'{pulses} pulses written after compare')
                    else:
                      ##  logging.debug('writing normally')
                      ##  logging.debug(f'{newpulses} newpulses')
                        for x in newpulses:
                            
                             f=x.astype(np.int64)
                             pulses[f]=pulses[f]+1
                             wattpulses[f]=wattpulses[f]+1
                        poller.oldpulses=np.copy(newpulses)
                       # logging.debug(f'{pulses} pulses written normally')
                                             
                await asyncio.sleep(0.02)
        async def display_pulses(self):
   
            while True:
                global pulses
                global sio
              
                print(pulses)
                await sio.emit('pulses',{'pulses':{'pulses':pulses}})
                pulses=[0,0,0,0,0,0,0,0]
                await asyncio.sleep(5)
        async def display_watts(self):
   
            while True:
                global wattpulses
                global sio               
                print(wattpulses)     #2000 pulses per kwh
                watts=[0,0,0,0,0,0,0,0]
                for i in range(len(wattpulses)):
                    watts[i]=wattpulses[i]/2000*60*1000
                    watts[i]=round(watts[i],0)
                    
                await sio.emit('watts',{'watts':watts})
                wattpulses=[0,0,0,0,0,0,0,0]
                await asyncio.sleep(60)
        
        async def pollinput(self):
            global sio
            while True:
   
                if (iobus2.read_interrupt_status(1) != 0):
            
         
                    for i in range(len(switches)):
                        pinread=iobus2.read_pin(i+1)
                        if (pinread==1) and (pinread != switches[i]):
                            swnum=i
                            switches[i]=1
                            print(switches)
                            await sio.emit('ioboard', {'switchstate':{'num':swnum+1,'state':pinread}})

                        elif (pinread==0) and (pinread != switches[i]):
                            switches[i]=0
                            swnum=i
                            print(switches)
                            await sio.emit('ioboard', {'switchstate':{'num':swnum+1,'state':pinread}})

              
                await asyncio.sleep(1)
        



 
                


#threading.Thread(target=poller1.poll).daemon
#threading.Thread(target=poller1.poll).start()
poller1=poller()
   

@sio.on('switchquery')
async def on_message(data):
    print(data)
    pinread=iobus2.read_pin(data) 
    await sio.emit('ioboard', {'switchstate':{'num':data,'state':bool(pinread)}})
        

async def main():
    await sio.connect('http://localhost:3000')
    print('my sid is', sio.sid)
    
    await asyncio.gather(
        poller1.display_pulses(),
        poller1.display_watts(),
        poller1.pollinput(),
        poller1.poll()
        
       
    )   
   
if __name__ == "__main__":
        
        asyncio.run(main())
       
       
        
        
           


  
   
   

