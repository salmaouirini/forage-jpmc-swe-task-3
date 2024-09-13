import {ServerRespond} from './DataStreamer';

export interface Row {

  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  lower_bound: number,
  upper_bound: number,
  trigger_alert: number,

}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row[] {
    // to make sure serverResponds contains at least two responses
    if (serverResponds.length < 2) {
      throw new Error('Insufficient data to calculate ratio');
    }

    // Compute the average prices for ABC and DEF stocks
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const historicalAverageRatio = 1; 
    const upperBound = historicalAverageRatio * (1 + 0.10); 
    const lowerBound = historicalAverageRatio * (1 - 0.10); 
    const trigger_alert = ratio > upperBound || ratio < lowerBound ? ratio : 0;
    
    return [{
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ?
        serverResponds[0].timestamp : serverResponds[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert,
    }];

  }

}
