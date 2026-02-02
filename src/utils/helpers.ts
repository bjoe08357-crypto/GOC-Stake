import Decimal from 'decimal.js';
import { BigNumberish, ethers } from 'ethers';

export function weiToToken(wei: BigNumberish | undefined): string {
  if (!wei) return '0';
  return ethers.formatUnits(wei, 18);
}

export function tokenToWei(token: string): bigint {
  return ethers.parseUnits(token, 18);
}

export const toFixed = (value: any, max?: number, type?: 'money') => {
  const roundedValue = new Decimal(
    value && (typeof value === 'number' || typeof value === 'string')
      ? value
      : '0'
  ).toFixed(max ?? 2);

  if (type === 'money') {
    return parseFloat(roundedValue).toLocaleString();
  }

  return parseFloat(roundedValue); // Convert back to number
};

export const getShortenAddress = (
  address: string,
  startLength: number = 4,
  endLength: number = 4
): string => {
  if (!address) return '';
  const { length } = address;

  // Validate if the address length is less than startLength + endLength
  if (length < startLength + endLength) {
    return address;
  }

  if (endLength > 0) {
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  }
  return `${address.slice(0, startLength)}...`;
};
