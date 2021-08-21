const router = require('express').Router();
const session = require('express-session');
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
  console.log(req.session);
    Post.findAll({

      //  [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    
      
      include: [
      //   {
      //     model: Comment,
      //     attributes: ['id', 'user_id', 'post_id', 'comment_text'],
      //     include: {
      //       model: User,
      //       attributes: ['username']
      //     }
      //   },
        {
          model: User,
          attributes: { exclude: 'password' }
        }
      ]
    })
      .then(dbPostData => {
        // pass a single post object into the homepage template
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
      res.render('login')
    });
  // router.get('/login', (req, res) => {
  //   res.render('login');
  // });

  router.get('/signup', (req, res) => {
    res.render('signup');
  });



  router.get('/dashboard', (req, res) => {
    console.log(req.session);
      Post.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: 'password' }
          }
        ]
      })
        .then(dbPostData => {
          // pass a single post object into the homepage template
          const posts = dbPostData.map(post => post.get({ plain: true }));
          res.render('dashboard', {
              posts,
              loggedIn: req.session.loggedIn
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    });

  


  router.get('/post/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'title',  'user_id'],
      include: [
        {
          model: Comment,
          attributes: ['id', 'user_id', 'post_id'],             
          include: {
            model: User,
            attributes: ['username']
          }
        },
        // {
        // model: Vote,
        // attributes: ['id', 'vote']
        // },
        {
        model: User,
        attributes: ['username']
        }
      ]
    })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({
          message: 'No post found with this id!'
        });
        return;
      } 
      //const post = dbPostData.get({ plain: true});
      const posts = dbPostData.map(post => post.get({ plain: true }));
      console.log(post);

      res.render('edit-post', {
        posts,
        loggedIn: req.session.loggedIn
      });

      
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });


 


  });



module.exports = router;
