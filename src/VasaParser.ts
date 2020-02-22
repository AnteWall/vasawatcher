import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import VasaData, { Split } from './VasaData';

const NAME_CLASS = '.f-__fullname td';
const SPLIT_ITEM_CLASS = '.split';
const SPLIT_NAME_CLASS = '.desc';
const DIFF_NAME_CLASS = '.diff';
const TIME_CLASS = '.time';
const METERS_PER_MIN_CLASS = '.min_km';
const KM_PER_HOUR_CLASS = '.kmh';
const FINISH_CLASS = '.f-time_finish_netto';

/**
 * Parses VasaPage
 */
export default class VasaParser {
  public async parse(url: string): Promise<VasaData> {
    const response = await fetch(url);
    const html = parse(await response.text());
    const data = new VasaData();
    //@ts-ignore
    data.name = html.querySelector(NAME_CLASS)?.text;
    //@ts-ignore
    const splits = html.querySelectorAll(SPLIT_ITEM_CLASS);
    splits.map(split => {
      data.addSplit(this.parseSplit(split));
    });
    data.addSplit(this.parseFinish(html));
    return data;
  }

  parseFinish(html: any): Split {
    const splitBox = html.querySelector('.box-splits');
    const node = splitBox.querySelector(FINISH_CLASS);
    return this.parseSplit(node);
  }

  parseSplit(node: any): Split {
    return {
      location: node.querySelector(SPLIT_NAME_CLASS)?.text,
      diff: node.querySelector(DIFF_NAME_CLASS)?.text,
      time: node.querySelector(TIME_CLASS)?.text,
      kmPerHour: node.querySelector(KM_PER_HOUR_CLASS)?.text,
      minPerKm: node.querySelector(METERS_PER_MIN_CLASS)?.text
    };
  }
}
