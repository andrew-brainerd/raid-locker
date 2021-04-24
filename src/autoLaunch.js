const AutoLaunch = require('auto-launch');

const autoLaunchApplication = () => {
  const raidLockerAutoLauncher = new AutoLaunch({ name: 'Raid Locker' });
  raidLockerAutoLauncher.enable();
};

module.exports = {
  autoLaunchApplication
};
