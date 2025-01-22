import React from 'react';
import { FaCamera, FaUser, FaPaintRoller } from 'react-icons/fa';
import styles from './EditProfile.module.css';

const ProfileImage = ({ profileData, setProfileData, userId }) => {
  const handleImageChange = (file) => {
    // Handle image change logic
  };

  return (
    <div className={styles.image}>
      <label htmlFor="colorPicker">
        <FaPaintRoller />
      </label>
      <input
        type="color"
        id="colorPicker"
        value={profileData.color}
        onChange={(e) => setProfileData((prev) => ({ ...prev, color: e.target.value }))}
      />
      <button type="button">
        {!profileData.previewImage ? (
          profileData.profileImage ? <img src={profileData.profileImage} alt="Profile" /> : <FaUser />
        ) : (
          <img src={profileData.previewImage} alt="Preview" />
        )}
      </button>
    </div>
  );
};

export default ProfileImage;