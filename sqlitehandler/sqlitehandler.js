const sqlite3 = require('sqlite3').verbose();

class sqLiteHandler {
    constructor(path) {
        this.path=path;
    }
     openSqlite()  {
            return new Promise((resolve, reject) => {
                this.db = new sqlite3.Database(this.path, 
                    (err)=> {
                        if(err) reject("Open error: "+ err.message)
                        else    resolve()
                    })   
                })
        }
         fetchall(query, params)  {
            return new Promise((resolve, reject) => {
                if(params == undefined) params=[]

                this.db.all(query, params, (err, rows)=>  {
                    if(err) reject("Read error: " + err.message)
                    else {  resolve(rows)
                    }
                })
            }) 
        }
        fetchone(query, params) {
    return new Promise((resolve, reject) => {
        this.db.get(query, params, (err, row) =>  {
            if(err) reject("Read error: " + err.message)
            else {
                resolve(row)
            }
        })
    }) 
}
        close() {
            return new Promise((resolve, reject)=> {
                this.db.close()
                resolve()
            }) 

        }
}
         module.exports = sqLiteHandler;