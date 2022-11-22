const router = require('express').Router();
const { wrapAsync, authentication } = require('../../util/util');
const { USER_ROLE } = require('../models/user_model');
const { getAmount, addToWhistlist,RemoveFromWhistlist, getTrending,getUserWhistlist } = require('../controllers/collect_controller');
/**
 * @swagger  
 */
router.route('/whistlist/amount/:id').get(wrapAsync(getAmount));
router.route('/whistlist').post(authentication(USER_ROLE.ALL), wrapAsync(addToWhistlist));
router.route('/whistlist').delete(authentication(USER_ROLE.ALL), wrapAsync(RemoveFromWhistlist));
router.route('/whistlist').get(authentication(USER_ROLE.ALL), wrapAsync(getUserWhistlist));
router.route('/whistlist/trending/:n').get(wrapAsync(getTrending));
module.exports = router;
