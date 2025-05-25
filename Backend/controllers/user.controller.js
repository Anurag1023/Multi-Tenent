import User from '../models/users.model.js';

// List all users in the same organization (admin/manager only)
export const listUsers = async (req, res) => {
  try {
    const { organization } = req.user;
    const users = await User.find({ organization }).select('-password'); // exclude password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { newRole } = req.body;
    const validRoles = ['admin', 'manager', 'member'];

    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Ensure same organization
    if (String(user.organization) !== String(req.user.organization)) {
      return res.status(403).json({ message: 'Cannot change role for user in another organization' });
    }

    user.role = newRole;
    await user.save();

    res.json({ message: 'Role updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user (admin only, same organization)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { organization } = req.user;

    const user = await User.findOneAndDelete({ _id: id, organization });
    if (!user) return res.status(404).json({ message: 'User not found or not in your organization' });

    res.json({ message: 'User deleted', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};