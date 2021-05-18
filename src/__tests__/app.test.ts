import request from 'supertest';
import { ADD_TRANSACTION_ROUTE, BLOCKS_ROUTE, MINE_ROUTE } from '../const';
import { app } from '../App';

describe('tests', () => {
  const trxData = {
    amount: 10,
    fromAddress: '4a27261bf3be759bb9886ea322329c806222abc751e074586a4fb0b9cdd08e98',
    toAddress: 'Recipient Address',
    private:
      'basiradial,myoneural,helipterum,otoconite,tipman,bestripe,provocant,cava,spitballer,rhagonate,khasa,spyproof,july,earsore,dishling,carob,marimonda,relatively,puff,proroguer,excusative,nonburning,sevenbark,mazdakean,gaia',
  };

  const rewardData = {
    toAddress: trxData.fromAddress,
  };

  it('should create new transaction', async () => {
    const res = await request(app).post(ADD_TRANSACTION_ROUTE).send(trxData);
    expect(res.body.length).toBe(1);
    expect(res.statusCode).toBe(200);
  });

  it('should create 8 transactions and show 8 in pending when mining', async () => {
    for (let i = 0; i < 8; i++) {
      await request(app).post(ADD_TRANSACTION_ROUTE).send(trxData);
    }

    await request(app).post(MINE_ROUTE).send(rewardData);

    const res = await request(app).get(BLOCKS_ROUTE).send();
    expect(res.body.length).toBe(2);
  });
});
