const sequelize = require("../config/connection");
const {User} = require("../models")

const seed = async ()=>{
    await sequelize.sync({force:true})
    const users = await User.bulkCreate([
        {
            email:"joe@joe.joe",
            password:"password"
        },
        {
            email:"niles@joe.joe",
            password:"wordpass"
        },
        {
            email:"frantz@joe.joe",
            password:"worldeworlde"
        },
        {
            email:"nile@joe.joe",
            password:"yayforcats"
        },
        {
            email:"lindsay@joe.joe",
            password:"ilikedogstho"
        },
    ],{individualHooks:true})
    console.log(users);
}
seed();