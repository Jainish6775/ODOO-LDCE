const UserModel = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/token');

const authController = {
  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName, phone, city, country, bio, interests } = req.body;

      // Validation
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          error: 'Email, password, first name, and last name are required.',
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }

      // Check for existing user
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      // Create user
      const passwordHash = await hashPassword(password);
      const userId = await UserModel.create({
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        city,
        country,
        bio,
      });

      // Set travel interests if provided
      if (interests && interests.length > 0) {
        await UserModel.setInterests(userId, interests);
      }

      // Generate token
      const token = generateToken({ id: userId, email });

      const user = await UserModel.findById(userId);
      const userInterests = await UserModel.getInterests(userId);

      res.status(201).json({
        message: 'Account created successfully.',
        token,
        user: { ...user, interests: userInterests },
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const isMatch = await comparePassword(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = generateToken({ id: user.id, email: user.email });
      const interests = await UserModel.getInterests(user.id);

      res.json({
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          city: user.city,
          country: user.country,
          bio: user.bio,
          profile_image: user.profile_image,
          preferred_currency: user.preferred_currency,
          preferred_language: user.preferred_language,
          role: user.role,
          interests,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const interests = await UserModel.getInterests(user.id);
      res.json({ user: { ...user, interests } });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const { first_name, last_name, phone, city, country, bio, preferred_currency, preferred_language, interests } = req.body;

      await UserModel.update(req.user.id, {
        first_name,
        last_name,
        phone,
        city,
        country,
        bio,
        preferred_currency,
        preferred_language,
      });

      if (interests) {
        await UserModel.setInterests(req.user.id, interests);
      }

      const user = await UserModel.findById(req.user.id);
      const userInterests = await UserModel.getInterests(req.user.id);

      res.json({
        message: 'Profile updated successfully.',
        user: { ...user, interests: userInterests },
      });
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new passwords are required.' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters.' });
      }

      const user = await UserModel.findByEmail(req.user.email);
      const isMatch = await comparePassword(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }

      const passwordHash = await hashPassword(newPassword);
      await UserModel.updatePassword(req.user.id, passwordHash);

      res.json({ message: 'Password changed successfully.' });
    } catch (error) {
      next(error);
    }
  },

  async deleteAccount(req, res, next) {
    try {
      await UserModel.delete(req.user.id);
      res.json({ message: 'Account deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
