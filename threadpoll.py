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
import db
import time
import threading
import numpy as np
import asyncio

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
pulses=[0,0,0,0]
pulses1=0
pulses2=0
iobus = IOPi(0x20)

    # Set all pins on the IO bus to be inputs with internal pull-ups enabled.
  #sqlite3
#db.fetchdb(con)
    
iobus.set_port_pullups(0, 0xFF)
iobus.set_port_pullups(1, 0xFF)
iobus.set_port_direction(0, 0xFF)
iobus.set_port_direction(1, 0xFF)

    # Invert both ports so pins will show 1 when grounded
iobus.invert_port(0, 0xFF)
iobus.invert_port(1, 0xFF)

    # Set the interrupt polarity to be active high and mirroring disabled, so
    # pins 1 to 8 trigger INT A and pins 9 to 16 trigger INT B
iobus.set_interrupt_polarity(1)
iobus.mirror_interrupts(0)

    # Set the interrupts default value to 0x00 so the interrupt will trigger when any pin registers as true
iobus.set_interrupt_defaults(0, 0x00)
iobus.set_interrupt_defaults(1, 0x00)

    # Set the interrupt type to be 1 for ports A and B so an interrupt is
    # fired when the pin matches the default value
iobus.set_interrupt_type(0, 0xFF)
iobus.set_interrupt_type(1, 0xFF)

    # Enable interrupts for all pins
iobus.set_interrupt_on_port(0, 0xFF)
iobus.set_interrupt_on_port(1, 0xFF)



  
class poller(threading.Thread):
    def poll(self, pin):
        while 1:            
            # get the interrupt status for INTA
            if iobus.read_pin(pin)==1:
                pulses[pin-1]=pulses[pin-1]+1
                print(pulses)
                time.sleep(0.5)
            else:
                time.sleep(0.02)
           
def writedb():
    con=db.connect()
   
    while 1:
  
        db.updatedb(con,(pulses[0],pulses[1],pulses[2],pulses[3],1))       
        print('writing')
        db.fetchdb(con)

        time.sleep(10)
       


def main():

      '''
    Main program function
    '''
    
    
    




if __name__ == "__main__":
  
  poller1=poller()
  for i in range(1,10):
    threading.Thread(target=poller1.poll, args=(i,)).daemon
    threading.Thread(target=poller1.poll, args=(i,)).start()
threading.Thread(target=writedb, ).daemon
threading.Thread(target=writedb ).start()


  
   
   

