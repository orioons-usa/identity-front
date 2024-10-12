import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  List,
  Space,
  Drawer,
  Button,
  Form,
  Input,
  message,
  Tabs,
  FloatButton,
  Divider,
} from 'antd';
import { EditFilled, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { updateUser } from '../../Function/Profile';
import { fetchUser } from '../../Function/Authentication';
import getSocialIcon from '../../Misc/Social Icons';

const { Title, Text } = Typography;

const UserProfile = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profile: {
      phones: Array(5).fill(''), // Initialize with 5 empty phone fields
      emails: Array(5).fill(''), // Initialize with 5 empty email fields
      socials: Array(10).fill(''), // Initialize with 10 empty social fields
      company: '',
      bio: '',
      experience: Array(10).fill({ role: '', company: '', duration: '' }), // Initialize with 10 empty experience objects
      education: Array(5).fill({ degree: '', institution: '', year: '' }), // Initialize with 5 empty education objects
    },
  });

  // Fetch user data on component mount
  useEffect(() => {
    const userId = window.localStorage.getItem('_tex');
    fetchUser(userId).then((data) => {
      const defaultData = {
        ...data,
        profile: {
          phones: data.profile.phones || Array(5).fill(''),
          emails: data.profile.emails || Array(5).fill(''),
          socials: data.profile.socials || Array(10).fill(''),
          experience: data.profile.experience || Array(10).fill({ role: '', company: '', duration: '' }),
          education: data.profile.education || Array(5).fill({ degree: '', institution: '', year: '' }),
          company: data.profile.company || '',
          bio: data.profile.bio || '',
        },
      };
      setUserData(defaultData);
      form.setFieldsValue(defaultData);
    });
  }, [form]);

  // Handle opening and closing the drawer
  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  // Handle field changes and update the profile state
  const handleFieldChange = () => {
    const updatedProfile = form.getFieldsValue().profile;
    setUserData((prevUserData) => ({
      ...prevUserData,
      profile: {
        ...prevUserData.profile,
        ...updatedProfile,
      },
    }));
  };

  const handleUpdate = () => {
    const userId = window.localStorage.getItem('_tex');

    // Ensure at least one email and one phone number is provided
    if (!userData.profile.emails || userData.profile.emails.length === 0) {
      message.error('Please provide at least one email.');
      return;
    }
    if (!userData.profile.phones || userData.profile.phones.length === 0) {
      message.error('Please provide at least one phone number.');
      return;
    }

    // Clean profile data to ensure no empty strings or nulls
    const cleanedProfile = {
      ...userData.profile,
      emails: (userData.profile.emails || []).filter((email) => email && email.trim() !== ''),
      phones: (userData.profile.phones || []).filter((phone) => phone && phone.trim() !== ''),
      socials: (userData.profile.socials || []).filter((social) => social && social.trim() !== ''),
      experience: userData.profile.experience.filter((exp) => exp.role && exp.company && exp.duration),
      education: userData.profile.education.filter((edu) => edu.degree && edu.institution && edu.year),
    };

    updateUser(userId, cleanedProfile)
      .then(() => {
        message.success('Profile updated successfully');
        setUserData((prevUserData) => ({ ...prevUserData, profile: cleanedProfile }));
        toggleDrawer();
      })
      .catch(() => {
        message.error('Failed to update profile');
      });
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  const tabItems = [
    {
      key: '1',
      label: 'Phone Numbers',
      children: userData.profile.phones && userData.profile.phones.length > 0 ? (
        userData.profile.phones.map((phone, index) => (
          <div key={index} className="flex items-center">
            <PhoneOutlined className="mr-2 text-green-500" />
            <a href={`tel:${phone}`}>{phone}</a>
          </div>
        ))
      ) : (
        <p>No phone numbers available</p>
      ),
    },
    {
      key: '2',
      label: 'Emails',
      children: userData.profile.emails && userData.profile.emails.length > 0 ? (
        userData.profile.emails.map((email, index) => (
          <div key={index} className="flex items-center">
            <MailOutlined className="mr-2 text-blue-500" />
            <a href={`mailto:${email}`} className="text-blue-600">
              {email}
            </a>
          </div>
        ))
      ) : (
        <p>No emails available</p>
      ),
    },
  ];

  return (
    <div className="profile-container">
      <FloatButton icon={<EditFilled />} onClick={toggleDrawer} />
      <Drawer
        title="Edit Profile"
        visible={isDrawerVisible}
        onClose={toggleDrawer}
        footer={
          <div className="drawer-footer">
            <Button className="m-2" onClick={toggleDrawer}>
              Cancel
            </Button>
            <Button className="m-2" type="primary" onClick={() => form.submit()}>
              Save Changes
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFieldsChange={handleFieldChange}
          onFinish={handleUpdate}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Company" name={['profile', 'company']}>
            <Input />
          </Form.Item>
          <Form.Item label="Bio" name={['profile', 'bio']}>
            <Input.TextArea />
          </Form.Item>
          <ProfileEditableFields
            form={form}
            fieldName="emails"
            label="Emails"
            placeholder="Enter email"
          />
          <ProfileEditableFields
            form={form}
            fieldName="phones"
            label="Phone Numbers"
            placeholder="Enter phone number"
          />
          <ProfileEditableFields
            form={form}
            fieldName="socials"
            label="Social Links"
            placeholder="Enter social link"
          />
          <ProfileEditableFields
            form={form}
            fieldName="experience"
            label="Experience"
          />
          <ProfileEditableFields
            form={form}
            fieldName="education"
            label="Education"
          />
        </Form>
      </Drawer>

      <Card className="user-profile-card">
        <div className="flex flex-col justify-center">
          <div className=" flex flex-col md:flex-row space-y-3 md:space-y-0 rounded-xl shadow-lg w-full md:max-w-3xl mx-auto border border-white bg-white">
            <div className="w-full md:w-1/3 bg-white grid place-items-center">
              <img
                src="https://images.pexels.com/photos/4381392/pexels-photo-4381392.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                alt="User Image"
                className="rounded-full w-32"
              />
            </div>
            <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
              <h3 className="font-black text-gray-800 md:text-3xl text-xl">
                {userData.name}
              </h3>
              <Text>{userData.email}</Text>
              <Text className="block text-gray-500">Company: {userData.profile.company}</Text>
              <p className="md:text-lg text-gray-500 text-base">{userData.profile.bio}</p>
              <center>
                <Space size="small">
                  {userData.profile.socials.length > 0 ? (
                    userData.profile.socials.map((social, index) => (
                      <a
                        href={social}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={index}
                        className="text-xl"
                      >
                        {getSocialIcon(social)}
                      </a>
                    ))
                  ) : (
                    <p>No social links available</p>
                  )}
                </Space>
              </center>
            </div>
          </div>
        </div>
        <Tabs defaultActiveKey="1" items={tabItems} />
        <ProfileDetailsSection title="Experience" data={userData.profile.experience} />
        <ProfileDetailsSection title="Education" data={userData.profile.education} />
      </Card>
      <Divider />
      <p className="text-center text-gray-500">INTREDIA IDENTITY</p>
    </div>
  );
};

const ProfileEditableFields = ({ form, fieldName, label, placeholder }) => (
  <Form.List name={['profile', fieldName]}>
    {(fields, { add, remove }) => (
      <>
        <div className="flex">
          <Title level={5}>{label}</Title>
          <Button type="link" onClick={() => add()}>
            + Add {label}
          </Button>
        </div>
        {fields.map((field, index) => (
          <Form.Item key={field.key} label={`${label} ${index + 1}`} {...field}>
            <Input placeholder={placeholder} />
            <Button type="link" danger onClick={() => remove(field.name)}>
              Remove
            </Button>
          </Form.Item>
        ))}
      </>
    )}
  </Form.List>
);

const ProfileDetailsSection = ({ title, data }) => (
  <div className="profile-section">
    <Title level={4}>{title}</Title>
    {data && data.length > 0 ? (
      <List
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Text strong>{item.role || item.degree}</Text> at <Text>{item.company || item.institution}</Text> ({item.duration || item.year})
          </List.Item>
        )}
      />
    ) : (
      <p>No {title.toLowerCase()} available</p>
    )}
  </div>
);

export default UserProfile;
