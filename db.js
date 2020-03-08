const pg = require('pg')
const Sequelize = require('sequelize')
const conn = new Sequelize(process.env.DATABASE_URL  || 'postgres://localhost/pco_db')

const Product = conn.define('product',
{
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    suggestedPrice: {
        type: Sequelize.DECIMAL,
        allowNull: false
    }
})
const Company = conn.define('company',
{
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
})
const Offering = conn.define('offering',
{
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    price: {
        type: Sequelize.DECIMAL,
        allowNull: false
    }
})

Offering.belongsTo(Company)
Offering.belongsTo(Product)
Company.hasMany(Offering)
Product.hasMany(Offering)

const sync = async() =>
{ 
    await conn.sync({ force: true })
    const _product = [{ name: 'TV', suggestedPrice: 1000 }, { name: 'Laptop', suggestedPrice: 1400 }, { name: 'Phone', suggestedPrice: 696 }]
    const _company = ['Google', 'Apple', 'Microsoft']
    const [[tv, laptop, phone],[google, apple , microsoft]] = await Promise.all([
        Promise.all(_product.map( product => Product.create({ name: product.name, suggestedPrice: product.suggestedPrice }))),
        Promise.all(_company.map( name => Company.create({ name })))
    ]);    
    const [ offering1, offereing2, offereing3 ] = await Promise.all([
        Offering.create({ price: (Math.random() * ((phone.suggestedPrice * 1.1)-(phone.suggestedPrice * .9)) + (phone.suggestedPrice * .9)).toFixed(2), productId: phone.id, companyId: microsoft.id }),
        Offering.create({ price: 1399.99, productId: laptop.id, companyId: apple.id }),
        Offering.create({ price: 9999.99, productId: tv.id, companyId: google.id })
    ]);
}

module.exports = 
{ 
    sync,
    models: {
        Product,
        Company,
        Offering
    }
}
