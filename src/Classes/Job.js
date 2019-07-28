class Job {
  constructor(company, position, date, hasApplied, recruiterName, recruiterEmail, domainName) {
    this.company = company;
    this.position = position;
    this.date = date;
    this.hasApplied = hasApplied;
    this.recruiterName = recruiterName;
    this.recruiterEmai = recruiterEmail;
    this.domainName = domainName;
  }
}

module.exports = { Job };
