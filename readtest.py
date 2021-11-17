#!/usr/bin/env python

"""
================================================
ABElectronics IO Pi | Digital I/O Read Demo
Requires python smbus to be installed
For Python 2 install with: sudo apt-get install python-smbus
For Python 3 install with: sudo apt-get install python3-smbus
run with: python demo_ioread.py
================================================
This example reads from all 16 pins on both buses on the IO Pi.
The internal pull-up resistors are enabled so each pin will read
as 1 unless the pin is connected to ground.
"""
from __future__ import absolute_import, division, print_function, \
                                                    unicode_literals
import time
import os

try:
    from IOPi import IOPi
except ImportError:
    print("Failed to import IOPi from python system path")
    print("Importing from parent folder instead")
    try:
        import sys
        sys.path.append("..")
        from IOPi import IOPi
    except ImportError:
        raise ImportError(
            "Failed to import library from parent folder")


def main():
    pulses=[0,0,0]
    """
    Main program function
    """
    iobus1 = IOPi(0x20)
    iobus2 = IOPi(0x21)

    # We will read the inputs 1 to 16 from the I/O bus so set port 0 and
    # port 1 to be inputs and enable the internal pull-up resistors
    iobus1.set_port_direction(0, 0xFF)
    iobus1.set_port_pullups(0, 0xFF)
    iobus1.invert_port(0, 0x00)
    iobus1.invert_pin(7, 0)

    iobus1.set_port_direction(1, 0xFF)
    iobus1.set_port_pullups(1, 0xFF)
   
    
    # Repeat the steps above for the second bus
    iobus2.set_port_direction(0, 0xFF)
    iobus2.set_port_pullups(0, 0xFF)

    iobus2.set_port_direction(1, 0xFF)
    iobus2.set_port_pullups(1, 0xFF)

    while True:
        # clear the console
            


     
        val=iobus1.read_pin(1)
        print (val)
      
      
         
         
        time.sleep(0.03)
      

        # wait 0.5 seconds before reading the pins again
    


if __name__ == "__main__":
    main()
