export default {
  templates: [
    {
      name: 'reminder',
      subject: 'Reminder: {{ theme }} is Tomorrow',
    }, {
      name: 'rsvpConfirmation',
      subject: 'Thanks for RSVPing to {{ theme }}',
      attachments: [{
        filename: 'invite.ics',
        content: '{{ ics }}',
      }],
    },
  ],
}
