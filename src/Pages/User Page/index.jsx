import React, { useState, useEffect } from 'react';
import { Drawer, Button, Input, message, Tabs, Space, Card, Divider } from 'antd';
import { EditOutlined, PlusOutlined, MinusOutlined, PhoneFilled, MailFilled } from '@ant-design/icons';
import { updateUser } from '../../Function/Profile';
import { fetchUser } from '../../Function/Authentication';
import getSocialIcon from '../../Misc/Social Icons';
import 'tailwindcss/tailwind.css';
import Logo from '../../Misc/Logo';

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
          <div  className="shadow-lg p-4 rounded-lg border mb-6">
          <Logo/>
            <div className="flex mt-3 flex-col items-center mb-6">
              <img
                src={userData.profile.image}
                alt="Profile"
                className="rounded-full w-40 h-40 mb-4"
              />
              <h2 className="text-xl flex font-bold text-gray-900">{userData.profile.name} <span className='ml-2'><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
<circle cx="24" cy="24" r="20" fill="#4dd0e1"></circle><path fill="#fff" d="M22.491,30.69c-0.576,0-1.152-0.22-1.591-0.659l-6.083-6.084c-0.879-0.878-0.879-2.303,0-3.182 c0.878-0.879,2.304-0.879,3.182,0l6.083,6.084c0.879,0.878,0.879,2.303,0,3.182C23.643,30.47,23.067,30.69,22.491,30.69z"></path><path fill="#fff" d="M22.491,30.69c-0.576,0-1.152-0.22-1.591-0.659c-0.879-0.878-0.879-2.303,0-3.182l9.539-9.539 c0.878-0.879,2.304-0.879,3.182,0c0.879,0.878,0.879,2.303,0,3.182l-9.539,9.539C23.643,30.47,23.067,30.69,22.491,30.69z"></path>
</svg></span></h2>
              <p className="text-gray-600">{userData.profile.company}</p>
              <p className="text-gray-500">{userData.profile.bio}</p>
            </div>

            {/* Social Links */}
            <div className="mb-6">
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
            <Divider></Divider>
            <div className="flex">

            <button  onClick={() => {
              setEditProfile(userData.profile); // Load existing profile data into the edit form
              toggleDrawer();
            }} className={`flex mr-1 items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black bg-black text-white`}>
                 <EditOutlined color='white' /> <span className='ml-2'>EDIT</span>
                </button>
           

           
            </div>
          </div >

          {/* Tabs for Emails and Phones */}
          <Tabs defaultActiveKey="1">
            <TabPane tab="Emails" key="1">
              <ul className="text-left">
                {userData.profile.emails.map((email, index) => (
                  <li className='w-full my-2 bordered border border-slate-600  rounded-lg px-3 py-2 flex ' key={index}>
                    <MailFilled/> <a className='ml-2' href={`mailto:${email}`}>{email}</a>
                  </li>
                ))}
              </ul>
            </TabPane>
            <TabPane tab="Phones" key="2">
              <ul className="text-left">
                {userData.profile.phones.map((phone, index) => (
                  <li className='w-full my-2 bordered border border-slate-600 rounded-lg px-3 py-2 flex ' key={index}>
                   <PhoneFilled/> <a className='ml-2' href={`tel:${phone}`}>{phone}</a>
                  </li>
                ))}
              </ul>
            </TabPane>
          </Tabs>

        

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
