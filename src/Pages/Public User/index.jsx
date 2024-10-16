import React, { useState, useEffect } from 'react';
import { Button, Tabs, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getPublicProfile } from '../../Function/Profile';
import getSocialIcon from '../../Misc/Social Icons';
import 'tailwindcss/tailwind.css';

const { TabPane } = Tabs;

const PublicUser = () => {
  const [userData, setUserData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let t = window.location.pathname.split('/');
    const userId = t[1].replaceAll('%20', '');
    getPublicProfile(userId)
      .then((data) => {
        const defaultData = {
          profile: data,
        };
        setUserData(defaultData);
        setLoaded(true);
      })
      .catch((e) => {
        console.error('Profile not found');
      });
  }, []);

  if (!loaded || !userData) {
    return <p>Loading...</p>;
  }

  const handleSaveContact = () => {
    const { profile } = userData;
  
    // vCard content for the contact
    const vcard = `
      BEGIN:VCARD
      VERSION:4.0
      FN:${profile.name}
      ORG:${profile.company}
      EMAIL:${profile.emails[0]}
      TEL;TYPE=work,voice:${profile.phones[0]}
      NOTE:${profile.bio}
      URL:${profile.socials.join(',')}
      END:VCARD
    `;
  
    // Create a blob with the vCard content
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
  
    // Check if the browser supports the Web Share API
    if (navigator.share) {
      navigator
        .share({
          title: 'New Contact',
          text: 'Save contact to your phone',
          files: [new File([blob], `${profile.name}.vcf`, { type: 'text/vcard' })],
        })
        .then(() => {
          console.log('Contact shared successfully');
        })
        .catch((error) => {
          console.error('Error sharing contact:', error);
        });
    } else {
      // Fallback for browsers that do not support the Web Share API
      const newLink = document.createElement('a');
      newLink.download = `${profile.name}.vcf`;
      newLink.href = url;
      newLink.click();
      URL.revokeObjectURL(url); // Clean up after download
    }
  };
  
  

  return (
    <div className="min-h-screen bg-white mx-auto w-full md:w-2/6 text-gray-800 p-1 relative">
      {userData && userData.profile && (
        <Card className="shadow-md p-1">
          {/* Profile Info Card */}
          <Card className="shadow-lg mb-6">
            <div className="flex flex-col items-center mb-6">
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
              <h3 className="text-xl font-semibold mb-4">Social Links</h3>
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
          </Card>

          {/* Tabs for Emails and Phones */}
          <Tabs defaultActiveKey="1">
            <TabPane tab="Emails" key="1">
              <ul className="text-left">
                {userData.profile.emails.map((email, index) => (
                  <li key={index}>
                    <a href={`mailto:${email}`}>{email}</a>
                  </li>
                ))}
              </ul>
            </TabPane>
            <TabPane tab="Phones" key="2">
              <ul className="text-left">
                {userData.profile.phones.map((phone, index) => (
                  <li key={index}>
                    <a href={`tel:${phone}`}>{phone}</a>
                  </li>
                ))}
              </ul>
            </TabPane>
          </Tabs>

          {/* Floating Action Button */}
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={handleSaveContact}
            className="fixed bottom-6 right-6 bg-white shadow-lg"
            size="large"
          />
        </Card>
      )}
    </div>
  );
};

export default PublicUser;
