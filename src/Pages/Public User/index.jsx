import React, { useState, useEffect } from 'react';
import { Button, Tabs, Card, Divider } from 'antd';
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
  
    // Create the vCard content
    const vcard = `
      BEGIN:VCARD
      VERSION:3.0
      FN:${profile.name}
      ORG:${profile.company}
      EMAIL:${profile.emails[0]}
      TEL:${profile.phones[0]}
      NOTE:${profile.bio}
      URL:${profile.socials[0]}
      END:VCARD
    `.trim(); // Trim whitespace for cleaner formatting
  
    // Encode vCard content to create a data URL
    const vCardDataUrl = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`;
  
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = vCardDataUrl;
    a.download = `${profile.name}.vcf`; // Set filename
    document.body.appendChild(a);
    a.click(); // Trigger the download
    document.body.removeChild(a); // Clean up
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
             <h2 className="text-xl flex font-bold text-gray-900">{userData.profile.name} <span className='ml-2'><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0,0,256,256">
<g fill="#ffcb05" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(4,4)"><path d="M32,6c-14.359,0 -26,11.641 -26,26c0,14.359 11.641,26 26,26c14.359,0 26,-11.641 26,-26c0,-14.359 -11.641,-26 -26,-26zM45.121,28.121l-13,13c-0.586,0.586 -1.353,0.879 -2.121,0.879c-0.768,0 -1.535,-0.293 -2.121,-0.879l-8,-8c-1.172,-1.171 -1.172,-3.071 0,-4.242c1.172,-1.172 3.07,-1.172 4.242,0l5.879,5.879l10.879,-10.879c1.172,-1.172 3.07,-1.172 4.242,0c1.172,1.171 1.172,3.071 0,4.242z"></path></g></g>
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
            <Divider></Divider>
            <button onClick={handleSaveContact} className={`flex items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black bg-black text-white`}>
                 <PlusOutlined /> <span className='ml-2'>ADD TO CONTACT</span>
                </button>

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
         
        </Card>
      )}
    </div>
  );
};

export default PublicUser;
