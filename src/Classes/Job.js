class Job {
  constructor(company, position, date, recruiterName, domainName) {
    this.company = company;
    this.position = position;
    this.date = date;
    this.recruiterName = recruiterName;
    this.domainName = domainName;
  }
}

module.exports = { Job };
