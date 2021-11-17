module.exports = (sequelize, Sequelize) => {
const Authorize = sequelize.define("authorize", {
    name: {
        type: Sequelize.STRING
      },
      hash: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING
      }

});



let defaultlogin=[
    {'name':'wolard','hash':'$2b$10$o2Pju99MOZfaPqRuxCwTLe1a3qejkeB/ebJvHz.jf0gWP1u8ugFmG','role':'Admin'}
    ]
    Authorize.sync()
   /*
    .then(()=> {
        for (var i = 0; i < defaultlogin.length; i++) {
         
          Authorize.create({ 
              name: defaultlogin[i].name,
              hash: defaultlogin[i].hash,
              role: defaultlogin[i].role
                      
          }); 
        }
     
  });
  */
  return Authorize
}
  
