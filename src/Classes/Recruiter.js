const { clearbitKey } = require('../../config/config_test_file.js');
const clearbit = require('clearbit')(clearbitKey);

class Recruiter {
  constructor(fullName, domainName) {
    this.fullName = fullName;
    this.domainName = domainName;
  }

  findRecruiter() {
    if (this.domainName && this.fullName) {
      return clearbit.Prospector.search({
        domain: this.domainName,
        name: this.fullName
      }).then(persons => {
        if (persons.length > 0) {
          return persons.results[0].email;
        } else {
          return null;
        }
      });
    } else {
      throw new Error('No domain name or full name provided');
    }
  }
}

module.exports = Recruiter;
