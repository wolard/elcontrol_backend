const  jsonparser = () => {
    const fs = require('fs')
    fs.readFile('example.json', 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
return data
      })

};

exports.parse=jsonparser