import {Users,Authorize,Elcontrol, ElControlCreationAttributes, AuthCreationAttributes} from '../models/models';
export const seedDb = async () => {
  const users = new Users({ firstname:'klaus',serialnumber:1,surname:'sandell'});
  const defaultlogin:AuthCreationAttributes[]=[
    {username:'wolard',hash:'$2b$10$o2Pju99MOZfaPqRuxCwTLe1a3qejkeB/ebJvHz.jf0gWP1u8ugFmG',role:'Admin'}
    ]
    for (let i = 0; i < defaultlogin.length; i++) {
  const auth=new Authorize({ 
        username: defaultlogin[i].username,
        hash: defaultlogin[i].hash,
        role: defaultlogin[i].role
                
    }); 
    auth.save()
}
  users.save()
  const elControlValues:ElControlCreationAttributes[]=[
    {'card':1,'relay':1,'type':'toggle','groupname':'pistorasiat','title':'tolppa 1','kwh':0},
    {'card':1,'relay':2,'type':'toggle','groupname':'pistorasiat','title':'tolppa 2','kwh':0},
    {'card':1,'relay':3,'type':'toggle','groupname':'pistorasiat','title':'tolppa 3','kwh':0},
    {'card':1,'relay':4,'type':'toggle','groupname':'pistorasiat','title':'tolppa 4','kwh':0},
    {'card':1,'relay':5,'type':'toggle','groupname':'pistorasiat','title':'tolppa 5','kwh':0},
    {'card':1,'relay':6,'type':'toggle','groupname':'pistorasiat','title':'tolppa 6','kwh':0},
    {'card':1,'relay':7,'type':'toggle','groupname':'pistorasiat','title':'tolppa 7','kwh':0},
    {'card':1,'relay':8,'type':'toggle','groupname':'pistorasiat','title':'tolppa 8','kwh':0},
    {'card':1,'relay':9,'type':'toggle','groupname':'pistorasiat','title':'tolppa 9','kwh':0},
    {'card':1,'relay':10,'type':'toggle','groupname':'valot','title':'Laiturin Valo Oikea','kwh':0},
    {'card':1,'relay':11,'type':'toggle','groupname':'valot','title':'Laiturin Valo Vasen','kwh':0},
    {'card':1,'relay':12,'type':'toggle','groupname':'valot','title':'Lähestymisvalot','kwh':0},
      ]
      for (let i = 0; i < elControlValues.length; i++) {
     const elc=new Elcontrol({ 
           card: elControlValues[i].card,
           relay: elControlValues[i].relay,
           type: elControlValues[i].type,
           groupname: elControlValues[i].groupname,
           title: elControlValues[i].title,
           kwh: elControlValues[i].kwh
           
        
       }); 
       elc.save()
      }
}


