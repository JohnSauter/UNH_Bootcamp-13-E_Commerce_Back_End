const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const user_data = await Product.findAll({
      include: [Tag, Category] /* JBS use of array not documented */
    });
    res.status(200).json(user_data);
  } catch (err) {
    res.status(500).json(err);
  }
});


// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const product_id = req.params.id;
    const user_data = await Product.findByPk(product_id, {
      include: [Tag, Category] /* JBS use of array not documented */
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

// create new product
let the_product = null;
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      the_product = product;
      // if there are product tags, we need to create pairings 
      // to bulk create in the ProductTag model.
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(201).json(product);
    })
    /* Return a bare copy of the product rather than the product tags
     * so the front end can know the id of the product just created.
     */
    .then((productTagIds) => res.status(201).json(the_product))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.status(200).json(updatedProductTags))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const product_id = req.params.id;
    const user_data = await Product.findByPk(product_id);
    if (user_data == null) {
      res.status(404).end();
    } else {
      Product.destroy({
        where: { id: product_id }
      });
      res.status(200).json(user_data);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
