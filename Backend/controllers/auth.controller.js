import bcrypt from 'bcryptjs';
import { nanoid } from "nanoid";

import User from '../models/users.model.js';
import Organization from '../models/organization.model.js';
import { generateToken } from '../lib/utils.js';

export const register = async (req, res) => {
  const { name, email, password, inviteCode } = req.body;
  try {
    if(!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let organization = null;
    let role = null;

    if (inviteCode) {
      // Find org with this invite code
      organization = await Organization.findOne({ 'inviteCodes.code': inviteCode });
      if (!organization) {
        return res.status(400).json({ message: 'Invalid invite code' });
      }
      // Get role from invite
      const invite = organization.inviteCodes.find(i => i.code === inviteCode);
      role = invite.role || 'member';

      // Remove used invite code (optional, for one-time use)
      organization.inviteCodes = organization.inviteCodes.filter(i => i.code !== inviteCode);
      await organization.save();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || null,
      organization: organization ? organization._id : null
    });

    await newUser.save();

    if (organization) {
      organization.members.push(newUser._id);
      await organization.save();
    }

    generateToken(newUser._id, res);

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organization: newUser.organization,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    generateToken(user._id, res);

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const logout = (req, res) => {
  try{
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful' });

  }catch (error) {  
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const OrganizationRegister = async (req, res) => {
  
  try {
    
    const {OrgName} = req.body;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }   

    const { _id } = user;

    if (!OrgName) {
      return res.status(400).json({ message: 'Organization name is required' });
    };

    const existingOrg = await Organization.findOne({ name: OrgName });
    if (existingOrg) {
      return res.status(400).json({ message: 'Organization already exists' });
    }

    const code = nanoid(12);
    const newOrganization = new Organization({
      name: OrgName,
      members: [_id],
      inviteCodes: [{ code, role: "member" }]
    });

    const savedOrganization = await newOrganization.save();
    
    if (!savedOrganization) {
      return res.status(400).json({ message: 'Organization registration failed' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { organization: savedOrganization._id, role: 'admin' },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: 'User update failed' });
    }

    generateToken(updatedUser._id, res);

    return res.status(201).json({
      message: 'Organization registered successfully',
      organization: {
        id: savedOrganization._id,
        name: savedOrganization.name,
        members: savedOrganization.members,
      },
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        organization: updatedUser.organization,
      },
      inviteCode: code
    });

  } catch (error) {
    console.error('Organization registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const OrganizationLogin = async (req, res) => {
  try {
    const user = req.user;

    if (!user.organization) {
      return res.status(400).json({ message: 'User is not part of any organization' });
    }

    const organization = await Organization.findById(user.organization).populate('members');
    if (!organization) {
      return res.status(400).json({ message: 'Organization not found' });
    }

    generateToken(user._id, res);

    return res.status(200).json({
      message: 'Organization login successful',
      organization: {
        id: organization._id,
        name: organization.name,
        members: organization.members,
      },
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      },
    });

  } catch (error) {
    console.error('Organization login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const checkAuth = async (req, res) => {
  try {
    // req.user should be set by your authentication middleware
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    // Optionally, you can return user info (excluding sensitive data)
    res.status(200).json({
      message: "Authenticated",
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        organization: req.user.organization,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

