import { Request } from 'express';

export const isMobileEnvironmentUserAgentPresent = (req: Request): boolean => {
  const userAgentHeader = req.headers['user-agent'] as string;
  if (!userAgentHeader) return false;
  const lowerCaseUserAgent = userAgentHeader.toLowerCase();
  return (
    lowerCaseUserAgent.includes('android') ||
    lowerCaseUserAgent.includes('iphone') ||
    lowerCaseUserAgent.includes('ipad')
  );
};
