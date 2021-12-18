const seedDb = async (user, car,elControl,authorize,kwhs) => {

    await user.create({
        firstname: 'klaus',
        surname: 'sandell',
        serialnumber: 1
    });
    await user.create({
        firstname: 'aatos',
        surname: 'sandell',
        serialnumber: 2
    });
    await car.create({
        model: 'ka',
        make: 'ford',
        userserialnumber: 1
    });
    await car.create({
        model: 'bx',
        make: 'citroen',
        userserialnumber: 2
    });
   
    let defaultlogin=[
        {'name':'wolard','hash':'$2b$10$o2Pju99MOZfaPqRuxCwTLe1a3qejkeB/ebJvHz.jf0gWP1u8ugFmG','role':'Admin'}
        ]
        for (var i = 0; i < defaultlogin.length; i++) {
      await  authorize.create({ 
            name: defaultlogin[i].name,
            hash: defaultlogin[i].hash,
            role: defaultlogin[i].role
                    
        }); 
    }
    let elControlValues=[
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
          for (var i = 0; i < elControlValues.length; i++) {
           // console.log(elControlValues[i].card)
          // loop through all users
         await elControl.create({ 
              card: elControlValues[i].card,
              relay: elControlValues[i].relay,
              type: elControlValues[i].type,
              groupname: elControlValues[i].groupname,
              title: elControlValues[i].title,
              status: elControlValues[i].status,
              kwh: elControlValues[i].kwh
              
           
          }); 
        }
       // await kwhs.create({'elcontrolrelay':1,'pulses':0});
};
exports.seedDb = seedDb