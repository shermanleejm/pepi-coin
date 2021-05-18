import request from 'supertest';
import { app } from '../App';

describe('tests', () => {
  it('should create new transaction', async () => {
    var res = await request(app).post('/add-transaction').send({
      amount: 10,
      fromAddress: '4a27261bf3be759bb9886ea322329c806222abc751e074586a4fb0b9cdd08e98',
      toAddress: 'Recipient Address',
      private:
        'basiradial,myoneural,helipterum,otoconite,tipman,bestripe,provocant,cava,spitballer,rhagonate,khasa,spyproof,july,earsore,dishling,carob,marimonda,relatively,puff,proroguer,excusative,nonburning,sevenbark,mazdakean,gaia',
    });
    
    for (let i = 0; i < 7; i++) {
      res = await request(app).post('/add-transaction').send({
        amount: 10,
        fromAddress: '4a27261bf3be759bb9886ea322329c806222abc751e074586a4fb0b9cdd08e98',
        toAddress: 'Recipient Address',
        private:
          'basiradial,myoneural,helipterum,otoconite,tipman,bestripe,provocant,cava,spitballer,rhagonate,khasa,spyproof,july,earsore,dishling,carob,marimonda,relatively,puff,proroguer,excusative,nonburning,sevenbark,mazdakean,gaia',
      });
    }

    expect(res.body.length).toBe(8);
  });
});
