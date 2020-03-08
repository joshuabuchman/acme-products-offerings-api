const router = require('express').Router()
const { models: { Product, Company, Offering }} = require('./db')

const _routes = [
    { path: '/products', model: Product},
    { path: '/companies', model: Company},
    { path: '/offerings', model: Offering}
];

_routes.forEach( route => {
    router.get(route.path, (req, res, next) =>
    {
        route.model.findAll()
        .then(data => res.send(data))
        .catch(next)
    })
})

module.exports = router