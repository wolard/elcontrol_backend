#!/usr/bin/env python
"""
================================================
ABElectronics IO Pi | - IO Interrupts Demo

Requires python smbus to be installed
For Python 2 install with: sudo apt-get install python-smbus
For Python 3 install with: sudo apt-get install python3-smbus

run with: python demo_iointerruptsthreading.py
================================================

This example shows how to use the interrupt methods with threading
on the IO port.

The interrupts will be enabled and set so that pin 1 will trigger INT A and B.

Internal pull-up resistors will be used so grounding
one of the pins will trigger the interrupt

using the read_interrupt_capture or reset_interrupts methods
will reset the interrupts.

"""

from __future__ import absolute_import, division, print_function, \
                                                    unicode_literals

import time
import threading
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
pulses=[0,0,0,0,0,0,0,0]
#pulses=np.zeros(8,dtype=np.uint8)



#pulses=np.zeros(8,dtype=np.uint8)
logging.basicConfig(level=logging.DEBUG)
switches=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

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
iobus.invert_pin(3, 0)
iobus.invert_pin(4, 0)
iobus.invert_pin(5, 0)
#iobus.invert_pin(6, 0)
#iobus.invert_pin(7, 0)
#iobus.invert_pin(8, 0)
iobus.invert_pin(1, 0)
iobus.invert_pin(2, 0)


#iobus.invert_pin(7, 0)



iobus2.invert_port(0, 0xFF)
iobus2.invert_port(1, 0xFF)



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


class poller(threading.Thread):
        start_time=0
        last_time=0
        time_between_pulses=0
        
        newpulses=np.empty(0)
        oldpulses=np.empty(0)
        def poll(self):
            while 1:   
                
                 
                
                ports_on=iobus.read_port(0)    
                
                if ports_on>0:
                    
                    
                    poller.last_time=poller.start_time
                    poller.start_time = time.perf_counter() 
                    
                    a = np.array([ports_on],dtype=np.uint8)
                    b=np.unpackbits(a,bitorder='little')
                    result = np.where(b == 1)
                    logging.debug(f'{result} bits on') 
                    poller.time_between_pulses=poller.start_time-poller.last_time
                    logging.debug(f'{ poller.time_between_pulses} time between pulses')
                    for r in result:
                        for i in r:
                            
                           
                               
                                newpulses=np.append(poller.newpulses,i)
                                logging.debug(f'{newpulses} this pulse') 
                                #x=np.isin(newpulses,poller.oldpulses,invert=True)
                             
                                
                                
                                
                             
                              
                    if poller.time_between_pulses<0.03:
                        logging.debug('possible doublepulse')
                        logging.debug(f'{ poller.oldpulses} pulses that came earlier')
                        
                        s=np.isin(newpulses,poller.oldpulses,invert=True)
                        logging.debug(f'{s} difference')
                        #mask=np.empty(0,dtype=np.uint8)
                        mask=newpulses[s]
                        poller.oldpulses=np.copy(newpulses)
                        for x in mask:
                            f=x.astype(np.int64)
                            pulses[f]=pulses[f]+1
                            logging.debug('writing pulse')

                    else:
                        logging.debug('writing normally')
                        pulses[i]=pulses[i]+1
                        poller.oldpulses=np.copy(newpulses)
                                
                                 
                           # else: 
                             #   pulses[i]=pulses[i]+1
                              #  poller.oldpulses=np.copy(poller.newpulses)
                              #  logging.debug(f'{ poller.oldpulses} copied newpulses')
                              #  poller.newpulses=[]
                   
                           
                            
                        
                            
                                
                    print(pulses)         
                             
                
               
                
                #print(end_time-start_time)
              
                time.sleep(0.020)
        
        
      
                 
async def main():

    sio = socketio.AsyncClient()
    await sio.connect('http://localhost:3000')
    await sio.emit('join','chat')
    print('my sid is', sio.sid)
    

    while 1:
        await sio.emit('chat', {'message':{'pulses':pulses},'room':'chat'})
        print(pulses)
        # read the interrupt status for each port.  
        # If the status is not 0 then an interrupt has occured on one of the pins 
        # so read the value from the interrupt capture.

        if (iobus2.read_interrupt_status(0) != 0):
            
            
            for i in range(len(switches)):
                pinread=iobus2.read_pin(i+1)
                if (pinread==1) and (pinread != switches[i]):
                    swnum=i
                    switches[i]=1
                    print(switches)
                    await sio.emit('chat', {'message':{'num':swnum,'state':pinread},'room':'chat'})

                elif (pinread==0) and (pinread != switches[i]):
                    switches[i]=0
                    swnum=i
                    print(switches)
                    await sio.emit('chat', {'message':{'num':swnum,'state':pinread},'room':'chat'})

        if (iobus2.read_interrupt_status(1) != 0):
                
            
            for i in range(len(switches)):
                pinread=iobus2.read_pin(i+1)
                if (pinread==1) and (pinread != switches[i]):
                    swnum=i
                    switches[i]=1
                    print(switches)
                    await sio.emit('chat', {'message':{'num':swnum,'state':pinread},'room':'chat'})

                elif (pinread==0) and (pinread != switches[i]):
                    switches[i]=0
                    swnum=i
                    print(switches)
                    await sio.emit('chat', {'message':{'num':swnum,'state':pinread},'room':'chat'})
                    

                    
               
                

            
            
        await asyncio.sleep(1)
poller1=poller()

threading.Thread(target=poller1.poll).daemon
threading.Thread(target=poller1.poll).start()




    

  
    
   
if __name__ == "__main__":
        
        asyncio.run(main())
           


  
   
   

