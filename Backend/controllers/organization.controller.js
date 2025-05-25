import Organization from '../models/organization.model.js';

export const getOrganizationDetails = async (req, res) => {
  try {
    const user = req.user;
    const org = await Organization.findById(user.organization);
    if (!org) return res.status(404).json({ message: "Organization not found" });

    res.json({ name: org.name });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};