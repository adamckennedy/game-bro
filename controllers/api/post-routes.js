const router = require('express').Router();
const { User, Post, Comment, Vote } = require('../../models');



// get all 
router.get('/', (req, res) => {
   Post.findAll({
   // order: [['created_at', 'DESC']],
    attributes: [
      'id',
      'post_url',
      'title',
      'user_id',
    ],
    include: [
      // include the Comment model here:
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id'],
        include: {
          model: User,
          attributes: ['username', 'twitch']
        }
      },
      {
        model: User,
        attributes: ['username', 'twitch']
      }
    ]
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
        id: req.params.id
      },
      attributes: ['id', 'post_url', 'title', 'user_id'],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id'],
        },
        {
          model: User,
          attributes: ['username', 'twitch'],
        },
        {
        model: Vote,
        attributes: ['id', 'vote'],
        }
      ]
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
      post_url: req.body.post_url,
      user_id: req.body.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  // PUT /api/posts/upvote
  router.put('/upvote', (req, res) => {
    Post.upvote(req.body, { Vote })
      .then(updatedPostData => res.json(updatedPostData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  });

  router.delete('/:id', (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
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