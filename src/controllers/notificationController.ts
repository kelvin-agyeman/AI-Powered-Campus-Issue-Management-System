import { Request, Response } from "express";
import Notification from "../models/Notification";
import { StatusCodes } from "http-status-codes";

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;

    const notifications = await Notification.find({ recipient: userId }).sort({
      createdAt: -1,
    });

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Server Error" });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user!._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { returnDocument: "after" },
    );

    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Notification not found or unauthorized",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Server Error" });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true },
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Server Error" });
  }
};
