const router = require('express').Router();
const ctrl = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');

// Public
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);

// Protected (admin only)
router.post('/', protect, ctrl.create);
router.put('/:id', protect, ctrl.update);
router.delete('/:id', protect, ctrl.remove);

module.exports = router;
