import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'

import App from '../imports/ui/App.jsx'

Meteor.startup(() => {
  Stripe.setPublishableKey(Meteor.settings.public.stripe.p_key)
  render(<App />, document.getElementById('render-target'))
});
