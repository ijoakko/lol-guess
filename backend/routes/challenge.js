const express = require('express');
const router = express.Router();
const { getRandomChampionData } = require('../services/ddragon');

router.get('/', async (req, res) => {
  try {
    const champ = await getRandomChampionData();
    res.json(champ);
  } catch (err) {
    res.status(500).json({ error: 'No se pudo obtener un campeón' });
  }
});

module.exports = router;
