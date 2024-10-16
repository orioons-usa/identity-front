import React, { useState, useEffect } from 'react';
import { Drawer, Button, Input, message, Tabs, Space } from 'antd';
import { EditOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { updateUser } from '../../Function/Profile';
import { fetchUser } from '../../Function/Authentication';
import getSocialIcon from '../../Misc/Social Icons';
import 'tailwindcss/tailwind.css';

const { TabPane } = Tabs;

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

  const addField = (key) => {
    if (key === 'emails' && editProfile.emails.length >= 5) {
      message.error('You can only add up to 5 emails');
      return;
    }
    if (key === 'phones' && editProfile.phones.length >= 5) {
      message.error('You can only add up to 5 phone numbers');
      return;
    }
    if (key === 'socials' && editProfile.socials.length >= 10) {
      message.error('You can only add up to 10 social links');
      return;
    }
    setEditProfile({
      ...editProfile,
      [key]: [...editProfile[key], ''],
    });
  };

  const removeField = (key, index) => {
    const updatedArray = [...editProfile[key]];
    updatedArray.splice(index, 1);
    setEditProfile({
      ...editProfile,
      [key]: updatedArray,
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
    <div className="min-h-screen bg-white text-gray-800 p-6 relative">
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

          {/* Tabs for Emails and Phones */}
          <Tabs defaultActiveKey="1">
            <TabPane tab="Emails" key="1">
              <ul>
                {userData.profile.emails.map((email, index) => (
                  <li key={index}>{email}</li>
                ))}
              </ul>
            </TabPane>
            <TabPane tab="Phones" key="2">
              <ul>
                {userData.profile.phones.map((phone, index) => (
                  <li key={index}>{phone}</li>
                ))}
              </ul>
            </TabPane>
          </Tabs>

          {/* Floating Action Button */}
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined style={{ color: '#343A40' }} />}
            onClick={() => {
              setEditProfile(userData.profile); // Load existing profile data into the edit form
              toggleDrawer();
            }}
            className="fixed bottom-6 right-6 bg-white shadow-lg"
            size="large"
          />

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
              <label className="block mb-1">Name</label>
              <Input
                placeholder="Name"
                value={editProfile.name}
                onChange={(e) => handleEditChange('name', e.target.value)}
              />
            </div>

            {/* Company */}
            <div className="mb-4">
              <label className="block mb-1">Company</label>
              <Input
                placeholder="Company"
                value={editProfile.company}
                onChange={(e) => handleEditChange('company', e.target.value)}
              />
            </div>

            {/* Bio */}
            <div className="mb-4">
              <label className="block mb-1">Bio</label>
              <Input.TextArea
                placeholder="Bio"
                value={editProfile.bio}
                onChange={(e) => handleEditChange('bio', e.target.value)}
              />
            </div>

            {/* Emails */}
            <div className="mb-4">
              <label className="block mb-1">Emails</label>
              {editProfile.emails.map((email, index) => (
                <Space key={index} className="mb-2">
                  <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      const updatedEmails = [...editProfile.emails];
                      updatedEmails[index] = e.target.value;
                      setEditProfile({ ...editProfile, emails: updatedEmails });
                    }}
                  />
                  <Button
                    type="danger"
                    icon={<MinusOutlined />}
                    onClick={() => removeField('emails', index)}
                  />
                </Space>
              ))}
              <Button
                type="dashed"
                onClick={() => addField('emails')}
                icon={<PlusOutlined />}
                disabled={editProfile.emails.length >= 5}
              >
                Add Email
              </Button>
            </div>

            {/* Phones */}
            <div className="mb-4">
              <label className="block mb-1">Phones</label>
              {editProfile.phones.map((phone, index) => (
                <Space key={index} className="mb-2">
                  <Input
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => {
                      const updatedPhones = [...editProfile.phones];
                      updatedPhones[index] = e.target.value;
                      setEditProfile({ ...editProfile, phones: updatedPhones });
                    }}
                  />
                  <Button
                    type="danger"
                    icon={<MinusOutlined />}
                    onClick={() => removeField('phones', index)}
                  />
                </Space>
              ))}
              <Button
                type="dashed"
                onClick={() => addField('phones')}
                icon={<PlusOutlined />}
                disabled={editProfile.phones.length >= 5}
              >
                Add Phone
              </Button>
            </div>

            {/* Social Links */}
            <div className="mb-4">
              <label className="block mb-1">Social Links</label>
              {editProfile.socials.map((social, index) => (
                <Space key={index} className="mb-2">
                  <Input
                    placeholder="Social Link"
                    value={social}
                    onChange={(e) => {
                      const updatedSocials = [...editProfile.socials];
                      updatedSocials[index] = e.target.value;
                      setEditProfile({ ...editProfile, socials: updatedSocials });
                    }}
                  />
                  <Button
                    type="danger"
                    icon={<MinusOutlined />}
                    onClick={() => removeField('socials', index)}
                  />
                </Space>
              ))}
              <Button
                type="dashed"
                onClick={() => addField('socials')}
                icon={<PlusOutlined />}
                disabled={editProfile.socials.length >= 10}
              >
                Add Social Link
              </Button>
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
