export const shortenAddress = (address: string) => {
  if (address?.length > 5) {
    return `${address.substring(0, 5)}...${address.slice(address.length - 5)}`;
  }
  return "";
};
