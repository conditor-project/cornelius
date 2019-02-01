/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* global cy */
describe('My First Test', function () {
  it('Visits the Cornelius site', function () {
    window.localStorage.setItem('api-conditor', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NDY4NTAxNDIsImV4cCI6MTU0OTQ0MjE0MiwiaXNzIjoiY29uZGl0b3ItYXBpIiwic3ViIjoidXNlcjphbm9ueW1vdXMiLCJqdGkiOiJvbnRuamVBeG1DMVhtcnlvSTRWd3EifQ.ArIJbUeXFONs0JKqtdNGYsq1D4WUuG3dUiMgYigME10G36lYtHsAKxXjHksFk8XmZ3vtcucCmX_Q3adT1FyREg');
    cy.visit('https://conditor-project.github.io/cornelius/');
    cy.window()
      .its('angular')
      .then(ng => {
        console.log('got angular object', ng.version);
        console.log(cy.title());
      });
  });
});
