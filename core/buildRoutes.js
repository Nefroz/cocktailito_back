const glob = require('glob');
const _ = require('underscore');

const logger = require('tracer').colorConsole();
const path = require("path");

const allRoutes = [];
const routes_by_method = {};

function addRouteMethods(methods, obj) {
    
    // const Auth = require('./AuthMiddleware');
    // const cacheMiddleware = require('./cacheMiddleware');
    // const socketMiddleware = require('./socketMiddleware');
    // const loggerMiddleware = require('./RouteLoggerMiddleware');
    const Process = require('./ProcessMiddleware');
    // // if (obj.cache) {
    // //     // methods.unshift(cacheMiddleware.set);
    // // }

    // if (obj.town) {
    //     methods.unshift(Auth.town);
    // }

    // if (obj.token) {
    //     methods.unshift(Auth.account);
    //     methods.unshift(Auth.token);
    // }

    // // methods.unshift(loggerMiddleware({ descriptionFr: route.descriptionFr }, route.token));
    methods.unshift(Process.start);
    // methods.push(socketMiddleware);
    methods.push(Process.stop);

}

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// GLOBAL ROUTE PARAMETERS //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

//ROUTER
const Router = require('express').Router();

Router.param('focus', (req, res, next, focus) => {
    var focus = Number(focus)
    req.focus = focus
    if (_.isNumber(req.focus)) next()
    else res.status(500).json(':focus has to be a number')
});

Router.param('entity', (req, res, next, entity) => {
    var entity = String(entity)
    req.entity = entity
    if (_.isString(req.entity)) next()
    else res.status(500).json(':entity has to be a string')
});

/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// OTHERS CUSTOM ROUTES /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

glob
    //search all files with js extension
    .sync( '../appHost/*.js', { ignore : [''], cwd: `${__dirname}/` })
    //map all files found above and return an array with all the exported objects from all the files
    .map(filename =>  require(`./${filename}`) )
    .map(routes => {

        //ROUTES
        if (routes !== undefined && _.isArray(routes) && routes.length > 0) {
            allRoutes.push(...routes)
        }
    })

/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// AUTOMATICALLY CREATE STANDARD ROUTES ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

// We look around all models and create automatically controllers and routes for each of them 

glob
    .sync( '../data/*.js', { ignore : [''], cwd: `${__dirname}/` })
    .map( filename => require(`./${filename}`) )
    .map( Structure => {

        

        const model = new Structure()

        if(_.isString(model.name) && model.name.length>0) {
            
            const Controller = require( "./genericControllers.js" )(model.alias)
            
            const routes = [
                {
                    name: `getAll${model.alias}`,
                    method: "get",
                    route: `${model.parent}/${model.name}`,
                    methods: [
                        Controller.get,
                    ],
                },
                {
                    name: `getOne${model.alias}`,
                    method: "get",
                    route: `${model.parent}/${model.name}/:focus`,
                    methods: [
                        Controller.get,
                    ],
                },
                {
                    name: `create${model.alias}`,
                    method: "post",
                    route: `${model.parent}/${model.name}`,
                    methods: [
                        Controller.post, 
                        Controller.get, 
                    ],
                },
                {
                    name: `updateOne${model.alias}`,
                    method: "put",
                    route: `${model.parent}/${model.name}/:focus`,
                    methods: [
                        Controller.put,
                        Controller.get,
                    ],
                },
                {
                    name: `deleteOne${model.alias}`,
                    method: "delete",
                    route: `${model.parent}/${model.name}/:focus`,
                    methods: [
                        Controller.delete
                    ],
                },
            ]

            routes.map(route => {
                route.cache = model.cache || false 
                route.token = model.token || false 
                route.module = model.alias
            })

            allRoutes.push(...routes)

        }
    })

allRoutes.map( route => {
    let routeMethods = route.methods;
    addRouteMethods(routeMethods, route)
    routes_by_method[route.method.toLowerCase()] = routes_by_method[route.method.toLowerCase()] || {}
    routes_by_method[route.method][route.route] = "Rien pour le moment"
    const check = routeMethods.filter(x => typeof(x) !== "function")
    if(check.length > 0) {
        logger.log(`The route ${route.route} has method who are not a function`)
    }
    else {
        Router.route([route.route])[route.method](routeMethods);
    }
})

logger.log(routes_by_method)

module.exports = {
    routes : allRoutes, 
    router: Router,
    routes_by_method: routes_by_method,
};