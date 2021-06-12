/*
    Events route
    /api/events
*/

const { Router } = require('express');

const { validateJWT } = require('../middlewares/jwt-validator');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/fields-validator');
const { isDate } = require('../helpers/isDate');
const { getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/events');

const router = Router();

// Todas tienen que pasar por la validación del JWT
router.use( validateJWT );

// Obtener eventos
router.get('/', getEvent);

// Crear un nuevo evento
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalización es obligatoria').custom( isDate ),
        validateFields
    ],
    createEvent
    );

// Actualizar eventos
router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalización es obligatoria').custom( isDate ),
        validateFields
    ],
    updateEvent)

// Borrar evento
router.delete('/:id', deleteEvent);

module.exports = router;