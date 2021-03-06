module.exports = dbConf = {
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }

}