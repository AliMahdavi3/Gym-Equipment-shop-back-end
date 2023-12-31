const express = require('express');
const equippedGymController = require('../controllers/equippedGym');
const router = express.Router();


router.post('/equippedGym', equippedGymController.createEquippedGym);
router.get('/equippedGyms', equippedGymController.getEquippedGyms);
router.get('/equippedGym/:equippedGymId', equippedGymController.getSingleEquippedGym);



module.exports = router; 