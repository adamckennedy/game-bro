const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth')


router.get('/', withAuth, (req, res) => {
    Post.findAll({
      where: {
        user_id: req.session.user_id,
        loggedIn: req.session.loggedIn
      },
      attributes: ['id', 'title', 'user_id', 'post_content'],
      include: [
        {
          model: User,
          attributes: ['username', 'twitch']
        }
      ]
    })
      .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('dashboard', { posts, loggedIn: req.session.loggedin });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

 

  router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
      where: {
        user_id: req.session.user_id,
        id: req.params.id,
      },
      attributes: ['id', 'title', 'user_id', 'post_content'],
      include: [
        {
          model: User,
          attributes: ['username', 'twitch']
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'Oops, this is not your review! You are only authorized to edit your own!' });
          return;
        }
  
        const post = dbPostData.get({ plain: true });

        res.render('edit-post', {
            post,
            loggedIn: req.session.loggedIn
            });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.get('/create', withAuth, (req, res) => { 
  res.render('create-post', {
    loggedIn: req.session.loggedIn
  }); 
});


module.exports = router;
