
 
 const seed=(Elcontrol)=> {
   
    let defaultvalues=[
{'card':1,'relay':1,'type':'toggle','groupname':'pistorasiat','title':'tolppa 1','status':0,'kwh':0},
{'card':1,'relay':2,'type':'toggle','groupname':'pistorasiat','title':'tolppa 2','status':0,'kwh':0},
{'card':1,'relay':3,'type':'toggle','groupname':'pistorasiat','title':'tolppa 3','status':0,'kwh':0},
{'card':1,'relay':4,'type':'toggle','groupname':'pistorasiat','title':'tolppa 4','status':0,'kwh':0},
{'card':1,'relay':5,'type':'toggle','groupname':'pistorasiat','title':'tolppa 5','status':0,'kwh':0},
{'card':1,'relay':6,'type':'toggle','groupname':'pistorasiat','title':'tolppa 6','status':0,'kwh':0},
{'card':1,'relay':7,'type':'toggle','groupname':'pistorasiat','title':'tolppa 7','status':0,'kwh':0},
{'card':1,'relay':8,'type':'toggle','groupname':'pistorasiat','title':'tolppa 8','status':0,'kwh':0},
{'card':1,'relay':9,'type':'toggle','groupname':'pistorasiat','title':'tolppa 9','status':0,'kwh':0},
{'card':1,'relay':10,'type':'toggle','groupname':'valot','title':'Laiturin Valo Oikea','status':0,'kwh':0},
{'card':1,'relay':11,'type':'toggle','groupname':'valot','title':'Laiturin Valo Vasen','status':0,'kwh':0},
{'card':1,'relay':12,'type':'toggle','groupname':'valot','title':'Lähestymisvalot','status':0,'kwh':0},

]
 Elcontrol.sync({ force: true })

  //User.sync({ force: true }) // Using 'force: true' for demo purposes. It drops the table users if it already exists and then creates a new one.
    .then(()=> {
      // Add default users to the database
      for (var i = 0; i < defaultvalues.length; i++) {
        // loop through all users
        Elcontrol.create({ 
            card: defaultvalues[i].card,
            relay: defaultvalues[i].relay,
            type: defaultvalues[i].type,
            groupname: defaultvalues[i].groupname,
            title: defaultvalues[i].title,
            status: defaultvalues[i].status,
            kwh: defaultvalues[i].kwh
            
         
        }); 
      }
    });
 }
exports.seed = seed;
