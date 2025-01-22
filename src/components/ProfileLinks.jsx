// ProfileLinks.js
import React from 'react';
import { FaPen, FaTrash, FaLink } from 'react-icons/fa';
import styles from './EditProfile.module.css';

const ProfileLinks = ({ links, setLinks, buttonStyle }) => {
  const handleAddLink = () => {
    // Logic for adding links
  };

  return (
    <div className={styles.linksArea}>
      {links.map((link) => (
        <div key={link.id} className={styles.linkContainer}>
          <a href={link.url} target="_blank" rel="noopener noreferrer" className={buttonStyle}>
            {link.title}
          </a>
          <button type="button">
            <FaPen />
          </button>
          <button type="button">
            <FaTrash />
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddLink}>
        <FaLink /> Add Link
      </button>
    </div>
  );
};

export default ProfileLinks;
