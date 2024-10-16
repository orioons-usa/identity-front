import React, { useState, useEffect } from 'react';
import { Drawer, Button, Input, message, Tabs, Space, Card } from 'antd';
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
    <div className="min-h-screen bg-white mx-auto  w-full md:w-2/6 text-gray-800  relative">
      {userData && userData.profile && (
        <Card className="shadow-md">
          {/* Profile Info Card */}
          <Card className="shadow-lg mb-6">
            <div className="flex flex-col items-center mb-6">
              <img
                src={userData.profile.image}
                alt="Profile"
                className="rounded-full w-40 h-40 mb-4"
              />
              <h2 className="text-xl flex font-bold text-gray-900">{userData.profile.name} <span className='ml-2'><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0,0,256,256">
<g fill="#ffcb05" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(4,4)"><path d="M32,6c-14.359,0 -26,11.641 -26,26c0,14.359 11.641,26 26,26c14.359,0 26,-11.641 26,-26c0,-14.359 -11.641,-26 -26,-26zM45.121,28.121l-13,13c-0.586,0.586 -1.353,0.879 -2.121,0.879c-0.768,0 -1.535,-0.293 -2.121,-0.879l-8,-8c-1.172,-1.171 -1.172,-3.071 0,-4.242c1.172,-1.172 3.07,-1.172 4.242,0l5.879,5.879l10.879,-10.879c1.172,-1.172 3.07,-1.172 4.242,0c1.172,1.171 1.172,3.071 0,4.242z"></path></g></g>
</svg></span></h2>
              <p className="text-gray-600">{userData.profile.company}</p>
              <p className="text-gray-500">{userData.profile.bio}</p>
            </div>

            {/* Social Links */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Social Links</h3>
             <center>
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
             </center>
            </div>
          </Card>

          {/* Tabs for Emails and Phones */}
          <Tabs defaultActiveKey="1">
            <TabPane tab="Emails" key="1">
              <ul className='text-left'>
                {userData.profile.emails.map((email, index) => (
                  <li key={index}><a href={`mailto:${email}`}>{email}</a></li>
                ))}
              </ul>
            </TabPane>
            <TabPane tab="Phones" key="2">
            <ul className='text-left'>
                {userData.profile.phones.map((phone, index) => (
                  <li key={index}><a href={`tel:{phone}`}>{phone}</a></li>
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
        </Card>
      )}
    </div>
  );
};

export default UserProfile;
