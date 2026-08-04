// This function takes the logged-in user and the array of 2 users in a chat,
// and returns the name of the OTHER person.
export const getSender = (loggedUser, users) => {
    if (!users || users.length < 2) return "";
    return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
};

// This function returns the FULL user object of the OTHER person in a 1-on-1 chat.
export const getSenderFull = (loggedUser, users) => {
    if (!users || users.length < 2) return null;
    return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};