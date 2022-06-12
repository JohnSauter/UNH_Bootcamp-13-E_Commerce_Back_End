const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const user_data = await Tag.findAll({
      include: [Product]
    });
    res.status(200).json(user_data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag_id = req.params.id;
    const user_data = await Tag.findByPk(tag_id, {
      include: [Product]
    });
    if (user_data == null) {
      res.status(404).end();
    } else {
      res.status(200).json(user_data);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  /* req.body should look like this:
  {
   "tag_name": "new tag"
  }
  */
  try {
    const the_tag = await Tag.create(req.body);
    res.status(201).json(the_tag);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const user_data = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    if (user_data == null) {
      res.status(404).end();
    } else {
      res.status(200).json(user_data);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one tag by its `id` value
  try {
    const tag_id = req.params.id;
    const user_data = await Tag.findByPk(tag_id);
    if (user_data == null) {
      res.status(404).end();
    } else {
      Tag.destroy({
        where: { id: tag_id }
      });
      res.status(200).json(user_data);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
