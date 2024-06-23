import {Client, Colors, IntentsBitField} from 'discord.js';
import * as dotenv from 'dotenv';
import * as colorette from 'colorette';
import config from './config.js';

dotenv.config();

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds],
});

/**
 * @returns {import('discord.js/typings/index.js').ColorResolvable}
 */
const getRandomColor = () => {
  const colors = Object.values(Colors);
  return colors[Math.floor(Math.random() * colors.length)];
};

client.once('ready', async () => {
  console.log(colorette.greenBright(`Logged in as ${client.user.tag}!`));

  const guild = client.guilds.cache.get(config.guildId);

  if (!guild) {
    console.log(colorette.redBright('Guild not found'));
    return;
  }

  const rainbowRole = guild.roles.cache.get(config.roleId);

  if (!rainbowRole) {
    console.log(colorette.redBright('Role not found'));
    return;
  }

  if (!config.updateSeconds <= 15 || !config.updateSeconds) {
    throw new Error('Update seconds must be greater than 15');
  }

  setInterval(() => {
    const color = getRandomColor();
    rainbowRole.setColor(color).catch(error => {
      console.error(
        colorette.redBright('Error updating role color, maybe missing permissions or rate limited?'),
        error.message || error
      );
    });
    console.log(`Updated role color to ${color}`);
  }, config.updateSeconds * 1000);
});

client.login(process.env.TOKEN);
