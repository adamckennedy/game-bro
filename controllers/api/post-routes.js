const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const sequelize = require('../../config/connection');


// get all 
router.get('/', (req, res) => {
   Post.findAll({
   // order: [['created_at', 'DESC']],
    attributes: [
      'id',
      'title',
      'user_id',
      'post_content'
    ],
    include: [
      // include the Comment model here:
      {
        model: Comment,
      //  as: 'comments',
        attributes: ['id', 'user_id', 'post_id'],
        include: {
          model: User,
          attributes: ['id', 'username', 'email']
        },
        },      {
        model: User,
        attributes: ['id', 'username', 'email']
      }
    ],
   })
   .then(dbPostData => res.json(dbPostData))
   .catch(err => {
     console.log(err);
     res.status(500).json(err);
   });

});

   router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id,
        loggedIn: req.session.loggedIn
      },
      attributes: ['id', 'title', 'user_id', 'post_content'],
      include: [
        {
          model: Comment,
      //    as: 'comments',
          attributes: ['id', 'user_id', 'post_id'],
        },
        {
          model: User,
          attributes: ['id', 'username', 'email'],
        },
      ],
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });


  router.post('/', (req, res) => {
    Post.create({
      title: req.body.title,
      post_content: req.body.post_content,
      user_id: req.session.user_id,
      loggedIn: req.session.loggedIn
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.put('/:id', (req, res) => {
    Post.update({
        title: req.body.title,
        post_content: req.body.post_content
      },
      {
        where: {
          id: req.params.id,
          loggedIn: req.session.loggedIn
        }
      })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.delete('/:id', (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id,
        
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  module.exports = router;