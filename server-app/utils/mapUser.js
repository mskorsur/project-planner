module.exports = (userData) => {
    if (userData === null) {
        return null;
    }

    return {
        id: userData._id,
        userName: userData.userName,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        organization: userData.organization,
        github: userData.github,
        projects: userData.projects
    }
}