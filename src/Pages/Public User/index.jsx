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
import { getPublicProfile, updateUser } from '../../Function/Profile';
import { fetchUser } from '../../Function/Authentication';
import getSocialIcon from '../../Misc/Social Icons';
import { root } from '../..';
import NotFound from '../../Misc/Not Found';
import Loading from '../../Misc/Loading';
import Logo from '../Logo';

const { Title, Text } = Typography;

const PublicUser = () => {
  const [form] = Form.useForm();
  const [loaded, setLoaded] = useState(false)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profile: {
      phones: Array(0).fill(''), // Initialize with 5 empty phone fields
      emails: Array(0).fill(''), // Initialize with 5 empty email fields
      socials: Array(0).fill(''), // Initialize with 10 empty social fields
      company: '',
      bio: '',
      experience: Array(0).fill({ role: '', company: '', duration: '' }), // Initialize with 10 empty experience objects
      education: Array(0).fill({ degree: '', institution: '', year: '' }), // Initialize with 5 empty education objects
    },
  });

  // Fetch user data on component mount
  useEffect(() => {
    let t = window.location.pathname.split("/")
    const userId = t[1]
    console.log(userId)
    getPublicProfile(userId).then((data) => {
      const defaultData = {
        profile: data,
      };
      setUserData(defaultData);
      setLoaded(true)
    }).catch((e)=>{
      root.render(<NotFound/>)
    });
  }, [form]);

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
    <>
    {
      !loaded ? <Loading/> : <div className="profile-container w-full md:w-2/5 mx-auto ">
       <div className='m-2'>
       <Logo/>
       </div>
      <Card className="user-profile-card">
        <div className="flex flex-col justify-center">
          <div className=" flex flex-col md:flex-row space-y-3 md:space-y-0 rounded-xl shadow-lg w-full md:max-w-3xl mx-auto border border-white bg-white">
            <div className="w-full md:w-1/3 bg-white grid place-items-center">
              <img
                src={userData.profile.image}
                alt="User Image"
                className="rounded-full w-32"
              />
            </div>
            <div className="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3">
              <h2 className="flex mx-auto font-black text-gray-800 md:text-3xl text-xl">
                {userData.profile.name} <span><svg className='ml-2' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
<circle cx="24" cy="24" r="20" fill="#4dd0e1"></circle><path fill="#fff" d="M22.491,30.69c-0.576,0-1.152-0.22-1.591-0.659l-6.083-6.084c-0.879-0.878-0.879-2.303,0-3.182 c0.878-0.879,2.304-0.879,3.182,0l6.083,6.084c0.879,0.878,0.879,2.303,0,3.182C23.643,30.47,23.067,30.69,22.491,30.69z"></path><path fill="#fff" d="M22.491,30.69c-0.576,0-1.152-0.22-1.591-0.659c-0.879-0.878-0.879-2.303,0-3.182l9.539-9.539 c0.878-0.879,2.304-0.879,3.182,0c0.879,0.878,0.879,2.303,0,3.182l-9.539,9.539C23.643,30.47,23.067,30.69,22.491,30.69z"></path>
</svg></span>
              </h2>
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
        <Tabs defaultActiveKey="1" items={tabItems} /><br></br>
 <br></br>       <ProfileDetailsSection title="Experience" data={userData.profile.experience} /><br></br>
 <br></br>       <ProfileDetailsSection title="Education" data={userData.profile.education} />
      </Card>
      <Divider />
      <p className="text-center text-gray-500">INTREDIA IDENTITY</p>
    </div>

    }
    </>
  );
};


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

export default PublicUser;
