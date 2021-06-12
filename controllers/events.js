const { response } = require('express');
const Event = require('../models/EventModel');

const getEvent = async ( req, res = response ) => {

    const events = await Event.find()
                              .populate('user', 'name');
    try{
        return res.json({
            ok: true,
            events
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};  

const createEvent = async ( req, res = response ) => {

    const event = new Event( req.body );

    try{
        event.user = req.uid;
        const saveEvent = await event.save();

        return res.status(201).json({
            ok: true,
            event: saveEvent,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const updateEvent = async ( req, res = response ) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try{
        const event = await Event.findById( eventId );

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró ningun evento con ese id'
            });
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes privilegios para editar este evento'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const updatedEvent = await Event.findByIdAndUpdate( eventId, newEvent, { new: true, useFindAndModify: false } );

        return res.status(200).json({
            ok: true,
            event: updatedEvent
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const deleteEvent = async ( req, res = response ) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try{

        const event = await Event.findById( eventId );

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró ningun evento con ese id'
            });
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes privilegios para eliminar este evento'
            });
        }

        await Event.findByIdAndDelete( eventId )

        return res.json({ ok: true });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

module.exports = {
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
};