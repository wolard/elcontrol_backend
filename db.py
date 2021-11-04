import sqlite3
import asyncio

def connect():
    con = sqlite3.connect('./db/elcontrol.db')
    return con
def fetchdb(con):
    cur = con.cursor()
    for row in cur.execute('SELECT * FROM kwh ORDER BY id'):
        print(row)
def updatedb(outlet):
    con = sqlite3.connect('./db/elcontrol.db')
    sql = ''' UPDATE elcontrol
              SET 'kwh' = ?
                 
              WHERE id = ?'''
    cur = con.cursor()
    cur.execute(sql, outlet)
    print("saving to db")
    con.commit()
    con.close()
    
