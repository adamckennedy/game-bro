const router = require('express').Router();
const homeRoutes = require('./home-routes.js');
const apiRoutes = require('./api');

// define paths to the API routes
router.use('/', homeRoutes);
router.use('/api', apiRoutes);


router.use((req, res) => {
    res.status(404).end();
});

//router.use('/', homeRoutes);
module.exports = router;
