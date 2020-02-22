# VasaWatcher Slack bot

Slack bot that parses and post updates when the [Vasaloppet results](https://results.vasaloppet.se/2020/) are updated for people doing vasaloppet.

Was built in 2 hours and just for a fun project with friends.

### How to get it to work

To run locally add a `.env` file with the following

```
SLACK_TOKEN=<slack token>
MONGODB_URI=<uri to mongodfb>
SLACK_CHANNEL=<channel-id>
```

The slack token need to have access to post to channel

Run `yarn force` to force the script to post to slack every time
Run `yarn start` for it to check if data has been updated and only if it diffs from last run will it post to slack

### Deploy

It's deployed to a Heroku instance and then scheduled to run once every 10 minutes.
To create a new deploy do the following

1. Create an Heroku instance
2. Add heroku scheduler
3. Add `yarn start` as a command to run
