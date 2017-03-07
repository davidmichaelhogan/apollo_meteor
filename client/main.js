import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'

import App from '../imports/ui/App.jsx'

Meteor.startup(() => {
  Stripe.setPublishableKey('pk_test_lmbNVAicstA2tidDkASu8K20')
  render(<App />, document.getElementById('render-target'))
});
