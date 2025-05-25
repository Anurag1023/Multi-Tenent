import Organization from '../models/organization.model.js';
import { nanoid } from 'nanoid';

export const inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    const user = req.user;

    // Only admin/manager can invite
    if (!['admin', 'manager'].includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const org = await Organization.findById(user.organization);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    const code = nanoid(12);
    org.inviteCodes.push({ code, role, email });
    await org.save();

    // TODO: Send email with invite link if email is provided

    res.status(201).json({
      message: 'Invite created',
      inviteLink: `${process.env.FRONTEND_URL}/invite/${code}`,
      code,
      role
    });
  } catch (error) {
    console.error('Invite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};