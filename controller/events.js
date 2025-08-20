const events = require('../models/events');

// CREATE - Add a new event
exports.postevents = async (req, res) => {
    try {
        const { title, description } = req.body;
        const src = req.file ? req.file.filename : null;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        const newEvent = new events({ title, src, description });
        const savedEvent = await newEvent.save();

        res.status(201).json({
            message: "Event created successfully",
            event: savedEvent
        });

    } catch (error) {
        console.error("Error posting event:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// READ - Get all events
exports.getevents = async (req, res) => {
    try {
        const allEvents = await events.find();
        res.status(200).json(allEvents);
    } catch (error) {
        console.error("Error getting events:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// READ - Get single event by ID
exports.geteventById = async (req, res) => {
    try {
        const event = await events.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error("Error getting event:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// UPDATE - Edit event
exports.updateevent = async (req, res) => {
    try {
        const { title, src, description } = req.body;
        const updatedEvent = await events.findByIdAndUpdate(
            req.params.id,
            { title, src, description },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({
            message: "Event updated successfully",
            event: updatedEvent
        });

    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// DELETE - Remove event
exports.deleteevent = async (req, res) => {
    try {
        const deletedEvent = await events.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event deleted successfully" });

    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}