import Booking from '../Models/Booking.js';
import Service from '../Models/Service.js';
import User from '../Models/Users.js';
import { google } from 'googleapis';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';

dotenv.config();

const createGoogleCalendarEvent = async (booking, service, user, accessToken, calendarId = 'primary') => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    summary: `Booking: ${service.serviceTitle}`,
    description: `Booking for ${user.name} with ${service.providerName}. Contact: ${service.providerContact}`,
    start: {
      dateTime: new Date(booking.scheduledDate).toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: new Date(new Date(booking.scheduledDate).getTime() + 60 * 60 * 1000).toISOString(),
      timeZone: 'UTC',
    },
    attendees: [{ email: user.email }],
  };

  try {
    const response = await calendar.events.insert({
      calendarId,
      resource: event,
    });
    return { eventId: response.data.id, eventLink: response.data.htmlLink };
  } catch (error) {
    console.error('Google Calendar error:', error.message);
    throw new Error('Failed to create calendar event');
  }
};

export const createBooking = asyncHandler(async (req, res) => {
  const { serviceId, scheduledDate, googleAccessToken } = req.body;

  if (!serviceId || !scheduledDate) {
    res.status(400);
    throw new Error('Service ID and scheduled date are required');
  }

  const service = await Service.findById(serviceId).populate('provider');
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const provider = await User.findById(service.provider._id);
  if (!provider) {
    res.status(404);
    throw new Error('Provider not found');
  }

  const booking = new Booking({
    user: req.user._id,
    service: serviceId,
    provider: service.provider._id,
    scheduledDate,
    status: 'Pending',
  });

  let userCalendarEvent = null;
  try {
    if (googleAccessToken) {
      userCalendarEvent = await createGoogleCalendarEvent(booking, service, user, googleAccessToken);
      booking.googleCalendarEventId = userCalendarEvent.eventId;
    }
  } catch (error) {
    console.error('Failed to create Google Calendar event:', error.message);
    // Optionally proceed without calendar event or notify user
  }

  await booking.save();

  res.status(201).json({
    message: 'Booking created successfully',
    booking: await booking.populate('service provider user'),
    userCalendarEventLink: userCalendarEvent ? userCalendarEvent.eventLink : null,
  });
});
export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('service provider user')
    .sort({ createdAt: -1 });
  res.status(200).json(bookings);
});

export const getProviderBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ provider: req.user._id })
    .populate('service provider user')
    .sort({ createdAt: -1 });
  res.status(200).json(bookings);
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.provider.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }

  booking.status = status;
  await booking.save();

  res.status(200).json({
    message: 'Booking status updated',
    booking: await booking.populate('service provider user'),
  });
});