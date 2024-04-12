function compareUserData(userData1, userData2) {
    // Compare each property value
    if (userData1.difficulty !== userData2.difficulty) return false;
    if (userData1.topic !== userData2.topic) return false;
  
    // If all values are equal, return true
    return true;
  }

  module.exports = {compareUserData};