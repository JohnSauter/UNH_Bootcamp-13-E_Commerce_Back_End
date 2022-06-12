const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const user_data = await Category.findAll({
      include: [Product]
    });
    res.status(200).json(user_data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const category_id = req.params.id;
    const user_data = await Category.findByPk(category_id, {
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
  // create a new category
  /* req.body should look like this:
   {
    "category_name": "new category"
   }
   */
  try {
    const the_category = await Category.create(req.body);
    res.status(201).json(the_category);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const user_data = await Category.update(req.body, {
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
  // delete a category by its `id` value
  try {
    const category_id = req.params.id;
    const user_data = await Category.findByPk(category_id);
    if (user_data == null) {
      res.status(404).end();
    } else {
      Category.destroy({
        where: { id: category_id }
      });
      res.status(200).json(user_data);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
