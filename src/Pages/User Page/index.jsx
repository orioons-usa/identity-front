import React, { useState, useEffect } from 'react';
import { Drawer, Button, Input, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { updateUser } from '../../Function/Profile';
import { fetchUser } from '../../Function/Authentication';
import getSocialIcon from '../../Misc/Social Icons';
import 'tailwindcss/tailwind.css'; // Ensure Tailwind is loaded

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [editProfile, setEditProfile] = useState({
    emails: [],
    phones: [],
    company: '',
    bio: '',
    socials: [],
    name: '',
  });

  useEffect(() => {
    const userId = window.localStorage.getItem('_tex');
    fetchUser(userId).then((data) => setUserData(data)).catch(() => message.error('Failed to fetch user data'));
  }, []);

  const toggleDrawer = () => {
    setDrawerVisible(!isDrawerVisible);
  };

  const handleEditChange = (key, value) => {
    setEditProfile({
      ...editProfile,
      [key]: value,
    });
  };

  const handleUpdate = () => {
    const userId = window.localStorage.getItem('_tex');
    if (!editProfile.emails || editProfile.emails.length === 0) {
      message.error('Please provide at least one email.');
      return;
    }
    if (!editProfile.phones || editProfile.phones.length === 0) {
      message.error('Please provide at least one phone number.');
      return;
    }

    const cleanedProfile = {
      ...editProfile,
      emails: editProfile.emails.filter((email) => email && email.trim() !== ''),
      phones: editProfile.phones.filter((phone) => phone && phone.trim() !== ''),
      socials: editProfile.socials.filter((social) => social && social.trim() !== ''),
    };

    updateUser(userId, cleanedProfile)
      .then(() => {
        message.success('Profile updated successfully');
        setUserData((prevData) => ({ ...prevData, profile: cleanedProfile }));
        toggleDrawer();
      })
      .catch(() => {
        message.error('Failed to update profile');
      });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      {userData && userData.profile && (
        <>
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={userData.profile.image}
              alt="Profile"
              className="rounded-full w-40 h-40 mb-4"
            />
            <h2 className="text-3xl font-bold text-gray-900">{userData.profile.name}</h2>
            <p className="text-gray-600">{userData.profile.company}</p>
            <p className="text-gray-500">{userData.profile.bio}</p>
          </div>

          {/* Contact Information */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Contact Information</h3>
            <p>Emails:</p>
            <ul>
              {userData.profile.emails.map((email, index) => (
                <li key={index}>{email}</li>
              ))}
            </ul>
            <p>Phone:</p>
            <ul>
              {userData.profile.phones.map((phone, index) => (
                <li key={index}>{phone}</li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Social Links</h3>
            <div className="flex space-x-4">
              {userData.profile.socials.map((social, index) => (
                <a
                  key={index}
                  href={social}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900"
                >
                  {getSocialIcon(social)}
                </a>
              ))}
            </div>
          </div>

          {/* Edit Button */}
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setEditProfile(userData.profile); // Load existing profile data into the edit form
              toggleDrawer();
            }}
          >
            Edit Profile
          </Button>

          {/* Drawer for Editing Profile */}
          <Drawer
            title="Edit Profile"
            placement="right"
            onClose={toggleDrawer}
            visible={isDrawerVisible}
            width={400}
          >
            {/* Name */}
            <div className="mb-4">
              <Input
                placeholder="Name"
                value={editProfile.name}
                onChange={(e) => handleEditChange('name', e.target.value)}
              />
            </div>

            {/* Company */}
            <div className="mb-4">
              <Input
                placeholder="Company"
                value={editProfile.company}
                onChange={(e) => handleEditChange('company', e.target.value)}
              />
            </div>

            {/* Bio */}
            <div className="mb-4">
              <Input.TextArea
                placeholder="Bio"
                value={editProfile.bio}
                onChange={(e) => handleEditChange('bio', e.target.value)}
              />
            </div>

            {/* Emails */}
            <div className="mb-4">
              <Input.TextArea
                placeholder="Emails (comma separated)"
                value={editProfile.emails.join(', ')}
                onChange={(e) => handleEditChange('emails', e.target.value.split(',').map((email) => email.trim()))}
              />
            </div>

            {/* Phones */}
            <div className="mb-4">
              <Input.TextArea
                placeholder="Phones (comma separated)"
                value={editProfile.phones.join(', ')}
                onChange={(e) => handleEditChange('phones', e.target.value.split(',').map((phone) => phone.trim()))}
              />
            </div>

            {/* Social Links */}
            <div className="mb-4">
              <Input.TextArea
                placeholder="Social Links (comma separated)"
                value={editProfile.socials.join(', ')}
                onChange={(e) => handleEditChange('socials', e.target.value.split(',').map((link) => link.trim()))}
              />
            </div>

            {/* Save Button */}
            <Button type="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Drawer>
        </>
      )}
    </div>
  );
};

export default UserProfile;
