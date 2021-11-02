import sqlite3
import asyncio

def connect():
    con = sqlite3.connect('./db/elcontrol.db')
    return con
def fetchdb(con):
    cur = con.cursor()
    for row in cur.execute('SELECT * FROM kwh ORDER BY id'):
        print(row)
def updatedb(con,outlet):

    sql = ''' UPDATE kwh
              SET '1' = ? ,
                  '2' = ? ,
                  '3' = ?,
                  '4' = ?
              WHERE id = ?'''
    cur = con.cursor()
    cur.execute(sql, outlet)
    con.commit()
