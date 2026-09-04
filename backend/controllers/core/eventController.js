import Event from '../../models/core/Event.js';

// Create a new event
export const createEvent = async (req, res, next) => {
  try {
    const { title, date, time, location, image, description, category } = req.body;
    
    const newEvent = new Event({
      title,
      date,
      time,
      location,
      image,
      description,
      category
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    next(error);
  }
};

// Get all events
export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

// Get single event
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

// Delete an event
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
};
