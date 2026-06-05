import Notification from '../models/Notification.js';

// Internal helper function to create a notification from other controllers
export const createNotification = async (title, message, type = 'info', link = '') => {
  try {
    const newNotification = new Notification({
      title,
      message,
      type,
      link
    });
    await newNotification.save();
    console.log(`Notification created: ${title}`);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// GET /api/notifications
// Fetch recent notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50); // Get latest 50 notifications
    
    // Also return unread count
    const unreadCount = await Notification.countDocuments({ isRead: false });

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// PUT /api/notifications/:id/read
// Mark a specific notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to mark as read' });
  }
};

// PUT /api/notifications/read-all
// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ message: 'Failed to mark all as read' });
  }
};
