const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');


router.get('/', (req, res) => {
  Post.findAll({
    where: {
      user_id: req.session.user_id,
      loggedIn: req.session.loggedIn
    },
    attributes: ['id', 'title', 'user_id', 'post_content'],
    include: [
      {
        model: Comment,
        attributes: ['id', 'user_id', 'post_id'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));
      res.render('dashboard', { posts, loggedIn: true });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/edit/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
      loggedIn: req.session.loggedIn
    },
    attributes: ['id', 'title', 'user_id', 'post_content'],
    include: [
      {
        model: Comment,
        attributes: ['id', 'user_id', 'post_id'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      const post = dbPostData.get({ plain: true });

      res.render('edit-post', {
        post,
        loggedIn: true
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