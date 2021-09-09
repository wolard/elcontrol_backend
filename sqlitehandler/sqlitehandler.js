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
                        else    resolve(console.log(this.path))
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
        close() {
            return new Promise((resolve, reject)=> {
                this.db.close()
                resolve(console.log('closed'))
            }) 

        }
}
         module.exports = sqLiteHandler;