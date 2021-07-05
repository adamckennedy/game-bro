const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    User.findAll({
        attributes: ['id', 'username', 'email', 'password'],
        include: [
            {
            model: Comment,
            attributes: ['id', 'user_id', 'post_id', 'comment_text'],
            },
            {
            model: Post,
            attributes: ['id', 'title', 'post_url', 'user_id'],
            },
        ],
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: ['id', 'username', 'email', 'password'],
        where: {
            id: req.params.id
        },
        include: {
            model: Post,
            attributes: ['id', 'title', 'post_url', 'user_id'],
        },
        model: Comment,
        attributes: ['id', 'user_id', 'post_id', 'comment_text'], 
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: 'No User found with this id'});
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        //access session information in the routes
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
        //    req.session.twitch = dbUserData.twitch;
            req.session.loggedIn = true;
            res.json(dbUserData);
        });
    });
    // .then(dbUserData => res.json(dbUserData))
    // .catch(err => {
    //     console.log(err);
    //     res.status(500).json(err);
    });

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(400).json({
                message: 'User with that email address not found!' 
            });
            return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);
       

        if (!validPassword) {
            res.status(400).json({
                message: 'Wrong Password!'
            });
            return;
        }

        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
           // req.session.twitch = dbUserData.twitch;
            req.session.loggedIn = true;

            res.json({
                user: dbUserData, 
                message: ' You are now logged in!'
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    });
});


//logout
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
})

// PUT /api/users/1
router.put('/:id', (req, res) => {
    User.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData[0]) {
            res.status(404).json({
                message: 'No user found with this id'
            });
            return;
        }
        res.json(dbUserData);
       })
       .catch(err => {
           console.log(err);
           res.status(500).json(err);
       });
    });

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
        User.destroy({
          where: {
            id: req.params.id
          }
        })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      });


module.exports = router;
