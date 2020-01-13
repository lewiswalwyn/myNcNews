const app = require("./app.js");
const port = process.env.PORT || 9091;

app.listen(port, ((err) => { 
    if(err) throw err
    else console.log(`listening on port ${port}`)
}))