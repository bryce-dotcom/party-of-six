import React from 'react';

const MemberAvatar = ({ member, size = 36, style = {} }) => {
  if (member.profilePhoto) {
    return (
      <img
        src={member.profilePhoto}
        alt={member.name}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid rgba(201,169,98,0.3)',
          display: 'block',
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }
  return (
    <span
      style={{
        fontSize: size * 0.75,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        flexShrink: 0,
        ...style,
      }}
    >
      {member.avatar}
    </span>
  );
};

export default MemberAvatar;
