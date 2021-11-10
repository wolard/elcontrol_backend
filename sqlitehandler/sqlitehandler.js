const sqlite3 = require('sqlite3').verbose();

class sqLiteHandler {
    constructor(path) {
        this.path=path;
    }
    openSqlitesync()  {
       
            this.db = new sqlite3.Database(this.path, 
                (err)=> {
                    if(err) console.log(err.message)
                    else    console.log('opened');
                })   
           
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
        update(query, params) {
    
        this.db.run(query, params, (err, row) =>  {
            if(err)     return console.error(err.message);
            else {
                console.log(`Row(s) updated: ${this.db.changes}`);
            }
        })
    
}
        close() {
            return new Promise((resolve, reject)=> {
                this.db.close()
                resolve()
            }) 

        }
        
        closesync() {
           
                this.db.close()
              console.log('closed')
        

        }
}
         module.exports = sqLiteHandler;