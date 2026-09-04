import express from 'express';
import { createEvent, getEvents, getEventById, deleteEvent } from '../../controllers/core/eventController.js';

const router = express.Router();

router.route('/')
  .post(createEvent)
  .get(getEvents);

router.route('/:id')
  .get(getEventById)
  .delete(deleteEvent);

export default router;
