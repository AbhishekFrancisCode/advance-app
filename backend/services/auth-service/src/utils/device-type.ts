import { UAParser } from 'ua-parser-js';

const getDeviceType = (userAgent: any) => {
  const Nullcheck = typeof userAgent === 'string' ? userAgent : undefined;
  const parser = new UAParser(Nullcheck);

  const device = parser.getDevice();
  const browser = parser.getBrowser();
  const os = parser.getOS();

  const deviceType = device.type || 'desktop';
  const browserName = browser.name || 'Unknown Browser';
  const osName = os.name || 'Unknown OS';

  return `${browserName} ${osName} (${deviceType})`;
};

export default getDeviceType;
