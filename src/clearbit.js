const { clearbitKey } = require('../config/config_test_file.js');
const clearbit = require('clearbit')(clearbitKey);

class Recruiter {
  constructor(domainName, fullName) {
    this.domainName = domainName;
    this.fullName = fullName;
  }

  findRecruiter() {
    if (this.domainName && this.fullName) {
      return clearbit.Prospector.search({
        domain: this.domain,
        name: this.fullName
      }).then(persons => (persons.results.length ? persons.results[0].email : null));
    } else {
      return null;
    }
  }
}

module.exports = Recruiter;
