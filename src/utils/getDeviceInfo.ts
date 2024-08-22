import UAParser from 'ua-parser-js';

export const getDeviceInfo = (userAgent:any) => {
  const parser = new UAParser(userAgent);
  const deviceType = parser.getDevice().type;
  const browser = parser.getBrowser().name;


  if (deviceType === 'mobile') {
    let final = {
        deviceType: 'mobile',
        browser: browser
    }
    return final;
  } else if (deviceType === 'tablet') {
    let final = {
        deviceType: 'tablet',
        browser: browser
    }
    return final;
  } else {
    let final = {
        deviceType: 'desktop',
        browser: browser
    }
    return final;
  }
};
