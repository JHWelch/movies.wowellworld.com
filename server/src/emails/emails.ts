export default {
  templates: [
    {
      name: 'reminder',
      data: {
        subject: 'Reminder: {{ theme }} is Tomorrow',
      },
    }, {
      name: 'rsvpConfirmation',
      data: {
        subject: 'Thanks for RSVPing to {{ theme }}',
        attachments: [{
          filename: 'invite.ics',
          content: '{{ ics }}',
        }],
      },
    },
  ],
}
