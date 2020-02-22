import VasaData from './VasaData';
import { WebClient } from '@slack/web-api';

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = process.env.SLACK_TOKEN;

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = process.env.SLACK_CHANNEL || 'CTYCZ9Z2N';

export default class Slack {
  web = new WebClient(token);

  public async post(message: object) {
    console.log('Posting message');
    const res = await this.web.chat.postMessage({
      channel: conversationId,
      // @ts-ignore
      text: message!.text || 'Test',
      ...message
    });

    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
    return true;
  }

  public async postVasaUpdate(data: VasaData) {
    const message = defaultNewDiffFoundMessage;
    message.blocks[2].text.text = data.toSlackTable();
    return this.post(message);
  }
}

const defaultNewDiffFoundMessage = {
  text: 'New VasaData',
  blocks: [
    {
      type: 'section',
      text: {
        type: 'plain_text',
        emoji: true,
        text: 'New data found for follower'
      }
    },
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Unknown'
      }
    }
  ]
};
