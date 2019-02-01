/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
/* global cy */

const getAngular = () => cy.window().its('angular');
const getElementScope = (selector) => cy.get(selector).then($el => getAngular().then(ng => ng.element($el).scope()));

describe('My First Test', function () {
  it('Visits the homepage Cornelius site', function () {
    window.localStorage.setItem('api-conditor', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NDY4NTAxNDIsImV4cCI6MTU0OTQ0MjE0MiwiaXNzIjoiY29uZGl0b3ItYXBpIiwic3ViIjoidXNlcjphbm9ueW1vdXMiLCJqdGkiOiJvbnRuamVBeG1DMVhtcnlvSTRWd3EifQ.ArIJbUeXFONs0JKqtdNGYsq1D4WUuG3dUiMgYigME10G36lYtHsAKxXjHksFk8XmZ3vtcucCmX_Q3adT1FyREg');
    cy.visit('localhost:8080');
    cy.wait(1000);
    getElementScope('.record-list').then(console.log);
    cy.get('.record-list .panel').should('have.length', 5);
  });
});
